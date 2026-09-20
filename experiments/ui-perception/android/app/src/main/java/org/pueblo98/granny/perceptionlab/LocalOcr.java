package org.pueblo98.granny.perceptionlab;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import com.googlecode.tesseract.android.TessBaseAPI;
import com.googlecode.tesseract.android.ResultIterator;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/** Single local worker. Cancellation suppresses delivery, not immediate native CPU work. */
final class LocalOcr {
    private static final AtomicBoolean BUSY = new AtomicBoolean();
    private static final Handler MAIN = new Handler(Looper.getMainLooper());
    interface Callback { void complete(List<Line> lines, long elapsed, String status); }
    static final class Line {
        final String text; final Rect bounds; final float score;
        Line(String text, Rect bounds, float score) { this.text = text; this.bounds = bounds; this.score = score; }
    }
    static final class Request {
        private Callback callback;
        Request(Callback callback) { this.callback = callback; }
        synchronized void cancel() { callback = null; }
        synchronized boolean active() { return callback != null; }
        synchronized void deliver(List<Line> lines, long elapsed, String status) {
            Callback target = callback; callback = null;
            if (target != null) target.complete(lines, elapsed, status);
        }
    }
    // Takes ownership of input, including the busy path. Never writes image/text to disk.
    static Request start(Context context, Bitmap input, Callback callback) {
        Request request = new Request(callback);
        if (!BUSY.compareAndSet(false, true)) {
            input.recycle(); MAIN.post(() -> request.deliver(List.of(), 0, "busy")); return request;
        }
        Context app = context.getApplicationContext();
        new Thread(() -> {
            long start = SystemClock.elapsedRealtime();
            List<Line> lines = new ArrayList<>(); String status = "failed";
            TessBaseAPI engine = null; ResultIterator iterator = null;
            try {
                if (!request.active()) return;
                File directory = new File(app.getNoBackupFilesDir(), "ocr/tessdata");
                if (!directory.isDirectory() && !directory.mkdirs()) throw new IllegalStateException();
                byte[] data;
                try (InputStream stream = app.getAssets().open("tessdata/eng.traineddata")) { data = stream.readNBytes(5_000_001); }
                StringBuilder hash = new StringBuilder();
                for (byte value : MessageDigest.getInstance("SHA-256").digest(data)) hash.append(String.format("%02x", value & 255));
                if (!hash.toString().equals("7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2")) throw new IllegalStateException();
                File model = new File(directory, "eng.traineddata");
                Files.write(model.toPath(), data); // Non-personal model only; excluded from backup.
                engine = new TessBaseAPI();
                if (!engine.init(directory.getParent(), "eng", TessBaseAPI.OEM_LSTM_ONLY)) throw new IllegalStateException();
                engine.setPageSegMode(TessBaseAPI.PageSegMode.PSM_SPARSE_TEXT);
                if (!request.active()) return;
                engine.setImage(input);
                engine.getUTF8Text();
                iterator = engine.getResultIterator();
                if (iterator != null) {
                    iterator.begin();
                    do {
                        int level = TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE;
                        String text = iterator.getUTF8Text(level); Rect bounds = iterator.getBoundingRect(level);
                        float score = iterator.confidence(level);
                        if (text != null && !text.trim().isEmpty() && text.length() <= 4096 && bounds != null
                                && bounds.left >= 0 && bounds.top >= 0 && bounds.right <= input.getWidth()
                                && bounds.bottom <= input.getHeight() && bounds.width() > 0 && bounds.height() > 0
                                && Float.isFinite(score) && score >= 0 && score <= 100) {
                            lines.add(new Line(text.trim(), new Rect(bounds), score));
                        }
                    } while (lines.size() < 128 && request.active() && iterator.next(TessBaseAPI.PageIteratorLevel.RIL_TEXTLINE));
                }
                status = "completed-partial";
            } catch (Exception | LinkageError error) { lines.clear(); }
            finally {
                try {
                    try { if (iterator != null) iterator.delete(); }
                    finally { if (engine != null) engine.recycle(); }
                } finally { input.recycle(); BUSY.set(false); }
            }
            long elapsed = SystemClock.elapsedRealtime() - start;
            String result = elapsed > 10000 ? "expired" : status;
            List<Line> output = result.equals("completed-partial") ? List.copyOf(lines) : List.of();
            MAIN.post(() -> request.deliver(output, elapsed, result));
        }, "fixture-ocr").start();
        MAIN.postDelayed(() -> request.deliver(List.of(), 10000, "timeout-native-cleanup-may-continue"), 10000);
        return request;
    }
}
