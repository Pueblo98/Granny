package org.pueblo98.granny.c2observer;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.media.projection.MediaProjectionManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

/** Manual lab surface for one synthetic, user-consented projection session. */
public final class MainActivity extends Activity {
    private static final int REQUEST_CAPTURE = 4001;
    private static final String FIXTURE_PACKAGE = "org.pueblo98.granny.c2fixture";
    private static final long CONSENT_INVALIDATION_DELAY_MILLIS = 3_000L;

    private final CaptureSessionStateMachine stateMachine =
            new CaptureSessionStateMachine(LabSessionLedger.process().snapshot());
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final List<Button> startControls = new ArrayList<>();
    private long activeGeneration;
    private String activeTrial = CaptureTrialPlan.STANDARD;
    private TextView status;
    private Button stop;

    private final BroadcastReceiver resultReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            long resultGeneration = intent.getLongExtra(CaptureService.EXTRA_GENERATION, -1L);
            if (resultGeneration != activeGeneration) {
                return;
            }
            renderLatestSessionState();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(buildContent());
        LabSessionLedger.Snapshot restored = LabSessionLedger.process().snapshot();
        activeGeneration = restored.generation;
        if (restored.phase == LabSessionLedger.Phase.REQUESTING) {
            LabSessionLedger.process().result(
                    restored.generation,
                    "UNAVAILABLE",
                    "Capture consent was not restored after the observer was recreated.",
                    "No capture grant was retained; start a new explicit request.");
        }
        stateMachine.reconcile(LabSessionLedger.process().snapshot());
        registerReceiver(
                resultReceiver,
                new IntentFilter(CaptureService.ACTION_RESULT),
                Context.RECEIVER_NOT_EXPORTED);
    }

    @Override
    protected void onResume() {
        super.onResume();
        renderLatestSessionState();
    }

    @Override
    protected void onDestroy() {
        mainHandler.removeCallbacksAndMessages(null);
        unregisterReceiver(resultReceiver);
        super.onDestroy();
    }

    private LinearLayout buildContent() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(40), dp(36), dp(40), dp(36));
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setBackgroundColor(Color.rgb(247, 248, 250));

        TextView title = text("C2 screen explanation lab", 32, true);
        root.addView(title, matchWrap());

        TextView scope = text(
                "LAB ONLY • synthetic fixture • temporally fresh in-memory summaries • no network, storage, account, OCR, model, or app action",
                19,
                false);
        LinearLayout.LayoutParams scopeParams = matchWrap();
        scopeParams.topMargin = dp(16);
        root.addView(scope, scopeParams);

        Button fixture = button("1. Open synthetic fixture");
        fixture.setOnClickListener(ignored -> openFixture());
        LinearLayout.LayoutParams fixtureParams = matchWrap();
        fixtureParams.topMargin = dp(28);
        root.addView(fixture, fixtureParams);

        Button start = button("2. Choose fixture app window");
        startControls.add(start);
        start.setOnClickListener(ignored -> requestCapture(CaptureTrialPlan.STANDARD, false));
        LinearLayout.LayoutParams startParams = matchWrap();
        startParams.topMargin = dp(16);
        root.addView(start, startParams);

        Button stopBeforeResult = button("Test C2-07: invalidate consent after 3 seconds");
        startControls.add(stopBeforeResult);
        stopBeforeResult.setOnClickListener(
                ignored -> requestCapture(CaptureTrialPlan.STANDARD, true));
        LinearLayout.LayoutParams stopBeforeResultParams = matchWrap();
        stopBeforeResultParams.topMargin = dp(16);
        root.addView(stopBeforeResult, stopBeforeResultParams);

        stop = button("No capture to stop");
        stop.setTextColor(Color.WHITE);
        stop.setBackgroundColor(Color.rgb(142, 35, 45));
        stop.setEnabled(false);
        stop.setOnClickListener(ignored -> stopCapture());
        LinearLayout.LayoutParams stopParams = matchWrap();
        stopParams.topMargin = dp(16);
        root.addView(stop, stopParams);

        Button stopTrial = button("C2-08: 10-second Stop trial — share one app only");
        startControls.add(stopTrial);
        stopTrial.setOnClickListener(
                ignored -> requestCapture(CaptureTrialPlan.STOP, false));
        LinearLayout.LayoutParams stopTrialParams = matchWrap();
        stopTrialParams.topMargin = dp(16);
        root.addView(stopTrial, stopTrialParams);

        Button revokeTrial = button("C2-09: 10-second lock/revoke trial — share one app only");
        startControls.add(revokeTrial);
        revokeTrial.setOnClickListener(
                ignored -> requestCapture(CaptureTrialPlan.REVOKE, false));
        LinearLayout.LayoutParams revokeTrialParams = matchWrap();
        revokeTrialParams.topMargin = dp(16);
        root.addView(revokeTrial, revokeTrialParams);

        Button resizeTrial = button("C2-10: 10-second rotate trial — share one app only");
        startControls.add(resizeTrial);
        resizeTrial.setOnClickListener(
                ignored -> requestCapture(CaptureTrialPlan.RESIZE, false));
        LinearLayout.LayoutParams resizeTrialParams = matchWrap();
        resizeTrialParams.topMargin = dp(16);
        root.addView(resizeTrial, resizeTrialParams);

        Button processLossTrial = button("C2-12: 10-second task-removal trial — share one app only");
        startControls.add(processLossTrial);
        processLossTrial.setOnClickListener(
                ignored -> requestCapture(CaptureTrialPlan.PROCESS_LOSS, false));
        LinearLayout.LayoutParams processLossTrialParams = matchWrap();
        processLossTrialParams.topMargin = dp(16);
        root.addView(processLossTrial, processLossTrialParams);

        status = text("Not started. Select only the C2 Synthetic Screen Fixture app window; never select the full display.", 20, false);
        status.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
        LinearLayout.LayoutParams statusParams = matchWrap();
        statusParams.topMargin = dp(28);
        root.addView(status, statusParams);

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.addView(root);

        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.addView(scroll, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f));
        return container;
    }

    private void openFixture() {
        Intent launch = getPackageManager().getLaunchIntentForPackage(FIXTURE_PACKAGE);
        if (launch == null) {
            showStatus("Fixture unavailable. Do not install or fetch it from this screen.");
            return;
        }
        startActivity(launch);
    }

    private void requestCapture(String trial, boolean invalidateBeforeResult) {
        if (!stateMachine.canBeginRequest()) {
            showStatus("Capture is already requesting, starting, or stopping. Wait for its result before starting another trial.");
            return;
        }
        MediaProjectionManager manager = getSystemService(MediaProjectionManager.class);
        if (manager == null) {
            showStatus("Screen capture is unavailable on this configuration.");
            return;
        }
        activeTrial = trial;
        activeGeneration = stateMachine.beginRequest();
        updateStartControls();
        long requestedGeneration = activeGeneration;
        if (invalidateBeforeResult) {
            mainHandler.postDelayed(() -> {
                if (stateMachine.requestStop(requestedGeneration)) {
                    recordAndShowResult(
                            "STOPPED",
                            "C2-07 control fired. Any result from the open Android consent chooser must now be ignored.",
                            "No capture grant from this chooser may start a session.");
                }
            }, CONSENT_INVALIDATION_DELAY_MILLIS);
            showStatus("C2-07 armed. Wait at least 3 seconds in Android's chooser, then choose the fixture or cancel. The result must be ignored.");
        } else {
            showStatus(trialInstruction(trial));
        }
        if (!LabSessionLedger.process().requesting(activeGeneration, status.getText().toString())) {
            renderLatestSessionState();
            return;
        }
        updateStopControl(LabSessionLedger.Phase.REQUESTING);
        try {
            startActivityForResult(manager.createScreenCaptureIntent(), REQUEST_CAPTURE);
        } catch (RuntimeException error) {
            recordAndShowResult("UNAVAILABLE", "Android could not open capture consent.",
                    "No capture started; a new explicit request is required.");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQUEST_CAPTURE) {
            return;
        }
        if (resultCode != RESULT_OK || data == null) {
            if (stateMachine.consentDenied(activeGeneration)) {
                recordAndShowResult(
                        "NOT_STARTED",
                        "Capture not started. Android consent was denied or cancelled.",
                        "No capture grant was retained.");
            } else {
                showStatus("Late consent result was ignored because the session was stopped or replaced.");
            }
            return;
        }
        if (!stateMachine.consentGranted(activeGeneration)) {
            showStatus("Late capture consent was ignored because the session was stopped or replaced.");
            return;
        }
        // Mark the generation admitted before crossing the asynchronous service
        // boundary. A later Stop therefore invalidates the exact generation the
        // service receives, even if Android delivers STOP before START.
        if (!stateMachine.serviceStarted(activeGeneration)) {
            showStatus("Capture did not start because the session was stopped or replaced.");
            return;
        }
        try {
            CaptureService.start(this, resultCode, data, activeGeneration, activeTrial);
        } catch (RuntimeException error) {
            recordAndShowResult("UNAVAILABLE", "Android refused the capture service start.",
                    "No automatic retry is allowed.");
        }
        renderLatestSessionState();
    }

    private String trialInstruction(String trial) {
        String action;
        switch (trial) {
            case CaptureTrialPlan.STOP:
                action = "Wait two seconds after sharing starts, then return here and press the red Stop button.";
                break;
            case CaptureTrialPlan.REVOKE:
                action = "Wait two seconds after sharing starts, then lock the tablet once or use an available Android Stop-sharing control.";
                break;
            case CaptureTrialPlan.RESIZE:
                action = "Wait two seconds after sharing starts, then rotate the tablet once and wait for the result.";
                break;
            case CaptureTrialPlan.PROCESS_LOSS:
                action = "Wait two seconds after sharing starts, then open Recents and remove only the C2 Screen Explanation Lab task.";
                break;
            default:
                action = "Wait for the bounded freshness result.";
                break;
        }
        return "Choose Share one app, then select only C2 Synthetic Screen Fixture. "
                + "Never share the full screen. " + action;
    }

    private void stopCapture() {
        stateMachine.requestStop();
        LabSessionLedger.process().requestStop(activeGeneration);
        try {
            CaptureService.requestStop(this, activeGeneration);
        } catch (RuntimeException error) {
            // The shared latch already blocks further work. Do not claim
            // cleanup succeeded if Android could not deliver the command.
            showStatus("Stop requested; cleanup is unconfirmed. Use Android's Stop sharing control.");
            applyStopControl(StopControlState.stopping());
            return;
        }
        applyStopControl(StopControlState.stopping());
        showStatus("Stop requested. No new frame may be admitted.");
    }

    private void showStatus(String value) {
        status.setText(value == null ? "No result." : value);
    }

    private void recordAndShowResult(String resultStatus, String message, String uncertainty) {
        LabSessionLedger.process().result(
                activeGeneration,
                resultStatus,
                message,
                uncertainty);
        if ("UNAVAILABLE".equals(resultStatus)) {
            stateMachine.unavailable();
        } else {
            stateMachine.stopped();
        }
        renderLatestSessionState();
    }

    private void renderLatestSessionState() {
        if (status == null) {
            return;
        }
        LabSessionLedger.Snapshot snapshot = LabSessionLedger.process().snapshot();
        stateMachine.reconcile(snapshot);
        if (snapshot.phase != LabSessionLedger.Phase.IDLE && snapshot.displayText != null) {
            activeGeneration = Math.max(activeGeneration, snapshot.generation);
            showStatus(snapshot.displayText);
        }
        updateStopControl(snapshot.phase);
        updateStartControls();
    }

    private void updateStopControl(LabSessionLedger.Phase phase) {
        if (stop == null) {
            return;
        }
        if (stateMachine.state() == CaptureSessionStateMachine.State.CAPTURING) {
            applyStopControl(StopControlState.from(LabSessionLedger.Phase.ACTIVE));
            return;
        }
        if (stateMachine.state() == CaptureSessionStateMachine.State.STOPPING
                || phase == LabSessionLedger.Phase.STOPPING) {
            applyStopControl(StopControlState.stopping());
            return;
        }
        StopControlState controlState = StopControlState.from(phase);
        applyStopControl(controlState);
    }

    private void applyStopControl(StopControlState controlState) {
        stop.setEnabled(controlState.enabled);
        stop.setText(controlState.label);
    }

    private void updateStartControls() {
        boolean enabled = stateMachine.canBeginRequest();
        for (Button control : startControls) {
            control.setEnabled(enabled);
        }
    }

    private Button button(String value) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextSize(20);
        button.setMinHeight(dp(64));
        return button;
    }

    private TextView text(String value, int sp, boolean bold) {
        TextView view = new TextView(this);
        view.setText(value);
        view.setTextColor(Color.rgb(30, 35, 42));
        view.setTextSize(sp);
        view.setGravity(Gravity.CENTER);
        if (bold) {
            view.setTypeface(view.getTypeface(), android.graphics.Typeface.BOLD);
        }
        return view;
    }

    private LinearLayout.LayoutParams matchWrap() {
        return new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
