package org.pueblo98.granny.c2observer;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.SystemClock;
import android.view.WindowManager;

import java.nio.ByteBuffer;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Requires a fresh synthetic marker transition from down-sampled in-memory
 * frame summaries, then releases every projection resource. No bitmap,
 * screenshot, content text, or network output is created.
 */
public final class CaptureService extends Service {
    public static final String ACTION_RESULT = "org.pueblo98.granny.c2observer.RESULT";
    public static final String EXTRA_STATUS = "status";
    public static final String EXTRA_MESSAGE = "message";
    public static final String EXTRA_UNCERTAINTY = "uncertainty";
    public static final String EXTRA_GENERATION = "generation";

    private static final String ACTION_START = "org.pueblo98.granny.c2observer.START";
    private static final String ACTION_STOP = "org.pueblo98.granny.c2observer.STOP";
    private static final String EXTRA_RESULT_CODE = "resultCode";
    private static final String EXTRA_RESULT_DATA = "resultData";
    private static final String EXTRA_TRIAL = "trial";
    private static final String CHANNEL_ID = "c2_capture_active";
    private static final int NOTIFICATION_ID = 2102;
    private static final long FRAME_TIMEOUT_MILLIS = 4_000L;

    private final AtomicBoolean finished = new AtomicBoolean(false);
    private final FixtureMarkerInterpreter interpreter = new FixtureMarkerInterpreter();
    private final FreshFrameGate freshFrameGate = new FreshFrameGate();
    private final CaptureGeometry geometry = new CaptureGeometry();
    private final LifecycleEvidenceGate lifecycleEvidenceGate = new LifecycleEvidenceGate();
    private final CaptureStartAdmission startAdmission =
            new CaptureStartAdmission(LabSessionLedger.process());
    private HandlerThread workerThread;
    private Handler worker;
    private MediaProjection projection;
    private VirtualDisplay virtualDisplay;
    private ImageReader imageReader;
    private int densityDpi;
    private long captureStartedAtMillis;
    private long holdOpenMillis;
    private boolean requireResize;
    private boolean completionScheduled;
    private FixtureMarkerInterpreter.Interpretation pendingInterpretation;
    private long generation;
    private boolean screenOffReceiverRegistered;

