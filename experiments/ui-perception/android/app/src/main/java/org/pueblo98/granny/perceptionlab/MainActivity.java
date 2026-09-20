package org.pueblo98.granny.perceptionlab;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.provider.Settings;
import android.view.View;
import android.view.WindowInsets;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import org.json.JSONArray;
import org.json.JSONObject;

/** Standalone fictional-data lab. Nothing here is a production screen capability. */
public final class MainActivity extends Activity {
    private final Handler main = new Handler(Looper.getMainLooper());
    private LinearLayout fixture;
    private TextView report;
    private ImageView preview;
    private Bitmap retained;
    private long generation;
    private int scene;
    private Button sceneButton;
    private static final String[] SCENES = {"Baseline", "Duplicate labels", "Missing label", "Disabled control", "Canvas only"};

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        LinearLayout root = new LinearLayout(this); root.setOrientation(LinearLayout.VERTICAL);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
            view.setPadding(bars.left + 16, bars.top + 8, bars.right + 16, bars.bottom + 8); return insets;
        });
        TextView title = new TextView(this);
        title.setText("Read-only perception lab — fictional controls only. Enable the lab service manually, then Inspect. No actions, network, files or background capture.");
        root.addView(title);
        button(root, "Open accessibility settings", () -> startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)));
        button(root, "Inspect fixture once", this::inspect);
        button(root, "Stop and clear", () -> { clear(); report.setText("Stopped. Image and map cleared."); });
        sceneButton = new Button(this);
        sceneButton.setOnClickListener(view -> { clear(); scene = (scene + 1) % SCENES.length; populateFixture(); });
        root.addView(sceneButton);
        ScrollView scroll = new ScrollView(this);
        LinearLayout body = new LinearLayout(this); body.setOrientation(LinearLayout.VERTICAL);
        fixture = new LinearLayout(this); fixture.setOrientation(LinearLayout.VERTICAL);
        fixture.setBackgroundColor(Color.rgb(244, 247, 250));
        populateFixture();
        body.addView(fixture);
        report = new TextView(this); report.setText("No observation. Select a fixture case, then Inspect. Android OCR is not implemented.");
        body.addView(report);
        preview = new ImageView(this); preview.setAdjustViewBounds(true);
        preview.setContentDescription("Numbered fixture screenshot; equivalent element labels are in the text report.");
        body.addView(preview);
        scroll.addView(body); root.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(root);
    }

    private void populateFixture() {
        fixture.removeAllViews();
        sceneButton.setText("Case " + (scene + 1) + "/5: " + SCENES[scene] + " — Next case");
        if (scene != 4) {
            button(fixture, scene == 1 ? "Text size" : "Screen zoom", this::fixtureChanged);
            button(fixture, "Text size", this::fixtureChanged);
            if (scene == 3) fixture.getChildAt(1).setEnabled(false);
            if (scene == 2) {
                // An intentionally inaccessible drawn icon. Do not leak a label via fixture metadata.
                View unlabeled = new Button(this) {
                    private final Paint iconPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                    @Override protected void onDraw(Canvas canvas) {
                        super.onDraw(canvas); iconPaint.setColor(Color.DKGRAY); iconPaint.setStrokeWidth(5);
                        float x = getWidth() / 2f, y = getHeight() / 2f;
                        canvas.drawLine(x - 10, y, x + 10, y, iconPaint);
                        canvas.drawLine(x, y - 10, x, y + 10, iconPaint);
                    }
                };
                unlabeled.setOnClickListener(view -> fixtureChanged());
                fixture.addView(unlabeled);
            } else button(fixture, "Dark theme", this::fixtureChanged);
        }
        View canvasText = new View(this) {
            private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
            @Override protected void onDraw(Canvas canvas) {
                paint.setColor(Color.BLACK); paint.setTextSize(28);
                canvas.drawText("Canvas note: larger words", 12, 42, paint);
            }
        };
        canvasText.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
        fixture.addView(canvasText, new LinearLayout.LayoutParams(-1, 64));
    }

    private void button(LinearLayout parent, String label, Runnable action) {
        Button button = new Button(this); button.setText(label);
        button.setOnClickListener(view -> action.run()); parent.addView(button);
    }
    private void fixtureChanged() { clear(); report.setText("Fictional control touched. No setting changed; previous observation cleared."); }
    private void clear() {
        generation++; main.removeCallbacksAndMessages(null);
        FixtureAccessibilityService service = FixtureAccessibilityService.current(); if (service != null) service.stop();
        if (preview != null) preview.setImageDrawable(null);
        if (retained != null) { retained.recycle(); retained = null; }
        if (report != null) report.setText("No retained observation.");
    }
    private void inspect() {
        clear(); report.setText("Preparing one fixture-only observation…"); final long request = generation;
        // Let the request button/status events settle before opening the observation fence.
        main.postDelayed(() -> {
            if (request != generation) return;
            FixtureAccessibilityService service = FixtureAccessibilityService.current();
            if (service == null) { report.setText("Enable the read-only lab accessibility service manually first."); return; }
            int[] position = new int[2]; fixture.getLocationOnScreen(position);
            Rect area = new Rect(position[0], position[1], position[0] + fixture.getWidth(), position[1] + fixture.getHeight());
            Rect visible = new Rect();
            if (!fixture.getGlobalVisibleRect(visible) || !visible.equals(area)) {
                report.setText("Fixture must be fully visible. Scroll back to the top and retry."); return;
            }
            service.inspect(area, new FixtureAccessibilityService.Callback() {
                @Override public void unavailable(String reason) { if (request == generation) report.setText(reason); }
                @Override public void complete(ScreenMap map, Bitmap image, ScreenMap.Box window) {
                    try {
                        if (request != generation) return;
                        ScreenMap.Box crop = ScreenMap.toImage(new ScreenMap.Box(area.left, area.top, area.right, area.bottom), window, image.getWidth(), image.getHeight());
                        retained = Bitmap.createBitmap(crop.width(), crop.height(), Bitmap.Config.ARGB_8888);
                        Canvas canvas = new Canvas(retained);
                        canvas.drawBitmap(image, new Rect(crop.left, crop.top, crop.right, crop.bottom), new Rect(0, 0, crop.width(), crop.height()), null);
                        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG); paint.setStrokeWidth(3); paint.setTextSize(24);
                        JSONArray elements = new JSONArray(); int number = 0;
                        for (ScreenMap.Element element : map.elements) {
                            ScreenMap.Box b = ScreenMap.toImage(element.bounds, window, image.getWidth(), image.getHeight());
                            int l = b.left - crop.left, t = b.top - crop.top, r = b.right - crop.left, bottom = b.bottom - crop.top;
                            paint.setColor(Color.BLUE); paint.setStyle(Paint.Style.STROKE); canvas.drawRect(l, t, r, bottom, paint);
                            paint.setStyle(Paint.Style.FILL); canvas.drawText("[" + (++number) + "]", l + 3, t + 25, paint);
                            elements.put(new JSONObject().put("id", map.observationId + ":" + number).put("number", number)
                                    .put("label", element.label).put("role", element.role)
                                    .put("bounds", new JSONArray(new int[]{l, t, r, bottom}))
                                    .put("enabled", element.enabled).put("reportedClickable", element.clickable)
                                    .put("source", "android-accessibility").put("executionAuthorized", false));
                        }
                        JSONObject output = new JSONObject().put("schemaVersion", "granny.perception.android-lab.v1")
                                .put("observationId", map.observationId).put("capturedAtElapsedMs", map.capturedAt)
                                .put("windowId", map.windowId).put("coordinateSpace", "fixture-image-pixels")
                                .put("completeness", "partial").put("ocr", "not-implemented-on-device")
                                .put("executionAuthorized", false).put("elements", elements);
                        long now = SystemClock.elapsedRealtime();
                        String textSize = map.lookup("Text size", now, map.windowId);
                        String send = map.lookup("Send", now, map.windowId);
                        output.put("referenceChecksAtCapture", new JSONObject().put("textSize", textSize)
                                .put("send", send).put("unlabeledControls", map.unlabeledControls()));
                        preview.setImageBitmap(retained);
                        report.setText("Snapshot only — no actions authorized.\nText size: " + textSize
                                + "\nSend: " + send + "\nUnlabeled controls: " + map.unlabeledControls()
                                + "\nObserved elements: " + map.elements.size() + "\n\n" + output.toString(2));
                    } catch (Exception error) { clear(); report.setText("Unsupported observation; result cleared."); }
                    finally { image.recycle(); }
                }
            });
        }, 300);
    }
    @Override protected void onPause() { clear(); super.onPause(); }
}
