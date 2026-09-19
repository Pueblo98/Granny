package org.pueblo98.granny.c2observer;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
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
import android.view.WindowManager;

import java.nio.ByteBuffer;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Captures at most one down-sampled in-memory frame and then releases every
 * projection resource. No bitmap, screenshot, content text, or network output
 * is created.
 */
public final class CaptureService extends Service {
    public static final String ACTION_RESULT = "org.pueblo98.granny.c2observer.RESULT";
    public static final String EXTRA_STATUS = "status";
    public static final String EXTRA_MESSAGE = "message";
    public static final String EXTRA_UNCERTAINTY = "uncertainty";

    private static final String ACTION_START = "org.pueblo98.granny.c2observer.START";
    private static final String ACTION_STOP = "org.pueblo98.granny.c2observer.STOP";
    private static final String EXTRA_RESULT_CODE = "resultCode";
    private static final String EXTRA_RESULT_DATA = "resultData";
    private static final String EXTRA_GENERATION = "generation";
    private static final String CHANNEL_ID = "c2_capture_active";
    private static final int NOTIFICATION_ID = 2102;
    private static final long FRAME_TIMEOUT_MILLIS = 4_000L;

    private final AtomicBoolean finished = new AtomicBoolean(false);
    private final FixtureMarkerInterpreter interpreter = new FixtureMarkerInterpreter();
    private final CaptureGeometry geometry = new CaptureGeometry();
    private HandlerThread workerThread;
    private Handler worker;
    private MediaProjection projection;
    private VirtualDisplay virtualDisplay;
    private ImageReader imageReader;
    private int densityDpi;

    public static void start(Context context, int resultCode, Intent resultData, long generation) {
        Intent intent = new Intent(context, CaptureService.class)
                .setAction(ACTION_START)
                .putExtra(EXTRA_RESULT_CODE, resultCode)
                .putExtra(EXTRA_RESULT_DATA, resultData)
                .putExtra(EXTRA_GENERATION, generation);
        context.startForegroundService(intent);
    }

    public static void requestStop(Context context) {
        Intent intent = new Intent(context, CaptureService.class).setAction(ACTION_STOP);
        context.startService(intent);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        workerThread = new HandlerThread("c2-frame-sampler");
        workerThread.start();
        worker = new Handler(workerThread.getLooper());
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            finish("UNAVAILABLE", "Capture service restarted without an authorized session.",
                    "Projection consent is one-use and is not restored after restart.", false);
            return START_NOT_STICKY;
        }
        if (ACTION_STOP.equals(intent.getAction())) {
            worker.post(() -> finish("STOPPED", "Capture stopped. No explanation was produced.",
                    "A stopped session is never resumed automatically.", true));
            return START_NOT_STICKY;
        }
        if (!ACTION_START.equals(intent.getAction())) {
            finish("UNAVAILABLE", "Unknown capture request was refused.",
                    "Only the fixed local start and stop actions are accepted.", false);
            return START_NOT_STICKY;
        }

        startForeground(
                NOTIFICATION_ID,
                buildNotification(),
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);

        int resultCode = intent.getIntExtra(EXTRA_RESULT_CODE, ActivityResultCodes.CANCELLED);
        Intent resultData = intent.getParcelableExtra(EXTRA_RESULT_DATA, Intent.class);
        if (resultCode != ActivityResultCodes.OK || resultData == null) {
            finish("UNAVAILABLE", "Android did not provide a valid one-use capture grant.",
                    "No frame was captured.", true);
            return START_NOT_STICKY;
        }

        worker.post(() -> {
            try {
                beginProjection(resultCode, resultData);
            } catch (RuntimeException error) {
                finish("UNAVAILABLE", "Capture could not start on this configuration.",
                        error.getClass().getSimpleName() + "; no compatibility claim is made.", true);
            }
        });
        return START_NOT_STICKY;
    }

    private void beginProjection(int resultCode, Intent resultData) {
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
        worker.postDelayed(() -> finish(
                "UNAVAILABLE",
                "No usable frame arrived before the bounded timeout.",
                "The selected window may be protected, unavailable, or incompatible.",
                true), FRAME_TIMEOUT_MILLIS);
    }

    private ImageReader createImageReader(int width, int height) {
        ImageReader reader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2);
        reader.setOnImageAvailableListener(this::onImageAvailable, worker);
        return reader;
    }

    private void resizeCapture(int width, int height) {
        if (finished.get()) {
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
        if (finished.get()) {
            return;
        }
        try (Image image = reader.acquireLatestImage()) {
            if (image == null || image.getPlanes().length == 0) {
                return;
            }
            Image.Plane plane = image.getPlanes()[0];
            ByteBuffer buffer = plane.getBuffer();
            FrameSample sample = FrameSample.fromRgba(
                    buffer,
                    image.getWidth(),
                    image.getHeight(),
                    plane.getPixelStride(),
                    plane.getRowStride(),
                    16);
            FixtureMarkerInterpreter.Interpretation interpretation = interpreter.interpret(sample);
            finish(
                    interpretation.status.name(),
                    interpretation.message,
                    interpretation.uncertainty,
                    true);
        } catch (RuntimeException error) {
            finish("UNAVAILABLE", "The sampled frame could not be interpreted safely.",
                    error.getClass().getSimpleName() + "; no frame was retained.", true);
        }
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

        Intent result = new Intent(ACTION_RESULT)
                .setPackage(getPackageName())
                .putExtra(EXTRA_STATUS, status)
                .putExtra(EXTRA_MESSAGE, message)
                .putExtra(EXTRA_UNCERTAINTY, uncertainty);
        sendBroadcast(result);
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
        if (workerThread != null) {
            workerThread.quitSafely();
        }
    }

    private Notification buildNotification() {
        Intent stopIntent = new Intent(this, CaptureService.class).setAction(ACTION_STOP);
        PendingIntent stop = PendingIntent.getService(
                this,
                0,
                stopIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_menu_view)
                .setContentTitle("Synthetic screen check active")
                .setContentText("One frame only. Use Stop or Android's sharing chip.")
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
    public void onDestroy() {
        if (!finished.get()) {
            finish("STOPPED", "Capture service ended.",
                    "No automatic restart is allowed.", true);
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
