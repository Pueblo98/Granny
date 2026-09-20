package org.pueblo98.stage1.ui;

import java.util.List;
import org.pueblo98.stage1.conversation.ConversationSessionCoordinator.Surface;

/** Written state/control contract consumed by the native renderer, not a second state owner. */
public final class ConversationSurfaceModel {
    public enum Action {
        USE_REQUEST("Use this request"), LISTEN_AGAIN("Add more"),
        DONE_LISTENING("Done listening"), TYPE("Type instead"), CANCEL("Cancel"),
        EDIT("Edit request"), NONE("None of these"), APPLY("Apply this text size"),
        CHANGE("Change it"), KEEP_DRAFT("Keep this draft here"), REPEAT("Repeat"), STOP("■ Stop"),
        RESTORE("Restore previous size"), REVIEW("Review status"), DONE("Done");
        public final String label;
        Action(String label) { this.label = label; }
    }
    public final String heading;
    public final String explanation;
    public final List<Action> actions;
    public final boolean choices;
    public final boolean provisional;

    private ConversationSurfaceModel(String heading, String explanation, boolean choices,
            boolean provisional, Action... actions) {
        this.heading = heading;
        this.explanation = explanation;
        this.choices = choices;
        this.provisional = provisional;
        this.actions = List.of(actions);
    }

    public static boolean showsTalk(Surface state) {
        return state != Surface.LISTENING && state != Surface.ACTIVE && state != Surface.TRANSCRIPT;
    }
    public static boolean showsType(Surface state) { return state == Surface.IDLE; }

    public static ConversationSurfaceModel forSurface(Surface state) {
        switch (state) {
            case LISTENING:
                return new ConversationSurfaceModel("Listening", "Say what you would like to do.",
                        false, true, Action.DONE_LISTENING, Action.TYPE, Action.CANCEL);
            case TRANSCRIPT:
                return new ConversationSurfaceModel("Check what I heard",
                        "This asks Granny to understand the request. It does not send anything.",
                        false, false, Action.USE_REQUEST, Action.LISTEN_AGAIN, Action.CANCEL);
            case CLARIFICATION:
                return new ConversationSurfaceModel("Which Granny text size?",
                        "Choose the size you mean. Nothing has changed yet.",
                        true, false, Action.NONE, Action.EDIT, Action.CANCEL);
            case PREVIEW:
                return new ConversationSurfaceModel("Check the text size change",
                        "Not changed yet. Apply changes only Granny; Android and other apps keep their own settings.",
                        false, false, Action.APPLY, Action.CHANGE, Action.REPEAT, Action.CANCEL);
            case ACTIVE:
                return new ConversationSurfaceModel("Changing Granny text size",
                        "Latest verified step: exact preview approved. Current step: saving and checking the local preference.",
                        false, false, Action.REPEAT, Action.STOP);
            case KNOWN:
                return new ConversationSurfaceModel("Granny text size checked",
                        "What Granny verified: the local preference state. What Granny did not do: change Android or another app. Next step: review the text or restore the previous size.",
                        false, false, Action.RESTORE, Action.REPEAT, Action.DONE);
            case UNKNOWN:
                return new ConversationSurfaceModel("I can’t confirm the text size change",
                        "Unknown outcome. Known: a local change was requested. Unknown: whether the intended value was saved. Granny will not retry automatically. Next step: review the current status.",
                        false, false, Action.REVIEW, Action.DONE);
            case DRAFT_RECIPIENT:
                return new ConversationSurfaceModel("Which David?",
                        "These are fictional fixture contacts. Choose the intended endpoint; nothing is sent or handed to another app.",
                        true, false, Action.EDIT, Action.CANCEL);
            case DRAFT_PREVIEW:
                return new ConversationSurfaceModel("Check this local draft",
                        "Fictional local draft — not sent. Keeping it stores it only in this open session; no messaging app is opened.",
                        false, false, Action.KEEP_DRAFT, Action.CHANGE, Action.REPEAT, Action.CANCEL);
            case DRAFT_READY:
                return new ConversationSurfaceModel("Local draft ready",
                        "Not sent and not handed off. This fictional draft exists only in the current session and clears when you leave.",
                        false, false, Action.CHANGE, Action.REPEAT, Action.DONE);
            default:
                return new ConversationSurfaceModel("How can I help?",
                        "Try “make text larger” or “Tell David I’ll call after dinner.” This bounded fixture uses local fictional data only.",
                        false, false);
        }
    }
}
