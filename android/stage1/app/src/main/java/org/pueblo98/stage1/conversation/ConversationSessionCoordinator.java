package org.pueblo98.stage1.conversation;

import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

/** Pure, process-local coordinator for the first fictional native conversation slice. */
public final class ConversationSessionCoordinator {
    public enum Surface { IDLE, LISTENING, TRANSCRIPT, CLARIFICATION, PREVIEW, ACTIVE, KNOWN, UNKNOWN }
    public enum Provenance { TYPED, PARTIAL_VOICE, FINAL_VOICE, EDITED_TRANSCRIPT }
    public enum Capability { TEXT_SCALE, SCREEN_EXPLANATION }
    public enum Result { ACCEPTED, STALE, DENIED, QUEUED, DISPATCHED, KNOWN, UNKNOWN }
    public interface InterpreterPort { Proposal propose(String exactRequest, long generation, long revision); }
    public static final class Proposal { public final String consequence; public Proposal(String consequence) { this.consequence = consequence; } }
    public static final class CapabilityMetadata { public final Capability capability; public final boolean enabled; public final String outcomeOracle; CapabilityMetadata(Capability c, boolean e, String o) { capability=c; enabled=e; outcomeOracle=o; } }

    public static final class ReturnAnchor {
        public final String placeId;
        public final String focusId;
        public final int scrollY;
        public ReturnAnchor(String placeId, String focusId, int scrollY) { this.placeId = placeId; this.focusId = focusId; this.scrollY = scrollY; }
        public ReturnAnchor(String focusId, int scrollY) { this("Home", focusId, scrollY); }
    }

    public static final class Snapshot {
        public final String place;
        public final ReturnAnchor returnAnchor;
        public final Surface surface;
        public final long generation;
        public final long revision;
        public final Provenance provenance;
        public final String editableRequest;
        public final String heardSoFar;
        public final String consequence;
        public final String message;
        public final boolean permitQueued;
        private Snapshot(String place, ReturnAnchor anchor, Surface surface, long generation, long revision,
                Provenance provenance, String editable, String partial, String consequence, String message,
                boolean permitQueued) {
            this.place = place; this.returnAnchor = anchor; this.surface = surface; this.generation = generation;
            this.revision = revision; this.provenance = provenance; this.editableRequest = editable;
            this.heardSoFar = partial; this.consequence = consequence; this.message = message;
            this.permitQueued = permitQueued;
        }
    }

    private final TextScaleController textScale;
    private final Runnable cancelCleanup;
    private final TextScaleStore outcomeObserver;
    private final InterpreterPort interpreter;
    private String place = "Home";
    private ReturnAnchor anchor = new ReturnAnchor("Home", "composer", 0);
    private Surface surface = Surface.IDLE;
    private long generation;
    private long revision;
    private Provenance provenance = Provenance.TYPED;
    private String editable = "";
    private String partial = "";
    private String consequence = "";
    private String message = "Type or talk to make a request.";
    private Permit permit;
    private boolean restoreRequested;

    public ConversationSessionCoordinator(TextScaleController textScale) { this(textScale, null, null, () -> {}); }
    public ConversationSessionCoordinator(TextScaleController textScale, TextScaleStore outcomeObserver) { this(textScale, outcomeObserver, null, () -> {}); }
    public ConversationSessionCoordinator(TextScaleController textScale, Runnable cancelCleanup) { this(textScale, null, null, cancelCleanup); }
    public ConversationSessionCoordinator(TextScaleController textScale, TextScaleStore outcomeObserver, Runnable cancelCleanup) {
        this(textScale, outcomeObserver, null, cancelCleanup);
    }
    public ConversationSessionCoordinator(TextScaleController textScale, TextScaleStore observer, InterpreterPort interpreter, Runnable cleanup) {
        this.textScale = textScale; this.outcomeObserver = observer; this.interpreter = interpreter; this.cancelCleanup = cleanup;
    }

