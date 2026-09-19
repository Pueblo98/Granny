package org.pueblo98.stage1.conversation;

import java.util.List;
import java.util.Objects;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

/** Main-thread process-local authority. Input/interpretation is never an execution permit. */
public final class ConversationSessionCoordinator {
    public enum Surface { IDLE, LISTENING, TRANSCRIPT, CLARIFICATION, PREVIEW, ACTIVE, KNOWN, UNKNOWN }
    public enum Provenance { TYPED, PARTIAL_VOICE, FINAL_VOICE, EDITED_TRANSCRIPT, DIRECT_CONTROL }
    public enum Capability { TEXT_SCALE, SCREEN_EXPLANATION }
    public enum BuildMode { SYNTHETIC_LAB, CANDIDATE }
    public enum Result { ACCEPTED, STALE, DENIED, QUEUED, DISPATCHED, KNOWN, UNKNOWN }

    /** Null return means pending; later deliverProposal must use these exact generation/revision values. */
    public interface InterpreterPort { Proposal propose(String exactRequest, long generation, long revision); }
    public static final class Proposal {
        public final Capability capability;
        public Proposal(Capability capability) { this.capability = capability; }
        /** Compatibility for synthetic fixtures; text cannot define an action or grant authority. */
        public Proposal(String ignoredDescription) { this(Capability.TEXT_SCALE); }
    }
    public static final class FixtureInterpreter implements InterpreterPort {
        public Proposal propose(String exact, long generation, long revision) {
            String request = exact.trim();
            boolean supported = request.equalsIgnoreCase("make text larger")
                    || request.equalsIgnoreCase("make granny text larger")
                    || request.equalsIgnoreCase("make this bigger");
            return new Proposal(supported ? Capability.TEXT_SCALE : null);
        }
    }
    public static final class CapabilityMetadata {
        public final Capability capability;
        public final boolean enabled;
        public final List<String> permissions;
        public final String schema, cancellation, outcomeOracle;
        public final List<BuildMode> admittedModes;
        private CapabilityMetadata(Capability capability, boolean enabled) {
            this.capability = capability; this.enabled = enabled;
            permissions = List.of();
            schema = capability == Capability.TEXT_SCALE ? "closed TextScale / Restore; exact prior version" : "unavailable";
            cancellation = "Cancel before entry; unknown after entry until independent verification";
            outcomeOracle = capability == Capability.TEXT_SCALE ? "private preference readback" : "unadmitted";
            admittedModes = capability == Capability.TEXT_SCALE ? List.of(BuildMode.SYNTHETIC_LAB) : List.of();
        }
    }
    public static final class ReturnAnchor {
        public final String placeId, focusId;
        public final int scrollY;
        public ReturnAnchor(String placeId, String focusId, int scrollY) {
            this.placeId = placeId; this.focusId = focusId; this.scrollY = Math.max(0, scrollY);
        }
        public ReturnAnchor(String focusId, int scrollY) { this("Home", focusId, scrollY); }
    }
    public static final class Snapshot {
        public final String place, editableRequest, heardSoFar, consequence, message;
        public final ReturnAnchor returnAnchor;
        public final Surface surface;
        public final long generation, revision;
        public final Provenance provenance;
        public final boolean permitQueued, choicesAvailable;
        private Snapshot(ConversationSessionCoordinator c) {
            place = c.place; returnAnchor = c.anchor; surface = c.surface;
            generation = c.generation; revision = c.revision; provenance = c.provenance;
            editableRequest = c.editable; heardSoFar = c.partial; consequence = c.consequence;
            message = c.message; permitQueued = c.permit != null; choicesAvailable = c.choicesAvailable;
        }
    }
    private final CapabilityPorts.CapabilityAdapter adapter;
    private final CapabilityPorts.OutcomeObserver observer;
    private final InterpreterPort interpreter;
    private final Runnable cancelCleanup;
    private final BuildMode mode;
    private String place = "Home", editable = "", partial = "", consequence = "";
    private String message = "Type or talk to make a request.";
    private ReturnAnchor anchor = new ReturnAnchor("Home", "composer", 0);
    private Surface surface = Surface.IDLE;
    private Provenance provenance = Provenance.TYPED;
    private long generation, revision;
    private boolean proposalPending, choicesAvailable, entered;
    private CapabilityPorts.Prepared prepared;
    private Permit permit;

    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store) {
        this(controller, store, BuildMode.SYNTHETIC_LAB);
    }
    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store, BuildMode mode) {
        this(controller, new CapabilityPorts.C5Adapter(controller, store), new CapabilityPorts.StoreObserver(store), null, () -> {}, mode);
    }
    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store, Runnable cleanup) {
        this(controller, store, null, cleanup);
    }
    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store, InterpreterPort interpreter, Runnable cleanup) {
        this(controller, new CapabilityPorts.C5Adapter(controller, store), new CapabilityPorts.StoreObserver(store), interpreter, cleanup, BuildMode.SYNTHETIC_LAB);
    }
    public ConversationSessionCoordinator(TextScaleController unused, CapabilityPorts.CapabilityAdapter adapter,
            CapabilityPorts.OutcomeObserver observer, InterpreterPort interpreter, Runnable cleanup) {
        this(unused, adapter, observer, interpreter, cleanup, BuildMode.SYNTHETIC_LAB);
    }
    public ConversationSessionCoordinator(TextScaleController unused, CapabilityPorts.CapabilityAdapter adapter,
            CapabilityPorts.OutcomeObserver observer, InterpreterPort interpreter, Runnable cleanup, BuildMode mode) {
        this.adapter = Objects.requireNonNull(adapter); this.observer = Objects.requireNonNull(observer);
        this.interpreter = interpreter == null ? new FixtureInterpreter() : interpreter;
        this.cancelCleanup = cleanup == null ? () -> {} : cleanup; this.mode = mode;
    }
    public Snapshot snapshot() { return new Snapshot(this); }
    public void setPlace(String requestedPlace, ReturnAnchor requestedAnchor) {
        stop();
        place = "Kitchen".equals(requestedPlace) ? "Kitchen" : "Home";
        anchor = new ReturnAnchor(place, requestedAnchor == null ? "composer" : requestedAnchor.focusId,
                requestedAnchor == null ? 0 : requestedAnchor.scrollY);
    }
    public long beginListening() {
        invalidate(); editable = ""; surface = Surface.LISTENING;
        message = "Say what you would like to do. Choose Done listening when ready.";
        return generation;
    }
    public Result partial(long candidate, String heard) {
        if (candidate != generation || surface != Surface.LISTENING) return Result.STALE;
        if (tooLong(heard)) return voiceUnavailable("The request is too long. Please type a shorter request.");
        partial = value(heard); provenance = Provenance.PARTIAL_VOICE; return Result.ACCEPTED;
    }
    public Result finalVoice(long candidate, String cleaned) {
        if (candidate != generation || surface != Surface.LISTENING) return Result.STALE;
        return replace(cleaned, Provenance.FINAL_VOICE);
    }
    public Result voiceUnavailable(String reason) {
        invalidate(); surface = Surface.TRANSCRIPT;
        message = reason == null ? "Talk is unavailable. You can type instead." : reason;
        return Result.ACCEPTED;
    }
    public Result typed(String request) { return replace(request, Provenance.TYPED); }
    public Result edit(String request) { return replace(request, Provenance.EDITED_TRANSCRIPT); }
    public Result editRequest(String request) { return edit(request); }
    private Result replace(String request, Provenance source) {
        invalidate(); editable = value(request); revision++; provenance = source;
        surface = Surface.TRANSCRIPT;
        message = tooLong(editable) ? "Please shorten the request to 4,096 characters or fewer. Nothing was submitted."
                : "Review the words, then use this request.";
        return tooLong(editable) ? Result.DENIED : Result.ACCEPTED;
    }
    public Result submit() {
        if (surface != Surface.TRANSCRIPT) return Result.DENIED;
        if (editable.isBlank() || tooLong(editable)) {
            surface = Surface.CLARIFICATION; choicesAvailable = false;
            message = "Please type a nonempty request of 4,096 characters or fewer."; return Result.DENIED;
        }
        proposalPending = true; surface = Surface.CLARIFICATION; choicesAvailable = false;
        message = "Checking this local fixture request. Nothing is approved.";
        long g = generation, r = revision;
        Proposal proposal;
        try { proposal = interpreter.propose(editable, g, r); }
        catch (RuntimeException unavailable) { proposal = new Proposal((Capability) null); }
        return proposal == null ? Result.QUEUED : deliverProposal(g, r, proposal);
    }
    public Result deliverProposal(long g, long r, Proposal proposal) {
        if (g != generation || r != revision || !proposalPending || surface != Surface.CLARIFICATION) return Result.STALE;
        proposalPending = false;
        if (proposal == null || !isEnabled(proposal.capability)) {
            choicesAvailable = false;
            message = "That request is unavailable in this fixture. You can edit it or open Granny text size.";
            return Result.DENIED;
        }
        choicesAvailable = true; message = "Choose Standard, Larger, Larger still, or Largest.";
        return Result.ACCEPTED;
    }
    public Result chooseTextScale(TextScale scale) { return prepare(scale, false); }
    public Result chooseRestore() { return prepare(null, true); }
    private Result prepare(TextScale scale, boolean restore) {
        if (!isEnabled(Capability.TEXT_SCALE)) return Result.DENIED;
        if (surface != Surface.IDLE && surface != Surface.TRANSCRIPT && surface != Surface.CLARIFICATION) return Result.DENIED;
        if (surface == Surface.CLARIFICATION && !choicesAvailable) return Result.DENIED;
        if (tooLong(editable)) return Result.DENIED;
        boolean direct = surface == Surface.IDLE;
        invalidate();
        if (direct) {
            provenance = Provenance.DIRECT_CONTROL; revision++;
            editable = restore ? "Restore Granny's previous text size" : "Change Granny text size";
        }
        try { prepared = adapter.prepare(scale, restore); }
        catch (RuntimeException failure) { prepared = null; }
        if (prepared == null) {
            surface = Surface.TRANSCRIPT; message = "Text size is unavailable. No change was dispatched."; return Result.DENIED;
        }
        consequence = (restore ? "Restore" : "Change") + " Granny text from " + prepared.before().label()
                + " to " + prepared.after().label() + ". Android and other apps stay unchanged.";
        surface = Surface.PREVIEW;
        message = prepared.noChange() ? "That size is already current. Applying will not write another value."
                : "Nothing has changed yet. Review this exact local change.";
        return Result.ACCEPTED;
    }
    public Result approve() { return approve(generation, revision, consequence); }
    public Result approve(long g, long r, String shownConsequence) {
        if (g != generation || r != revision || !Objects.equals(shownConsequence, consequence)) return Result.STALE;
        if (surface != Surface.PREVIEW || prepared == null || !isEnabled(Capability.TEXT_SCALE)) return Result.DENIED;
        permit = new Permit(generation, revision, editable, consequence, prepared);
        prepared = null; surface = Surface.ACTIVE; message = "Waiting to save the approved local change. Stop is available.";
        return Result.QUEUED;
    }
    public Result dispatchApproved() { return dispatchApproved(generation); }
    public Result dispatchApproved(long g) {
        if (g != generation || permit == null || surface != Surface.ACTIVE || !isEnabled(Capability.TEXT_SCALE)) return Result.STALE;
        Permit active = permit; permit = null;
        if (active.revision != revision || !active.request.equals(editable) || !active.consequence.equals(consequence)) return Result.STALE;
        TextScaleStore.ReadResult before = observe();
        if (g != generation) return Result.STALE;
        if (!CapabilityPorts.matches(before, active.prepared.prior)) {
            surface = Surface.TRANSCRIPT; message = "The saved size changed. No change was dispatched; review it again.";
            safeCancel(); return Result.DENIED;
        }
        entered = true;
        boolean acknowledged;
        try { acknowledged = adapter.dispatch(active.prepared); }
        catch (RuntimeException unknown) { acknowledged = false; }
        if (g != generation) return Result.STALE;
        TextScaleStore.ReadResult observed = observe();
        if (g != generation) return Result.STALE;
        entered = false;
        if (acknowledged && CapabilityPorts.matches(observed, active.prepared.target)) {
            surface = Surface.KNOWN;
            message = active.prepared.noChange() ? "No change was needed. " + active.prepared.after().label() + " is already current."
                    : "Granny text size is now " + active.prepared.after().label() + ". The preference was read back independently.";
            return Result.KNOWN;
        }
        surface = Surface.UNKNOWN; message = "The text-size change could not be verified. Granny will not retry automatically.";
        return Result.UNKNOWN;
    }
    public Result stop() { return stop(null); }
    public Result stop(Runnable cleanup) {
        boolean uncertain = entered || surface == Surface.UNKNOWN;
        invalidate(); surface = uncertain ? Surface.UNKNOWN : Surface.IDLE;
        message = uncertain ? "Stopped. The text-size result remains unknown." : "Cancelled before any new change. You can type or talk.";
        runCleanup(cleanup); return Result.ACCEPTED;
    }
    public Result clearForBackground(Runnable cleanup) {
        stop(cleanup); editable = ""; partial = ""; provenance = Provenance.TYPED;
        return Result.ACCEPTED;
    }
    public Result dismissResult() {
        if (surface != Surface.KNOWN && surface != Surface.UNKNOWN) return Result.DENIED;
        invalidate(); surface = Surface.IDLE; editable = ""; message = "Type or talk to make a request.";
        return Result.ACCEPTED;
    }
    public void restoreUnknownOutcome() {
        invalidate(); editable = ""; surface = Surface.UNKNOWN; message = "The earlier text-size result is unknown.";
    }
    public Result reviewStatus() {
        if (surface != Surface.UNKNOWN) return Result.DENIED;
        TextScaleStore.ReadResult read = observe();
        message = read.status == TextScaleStore.ReadResult.Status.PRESENT
                ? "Current stored text size: " + read.value.current.label() + ". The earlier result remains unknown."
                : "The earlier result remains unknown. No change or retry was requested.";
        return Result.UNKNOWN;
    }
    public boolean isEnabled(Capability capability) { return capability == Capability.TEXT_SCALE && mode == BuildMode.SYNTHETIC_LAB; }
    public CapabilityMetadata metadata(Capability capability) { return new CapabilityMetadata(capability, isEnabled(capability)); }
    private void invalidate() {
        generation++; permit = null; prepared = null; proposalPending = false; choicesAvailable = false;
        partial = ""; consequence = ""; entered = false; safeCancel();
    }
    private void safeCancel() { try { adapter.cancel(); } catch (RuntimeException ignored) { /* Authority was already removed. */ } }
    private void runCleanup(Runnable extra) {
        try { if (extra != null) extra.run(); } finally { cancelCleanup.run(); }
    }
    private TextScaleStore.ReadResult observe() {
        try { return Objects.requireNonNull(observer.observe()); }
        catch (RuntimeException unavailable) { return TextScaleStore.ReadResult.unknown(); }
    }
    private static boolean tooLong(String text) { return text != null && text.codePointCount(0, text.length()) > 4096; }
    private static String value(String text) { return text == null ? "" : text; }
    private static final class Permit {
        final long generation, revision;
        final String request, consequence;
        final CapabilityPorts.Prepared prepared;
        Permit(long generation, long revision, String request, String consequence, CapabilityPorts.Prepared prepared) {
            this.generation = generation; this.revision = revision; this.request = request;
            this.consequence = consequence; this.prepared = prepared;
        }
    }
}