    private final BroadcastReceiver screenOffReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (Intent.ACTION_SCREEN_OFF.equals(intent.getAction()) && worker != null) {
                startAdmission.requestStop(generation);
                worker.post(() -> finish(
                        "STOPPED",
                        "Capture stopped when the screen turned off.",
                        "The session must be re-authorized after unlock.",
                        true));
            }
        }
    };

    public static void start(
            Context context,
            int resultCode,
            Intent resultData,
            long generation,
            String trial) {
        Intent intent = new Intent(context, CaptureService.class)
                .setAction(ACTION_START)
                .putExtra(EXTRA_RESULT_CODE, resultCode)
                .putExtra(EXTRA_RESULT_DATA, resultData)
                .putExtra(EXTRA_GENERATION, generation)
                .putExtra(EXTRA_TRIAL, trial);
        context.startForegroundService(intent);
    }

    public static void requestStop(Context context, long generation) {
        Intent intent = new Intent(context, CaptureService.class).setAction(ACTION_STOP);
        intent.putExtra(EXTRA_GENERATION, generation);
        context.startService(intent);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        workerThread = new HandlerThread("c2-frame-sampler");
        workerThread.start();
        worker = new Handler(workerThread.getLooper());
        createNotificationChannel();
        registerReceiver(
                screenOffReceiver,
                new IntentFilter(Intent.ACTION_SCREEN_OFF),
                Context.RECEIVER_EXPORTED);
        screenOffReceiverRegistered = true;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            finish("UNAVAILABLE", "Capture service restarted without an authorized session.",
                    "Projection consent is one-use and is not restored after restart.", false);
            return START_NOT_STICKY;
        }
        if (ACTION_STOP.equals(intent.getAction())) {
            long requestedGeneration = intent.getLongExtra(EXTRA_GENERATION, 0L);
            if (!startAdmission.requestStop(requestedGeneration)) {
                return START_NOT_STICKY;
            }
            generation = requestedGeneration;
            worker.post(() -> finish("STOPPED", "Capture stopped. No explanation was produced.",
                    "A stopped session is never resumed automatically.", true));
            return START_NOT_STICKY;
        }
        if (!ACTION_START.equals(intent.getAction())) {
            return START_NOT_STICKY;
        }

        long requestedGeneration = intent.getLongExtra(EXTRA_GENERATION, 0L);
        if (finished.get()) {
            if (LabSessionLedger.process().result(
                    requestedGeneration,
                    "UNAVAILABLE",
                    "A previous capture service is still closing.",
                    "No projection was started; try again after cleanup completes.")) {
                publishResult(
                        requestedGeneration,
                        "UNAVAILABLE",
                        "A previous capture service is still closing.",
                        "No projection was started; try again after cleanup completes.");
            }
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        int resultCode = intent.getIntExtra(EXTRA_RESULT_CODE, ActivityResultCodes.CANCELLED);
        Intent resultData = intent.getParcelableExtra(EXTRA_RESULT_DATA, Intent.class);
        if (resultCode != ActivityResultCodes.OK || resultData == null) {
            if (rejectStart(requestedGeneration, "Android did not provide a valid one-use capture grant.",
                    "No frame was captured.")) {
                stopSelf(startId);
            }
            return START_NOT_STICKY;
        }

        CaptureTrialPlan plan;
        try {
            plan = CaptureTrialPlan.from(intent.getStringExtra(EXTRA_TRIAL));
        } catch (IllegalArgumentException error) {
            if (rejectStart(requestedGeneration, "Unknown lifecycle trial was refused.",
                    "Only the fixed synthetic C2 trial modes are accepted.")) {
                stopSelf(startId);
            }
            return START_NOT_STICKY;
        }
        String trial = intent.getStringExtra(EXTRA_TRIAL) == null
                ? CaptureTrialPlan.STANDARD
                : intent.getStringExtra(EXTRA_TRIAL);
        if (!startAdmission.admitProjection(requestedGeneration, trial)) {
            return START_NOT_STICKY;
        }
        generation = requestedGeneration;
        holdOpenMillis = plan.holdOpenMillis;
        requireResize = plan.requireResize;
        try {
            startForeground(
                    NOTIFICATION_ID,
                    buildNotification(),
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } catch (RuntimeException error) {
            finish("UNAVAILABLE", "Capture could not enter its required visible foreground state.",
                    error.getClass().getSimpleName() + "; no compatibility claim is made.", false);
            return START_NOT_STICKY;
        }

        worker.post(() -> {
            startAdmission.runIfCaptureAllowed(generation, () -> {
                try {
                    beginProjection(resultCode, resultData);
                } catch (RuntimeException error) {
                    finish("UNAVAILABLE", "Capture could not start on this configuration.",
                            error.getClass().getSimpleName() + "; no compatibility claim is made.", true);
                }
            });
        });
        return START_NOT_STICKY;
    }

    private void beginProjection(int resultCode, Intent resultData) {
        if (finished.get() || !startAdmission.canCapture(generation)) {
            return;
        }
        captureStartedAtMillis = SystemClock.elapsedRealtime();
        MediaProjectionManager manager = getSystemService(MediaProjectionManager.class);
        if (manager == null) {
            throw new IllegalStateException("MediaProjectionManager unavailable");
        }
        projection = manager.getMediaProjection(resultCode, resultData);
        if (projection == null) {
            throw new IllegalStateException("MediaProjection unavailable");
        }
        projection.registerCallback(new MediaProjection.Callback() {
            @Override
            public void onStop() {
                startAdmission.requestStop(generation);
                finish("STOPPED", "Android ended the capture session.",
                        "No capture continues after system revocation or lock.", false);
            }

            @Override
            public void onCapturedContentResize(int width, int height) {
                resizeCapture(width, height);
            }
        }, worker);

        WindowManager windowManager = getSystemService(WindowManager.class);
        if (windowManager == null) {
            throw new IllegalStateException("WindowManager unavailable");
        }
        android.graphics.Rect bounds = windowManager.getMaximumWindowMetrics().getBounds();
        int width = Math.max(1, bounds.width());
        int height = Math.max(1, bounds.height());
        densityDpi = getResources().getDisplayMetrics().densityDpi;

        if (geometry.update(width, height) != CaptureGeometry.Decision.INITIALIZE) {
            throw new IllegalArgumentException("Initial capture geometry refused");
        }
        imageReader = createImageReader(width, height);
        virtualDisplay = projection.createVirtualDisplay(
                "c2-one-frame",
                width,
                height,
                densityDpi,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                imageReader.getSurface(),
                null,
                worker);
        if (virtualDisplay == null) {
            throw new IllegalStateException("VirtualDisplay unavailable");
        }
        long timeoutMillis = Math.max(
                FRAME_TIMEOUT_MILLIS,
                holdOpenMillis + FRAME_TIMEOUT_MILLIS);
        worker.postDelayed(() -> finish(
                "UNAVAILABLE",
                "No fresh approved fixture transition completed before the bounded timeout.",
                "The selected window may be protected, static, stale, unavailable, or incompatible.",
                true), timeoutMillis);
    }

    private boolean rejectStart(long requestedGeneration, String message, String uncertainty) {
        if (LabSessionLedger.process().result(
                requestedGeneration,
                "UNAVAILABLE",
                message,
                uncertainty)) {
            publishResult(requestedGeneration, "UNAVAILABLE", message, uncertainty);
            return true;
        }
        return false;
    }

    private void configureTrial(String requestedTrial) {
        CaptureTrialPlan plan = CaptureTrialPlan.from(requestedTrial);
        holdOpenMillis = plan.holdOpenMillis;
        requireResize = plan.requireResize;
    }

    private ImageReader createImageReader(int width, int height) {
        ImageReader reader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2);
        reader.setOnImageAvailableListener(this::onImageAvailable, worker);
        return reader;
    }

    private void resizeCapture(int width, int height) {
        if (finished.get() || !startAdmission.canCapture(generation)) {
            return;
        }
        CaptureGeometry.Decision decision = geometry.update(width, height);
        if (decision == CaptureGeometry.Decision.UNCHANGED) {
            return;
        }
        if (decision != CaptureGeometry.Decision.RESIZE || virtualDisplay == null) {
            finish("UNAVAILABLE", "Android reported an unsafe capture size.",
                    "The capture stopped without interpreting a resized frame.", true);
            return;
        }

        ImageReader replacement = null;
        try {
            replacement = createImageReader(width, height);
            virtualDisplay.resize(width, height, densityDpi);
            virtualDisplay.setSurface(replacement.getSurface());
            ImageReader previous = imageReader;
            imageReader = replacement;
            replacement = null;
            if (previous != null) {
                previous.setOnImageAvailableListener(null, null);
                previous.close();
            }
            lifecycleEvidenceGate.onResizeObserved();
            maybeFinishPending();
        } catch (RuntimeException error) {
            if (replacement != null) {
                replacement.setOnImageAvailableListener(null, null);
                replacement.close();
            }
            finish("UNAVAILABLE", "The capture surface could not resize safely.",
                    error.getClass().getSimpleName() + "; no resized frame was interpreted.", true);
        }
    }

    private void onImageAvailable(ImageReader reader) {
        if (finished.get() || !startAdmission.canCapture(generation)) {
            return;
        }
        try (Image image = reader.acquireLatestImage()) {
            if (image == null || image.getPlanes().length == 0) {
                return;
            }
            if (pendingInterpretation != null) {
                return;
            }
            Image.Plane plane = image.getPlanes()[0];
            ByteBuffer buffer = plane.getBuffer();
            FrameSample sample = FrameSample.fromMarkerBandRgba(
                    buffer,
                    image.getWidth(),
                    image.getHeight(),
                    plane.getPixelStride(),
                    plane.getRowStride(),
                    16);
            FixtureMarkerInterpreter.Interpretation interpretation = interpreter.interpret(sample);
            FreshFrameGate.Decision decision = freshFrameGate.observe(
                    interpretation,
                    SystemClock.elapsedRealtime());
            if (decision == FreshFrameGate.Decision.REJECT) {
                finish("UNAVAILABLE", "The synthetic fixture changed before freshness was verified.",
                        "No explanation is produced from mixed or replaced fixture states.", true);
            } else if (decision == FreshFrameGate.Decision.ACCEPT) {
                pendingInterpretation = interpretation;
                lifecycleEvidenceGate.onFreshnessAccepted();
                maybeFinishPending();
            }
        } catch (RuntimeException error) {
            finish("UNAVAILABLE", "The sampled frame could not be interpreted safely.",
                    error.getClass().getSimpleName() + "; no frame was retained.", true);
        }
    }

    private void maybeFinishPending() {
        if (!startAdmission.canCapture(generation)
                || pendingInterpretation == null
                || !lifecycleEvidenceGate.canFinish(requireResize)) {
            return;
        }
        long elapsed = SystemClock.elapsedRealtime() - captureStartedAtMillis;
        long remaining = holdOpenMillis - elapsed;
        if (remaining > 0L) {
            if (!completionScheduled) {
                completionScheduled = true;
                worker.postDelayed(() -> {
                    completionScheduled = false;
                    maybeFinishPending();
                }, remaining);
            }
            return;
        }
        String trialEvidence = requireResize
                ? " A bounded capture resize was observed for this trial."
                : "";
        finish(
                pendingInterpretation.status.name(),
                pendingInterpretation.message,
                pendingInterpretation.uncertainty + trialEvidence,
                true);
    }

    private void finish(String status, String message, String uncertainty, boolean stopProjection) {
        if (!finished.compareAndSet(false, true)) {
            return;
        }
        if (worker != null) {
            worker.removeCallbacksAndMessages(null);
        }
        if (imageReader != null) {
            imageReader.setOnImageAvailableListener(null, null);
        }
        if (virtualDisplay != null) {
            virtualDisplay.release();
            virtualDisplay = null;
        }
        if (imageReader != null) {
            imageReader.close();
            imageReader = null;
        }
        MediaProjection activeProjection = projection;
        projection = null;
        if (stopProjection && activeProjection != null) {
            activeProjection.stop();
        }

        LabSessionLedger.process().result(generation, status, message, uncertainty);

        publishResult(generation, status, message, uncertainty);
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
        if (workerThread != null) {
            workerThread.quitSafely();
        }
    }

    private void publishResult(long resultGeneration, String status, String message, String uncertainty) {
        Intent result = new Intent(ACTION_RESULT)
                .setPackage(getPackageName())
                .putExtra(EXTRA_GENERATION, resultGeneration)
                .putExtra(EXTRA_STATUS, status)
                .putExtra(EXTRA_MESSAGE, message)
                .putExtra(EXTRA_UNCERTAINTY, uncertainty);
        sendBroadcast(result);
    }

    private Notification buildNotification() {
        Intent stopIntent = new Intent(this, CaptureService.class).setAction(ACTION_STOP);
        PendingIntent stop = PendingIntent.getService(
                this,
                0,
                stopIntent.putExtra(EXTRA_GENERATION, generation),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_menu_view)
                .setContentTitle("Synthetic screen check active")
                .setContentText("Freshness check active. Use this Stop action at any time.")
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .addAction(new Notification.Action.Builder(null, "Stop", stop).build())
                .build();
    }

    private void createNotificationChannel() {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "C2 active capture",
                NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription("Visible local control for the one-session synthetic capture lab.");
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) {
            manager.createNotificationChannel(channel);
        }
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        startAdmission.requestStop(generation);
        if (worker != null) {
            worker.post(() -> finish(
                    "STOPPED",
                    "Capture stopped when the observer task was removed.",
                    "No capture continues without the lab task.",
                    true));
        }
        super.onTaskRemoved(rootIntent);
    }

    @Override
    public void onDestroy() {
        if (!finished.get()) {
            finish("STOPPED", "Capture service ended.",
                    "No automatic restart is allowed.", true);
        }
        if (screenOffReceiverRegistered) {
            unregisterReceiver(screenOffReceiver);
            screenOffReceiverRegistered = false;
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    /** Avoids importing Activity solely for two result constants in the service. */
    private static final class ActivityResultCodes {
        static final int OK = -1;
        static final int CANCELLED = 0;
    }
}