    public Snapshot snapshot() { return new Snapshot(place, anchor, surface, generation, revision, provenance,
            editable, partial, consequence, message, permit != null); }
    public void setPlace(String place, ReturnAnchor anchor) {
        stop();
        this.place = place == null || place.isEmpty() ? "Home" : place;
        this.anchor = anchor == null ? new ReturnAnchor(this.place, "composer", 0) : anchor;
    }
    public long beginListening() { invalidate(); surface = Surface.LISTENING; message = "Listening. Say Done when you are ready."; return generation; }
    public Result partial(long callbackGeneration, String heard) {
        if (callbackGeneration != generation || surface != Surface.LISTENING) return Result.STALE;
        partial = heard == null ? "" : heard; provenance = Provenance.PARTIAL_VOICE; return Result.ACCEPTED;
    }
    public Result finalVoice(long callbackGeneration, String cleaned) {
        if (callbackGeneration != generation || surface != Surface.LISTENING) return Result.STALE;
        editable = cleaned == null ? "" : cleaned; partial = ""; revision++; provenance = Provenance.FINAL_VOICE;
        surface = Surface.TRANSCRIPT; message = "Review the words, then use this request."; return Result.ACCEPTED;
    }
    public Result voiceUnavailable(String reason) { invalidate(); surface = Surface.TRANSCRIPT; message = reason == null ? "Talk is unavailable. You can type instead." : reason; return Result.ACCEPTED; }
    public Result typed(String request) { return replace(request, Provenance.TYPED); }
    public Result edit(String request) { return replace(request, Provenance.EDITED_TRANSCRIPT); }
    public Result editRequest(String request) { return edit(request); }
    private Result replace(String request, Provenance source) {
        invalidate(); editable = request == null ? "" : request; revision++; provenance = source;
        surface = Surface.TRANSCRIPT; message = "Review the words, then use this request."; return Result.ACCEPTED;
    }
    public Result submit() {
        if (surface != Surface.TRANSCRIPT) return Result.DENIED;
        if (editable.trim().isEmpty()) { surface = Surface.CLARIFICATION; message = "Please type or say what you would like to do."; return Result.DENIED; }
        if (interpreter != null) return deliverProposal(generation, revision, interpreter.propose(editable, generation, revision));
        if (isTextSizeRequest(editable)) { surface = Surface.CLARIFICATION; consequence = ""; message = "Choose Standard, Larger, Larger still, or Largest."; return Result.ACCEPTED; }
        surface = Surface.CLARIFICATION; message = "I can help change Granny's text size. Choose a size or try asking to make text larger."; return Result.DENIED;
    }
    public Result deliverProposal(long proposalGeneration, long proposalRevision, Proposal proposal) {
        if (proposalGeneration != generation || proposalRevision != revision || proposal == null) return Result.STALE;
        if (proposal.consequence == null) { surface = Surface.CLARIFICATION; message = "I need a clearer request. Try asking to make text larger."; return Result.DENIED; }
        surface = Surface.CLARIFICATION; message = proposal.consequence; return Result.ACCEPTED;
    }
    public Result chooseTextScale(TextScale scale) {
        if (surface == Surface.IDLE) { generation++; revision++; provenance = Provenance.TYPED; }
        if (surface != Surface.CLARIFICATION && surface != Surface.TRANSCRIPT && surface != Surface.IDLE) return Result.DENIED;
        if (scale == null || !textScale.preview(scale)) { surface = Surface.UNKNOWN; message = "Text size is unavailable. It was not changed."; return Result.DENIED; }
        consequence = "Make Granny's text " + scale.label().toLowerCase() + ".";
        restoreRequested = false;
        surface = Surface.PREVIEW; message = "This changes only Granny's text size. Review and approve to continue."; return Result.ACCEPTED;
    }
    public Result chooseRestore() {
        if (!textScale.snapshot().restoreAvailable) return Result.DENIED;
        if (surface != Surface.CLARIFICATION && surface != Surface.TRANSCRIPT && surface != Surface.IDLE) return Result.DENIED;
        consequence = "Restore Granny's previous text size.";
        restoreRequested = true;
        surface = Surface.PREVIEW;
        message = "This restores Granny's previous text size. Review and approve to continue.";
        return Result.ACCEPTED;
    }
    public Result approve() {
        if (surface != Surface.PREVIEW || consequence.isEmpty()) return Result.DENIED;
        permit = new Permit(generation, revision, consequence, editable, expectedStored()); surface = Surface.ACTIVE;
        message = "Ready to change Granny's text size. Stop is available."; return Result.QUEUED;
    }
    public Result approve(long displayedGeneration, long displayedRevision, String displayedConsequence) {
        if (displayedGeneration != generation || displayedRevision != revision || !safeEquals(displayedConsequence, consequence)) return Result.STALE;
        return approve();
    }
    /** Admission is separate from approval so Stop can win before the local adapter executes. */
    public Result dispatchApproved() { return dispatchApproved(generation); }
    public Result dispatchApproved(long queuedGeneration) {
        if (queuedGeneration != generation) return Result.STALE;
        if (permit == null || !permit.matches(generation, revision, consequence)) return Result.STALE;
        Permit admitted = permit; permit = null;
        TextScaleController.OperationResult applied = restoreRequested ? textScale.restore() : textScale.apply();
        if (generation != admitted.generation) return Result.STALE;
        if ((applied == TextScaleController.OperationResult.APPLIED || applied == TextScaleController.OperationResult.ALREADY_APPLIED || applied == TextScaleController.OperationResult.RESTORED)
                && independentlyObserved(admitted.expected)) {
            surface = Surface.KNOWN; message = textScale.snapshot().message; return Result.KNOWN;
        }
        surface = Surface.UNKNOWN; message = textScale.snapshot().message; return Result.UNKNOWN;
    }
    public Result stop() {
        boolean inflight = surface == Surface.ACTIVE;
        invalidate(); textScale.cancelPreview(); cancelCleanup.run(); surface = inflight ? Surface.UNKNOWN : Surface.IDLE;
        message = inflight ? "Stopped. The text-size result is unknown." : "Stopped. You can talk again or type."; return Result.ACCEPTED;
    }
    public Result stop(Runnable cleanup) { boolean inflight = surface == Surface.ACTIVE; invalidate(); textScale.cancelPreview(); if (cleanup != null) cleanup.run(); cancelCleanup.run(); surface = inflight ? Surface.UNKNOWN : Surface.IDLE; message = inflight ? "Stopped. The text-size result is unknown." : "Stopped. You can talk again or type."; return Result.ACCEPTED; }
    /** Drops active private text and authority on background/recreation; it never resumes work. */
    public Result clearForBackground(Runnable cleanup) {
        boolean inflight = surface == Surface.ACTIVE;
        invalidate(); textScale.cancelPreview();
        if (cleanup != null) cleanup.run(); cancelCleanup.run();
        editable = ""; partial = ""; provenance = Provenance.TYPED;
        surface = inflight ? Surface.UNKNOWN : Surface.IDLE;
        message = inflight ? "The text-size result is unknown." : "Type or talk to make a request.";
        return Result.ACCEPTED;
    }
    public Result dismissResult() { if (surface != Surface.KNOWN && surface != Surface.UNKNOWN) return Result.DENIED; surface = Surface.IDLE; consequence = ""; message = "Type or talk to make a request."; return Result.ACCEPTED; }
    public boolean isEnabled(Capability capability) { return capability == Capability.TEXT_SCALE; }
    public CapabilityMetadata metadata(Capability capability) { return capability == Capability.TEXT_SCALE ? new CapabilityMetadata(capability, true, "private preference readback") : new CapabilityMetadata(capability, false, "unadmitted"); }
    private void invalidate() { generation++; permit = null; partial = ""; consequence = ""; restoreRequested = false; textScale.cancelPreview(); }
    private TextScaleStore.StoredValue expectedStored() { return outcomeObserver != null && outcomeObserver.read().status == TextScaleStore.ReadResult.Status.PRESENT ? outcomeObserver.read().value : null; }
    private boolean independentlyObserved(TextScaleStore.StoredValue before) {
        if (outcomeObserver == null) return false;
        TextScaleStore.ReadResult observed = outcomeObserver.read();
        return observed.status == TextScaleStore.ReadResult.Status.PRESENT
                && observed.value.current == textScale.snapshot().current
                && (before == null ? observed.value.version == 1 : observed.value.version == before.version + 1);
    }
    private static boolean isTextSizeRequest(String value) { return value.trim().equalsIgnoreCase("make text larger") || value.trim().equalsIgnoreCase("make granny text larger") || value.trim().equalsIgnoreCase("make this bigger"); }
    private static final class Permit {
        final long generation, revision; final String consequence, exactRequest; final TextScaleStore.StoredValue expected;
        Permit(long generation, long revision, String consequence, String exactRequest, TextScaleStore.StoredValue expected) { this.generation = generation; this.revision = revision; this.consequence = consequence; this.exactRequest=exactRequest; this.expected=expected; }
        boolean matches(long generation, long revision, String consequence) { return this.generation == generation && this.revision == revision && this.consequence.equals(consequence); }
    }
    private static boolean safeEquals(String left, String right) { return left == null ? right == null : left.equals(right); }
}
