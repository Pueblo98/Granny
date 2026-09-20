package org.pueblo98.stage1.conversation;

import java.util.List;
import java.util.Objects;
import org.pueblo98.stage1.media.MediaPlayFromSearchPort;
import org.pueblo98.stage1.readability.TextScale;
import org.pueblo98.stage1.readability.TextScaleController;
import org.pueblo98.stage1.readability.TextScaleStore;

/** Main-thread process-local authority. Input/interpretation is never an execution permit. */
public final class ConversationSessionCoordinator {
    public enum Surface {
        IDLE, LISTENING, TRANSCRIPT, CLARIFICATION, PREVIEW, ACTIVE, KNOWN, UNKNOWN,
        DRAFT_RECIPIENT, DRAFT_PREVIEW, DRAFT_READY,
        MEDIA_SERVICE, MEDIA_PREVIEW, MEDIA_DISPATCHING, MEDIA_REQUESTED, MEDIA_UNKNOWN
    }
    public enum Provenance { TYPED, PARTIAL_VOICE, FINAL_VOICE, EDITED_TRANSCRIPT, DIRECT_CONTROL }
    public enum Capability { TEXT_SCALE, LOCAL_DRAFT, MEDIA_PLAY_FROM_SEARCH, SCREEN_EXPLANATION }
    public enum BuildMode { SYNTHETIC_LAB, CANDIDATE }
    public enum Result { ACCEPTED, STALE, DENIED, QUEUED, DISPATCHED, KNOWN, UNKNOWN }

    /** Null return means pending; later deliverProposal must use these exact generation/revision values. */
    public interface InterpreterPort { Proposal propose(String exactRequest, long generation, long revision); }
    public static final class Proposal {
        public final Capability capability;
        public final String exactArtist;
        public Proposal(Capability capability) { this(capability, ""); }
        public Proposal(Capability capability, String exactArtist) {
            this.capability = capability; this.exactArtist = exactArtist == null ? "" : exactArtist;
        }
        /** Compatibility for synthetic fixtures; text cannot define an action or grant authority. */
        public Proposal(String ignoredDescription) { this(Capability.TEXT_SCALE); }
    }
    public static final class FixtureInterpreter implements InterpreterPort {
        public Proposal propose(String exact, long generation, long revision) {
            String request = exact.trim();
            boolean textScale = request.equalsIgnoreCase("make text larger")
                    || request.equalsIgnoreCase("make granny text larger")
                    || request.equalsIgnoreCase("make this bigger");
            boolean localDraft = request.replace('\'', '’')
                    .equalsIgnoreCase("Tell David I’ll call after dinner.");
            boolean media = request.equalsIgnoreCase("play Elton John")
                    || request.equalsIgnoreCase("play Elton John.")
                    || request.equalsIgnoreCase("play some Elton John")
                    || request.equalsIgnoreCase("play some Elton John.");
            return new Proposal(textScale ? Capability.TEXT_SCALE
                    : localDraft ? Capability.LOCAL_DRAFT
                    : media ? Capability.MEDIA_PLAY_FROM_SEARCH : null,
                    media ? "Elton John" : "");
        }
    }
    public static final class DraftRecipient {
        public final String endpointId, label, channel;
        public DraftRecipient(String endpointId, String label, String channel) {
            this.endpointId = endpointId; this.label = label; this.channel = channel;
        }
    }
    private static final List<DraftRecipient> DRAFT_RECIPIENTS = List.of(
            new DraftRecipient("person-a", "David — brother", "Fixture messages"),
            new DraftRecipient("person-b", "David — neighbour", "Fixture messages"));
    public static final class CapabilityMetadata {
        public final Capability capability;
        public final boolean enabled;
        public final List<String> permissions;
        public final String schema, cancellation, outcomeOracle;
        public final List<BuildMode> admittedModes;
        private CapabilityMetadata(Capability capability, boolean enabled) {
            this.capability = capability; this.enabled = enabled;
            permissions = List.of();
            schema = capability == Capability.TEXT_SCALE ? "closed TextScale / Restore; exact prior version"
                    : capability == Capability.LOCAL_DRAFT ? "two fictional endpoints; exact in-memory body; no dispatch"
                    : capability == Capability.MEDIA_PLAY_FROM_SEARCH
                    ? "exact artist plus exact discovered Android handler; handoff only" : "unavailable";
            cancellation = capability == Capability.LOCAL_DRAFT
                    ? "Edit, Cancel, Stop or background clears process-only state; no external entry"
                    : capability == Capability.MEDIA_PLAY_FROM_SEARCH
                    ? "Stop before dispatch revokes authority; after handoff, playback and pause are unverified"
                    : "Cancel before entry; unknown after entry until independent verification";
            outcomeOracle = capability == Capability.TEXT_SCALE ? "private preference readback"
                    : capability == Capability.LOCAL_DRAFT ? "coordinator snapshot only; no external effect"
                    : capability == Capability.MEDIA_PLAY_FROM_SEARCH ? "activity handoff acknowledgement only; not playback"
                    : "unadmitted";
            admittedModes = capability == Capability.TEXT_SCALE || capability == Capability.LOCAL_DRAFT
                    || capability == Capability.MEDIA_PLAY_FROM_SEARCH
                    ? List.of(BuildMode.SYNTHETIC_LAB) : List.of();
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
        public final String draftBody, draftRecipientId, draftRecipientLabel, draftChannel;
        public final List<DraftRecipient> draftRecipients;
        public final String mediaArtist, mediaHandlerLabel;
        public final List<MediaPlayFromSearchPort.Handler> mediaHandlers;
        public final ReturnAnchor returnAnchor;
        public final Surface surface;
        public final long generation, revision;
        public final Provenance provenance;
        public final boolean permitQueued, choicesAvailable;
        private Snapshot(ConversationSessionCoordinator c) {
            place = c.place; returnAnchor = c.anchor; surface = c.surface;
            generation = c.generation; revision = c.revision; provenance = c.provenance;
            editableRequest = c.editable; heardSoFar = c.partial; consequence = c.consequence;
            message = c.message; permitQueued = c.permit != null || c.mediaPermit != null; choicesAvailable = c.choicesAvailable;
            draftBody = c.draftBody;
            draftRecipientId = c.draftRecipient == null ? "" : c.draftRecipient.endpointId;
            draftRecipientLabel = c.draftRecipient == null ? "" : c.draftRecipient.label;
            draftChannel = c.draftRecipient == null ? "" : c.draftRecipient.channel;
            draftRecipients = c.surface == Surface.DRAFT_RECIPIENT ? DRAFT_RECIPIENTS : List.of();
            mediaArtist = c.mediaArtist;
            mediaHandlerLabel = c.mediaHandler == null ? "" : c.mediaHandler.label;
            mediaHandlers = c.surface == Surface.MEDIA_SERVICE ? c.mediaHandlers : List.of();
        }
    }
    private final CapabilityPorts.CapabilityAdapter adapter;
    private final CapabilityPorts.OutcomeObserver observer;
    private final InterpreterPort interpreter;
    private final MediaPlayFromSearchPort mediaPort;
    private final Runnable cancelCleanup;
    private final BuildMode mode;
    private final Thread owner = Thread.currentThread();
    private String place = "Home", editable = "", partial = "", consequence = "";
    private String draftBody = "";
    private DraftRecipient draftRecipient;
    private String mediaArtist = "";
    private List<MediaPlayFromSearchPort.Handler> mediaHandlers = List.of();
    private MediaPlayFromSearchPort.Handler mediaHandler;
    private String message = "Type or talk to make a request.";
    private ReturnAnchor anchor = new ReturnAnchor("Home", "composer", 0);
    private Surface surface = Surface.IDLE;
    private Provenance provenance = Provenance.TYPED;
    private long generation, revision;
    private boolean proposalPending, choicesAvailable, entered;
    private CapabilityPorts.Prepared prepared;
    private Permit permit;
    private MediaPermit mediaPermit;

    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store) {
        this(controller, store, BuildMode.SYNTHETIC_LAB);
    }
    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store, BuildMode mode) {
        this(controller, store, MediaPlayFromSearchPort.unavailable(), mode);
    }
    public ConversationSessionCoordinator(TextScaleController controller, TextScaleStore store,
            MediaPlayFromSearchPort mediaPort, BuildMode mode) {
        this(controller, new CapabilityPorts.C5Adapter(controller, store), new CapabilityPorts.StoreObserver(store),
                null, () -> {}, mediaPort, mode);
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
        this(unused, adapter, observer, interpreter, cleanup, MediaPlayFromSearchPort.unavailable(), mode);
    }
    public ConversationSessionCoordinator(TextScaleController unused, CapabilityPorts.CapabilityAdapter adapter,
            CapabilityPorts.OutcomeObserver observer, InterpreterPort interpreter, Runnable cleanup,
            MediaPlayFromSearchPort mediaPort, BuildMode mode) {
        this.adapter = Objects.requireNonNull(adapter); this.observer = Objects.requireNonNull(observer);
        this.interpreter = interpreter == null ? new FixtureInterpreter() : interpreter;
        this.mediaPort = mediaPort == null ? MediaPlayFromSearchPort.unavailable() : mediaPort;
        this.cancelCleanup = cleanup == null ? () -> {} : cleanup; this.mode = mode;
    }
    public Snapshot snapshot() { checkThread(); return new Snapshot(this); }
    public void setPlace(String requestedPlace, ReturnAnchor requestedAnchor) { checkThread();
        stop();
        place = "Kitchen".equals(requestedPlace) ? "Kitchen" : "Home";
        anchor = new ReturnAnchor(place, requestedAnchor == null ? "composer" : requestedAnchor.focusId,
                requestedAnchor == null ? 0 : requestedAnchor.scrollY);
    }
    public long beginListening() { checkThread();
        invalidate(); surface = Surface.LISTENING;
        message = "Say what you would like to do. Choose Done listening when ready.";
        return generation;
    }
    public Result partial(long candidate, String heard) { checkThread();
        if (candidate != generation || surface != Surface.LISTENING) return Result.STALE;
        if (tooLong(heard)) return voiceUnavailable("The request is too long. Please type a shorter request.");
        partial = value(heard); provenance = Provenance.PARTIAL_VOICE; return Result.ACCEPTED;
    }
    public Result finalVoice(long candidate, String cleaned) { checkThread();
        if (candidate != generation || surface != Surface.LISTENING) return Result.STALE;
        return replace(cleaned, Provenance.FINAL_VOICE);
    }
    public Result completeVoice(long candidate, String exactDraft, String explanation) { checkThread();
        if (candidate != generation || surface != Surface.LISTENING) return Result.STALE;
        Result result = replace(exactDraft, Provenance.FINAL_VOICE);
        if (result == Result.ACCEPTED && explanation != null) message = explanation;
        return result;
    }
    public Result voiceUnavailable(String reason) { checkThread();
        invalidate(); surface = Surface.TRANSCRIPT;
        message = reason == null ? "Talk is unavailable. You can type instead." : reason;
        return Result.ACCEPTED;
    }
    public Result typed(String request) { checkThread(); return replace(request, Provenance.TYPED); }
    public Result edit(String request) { checkThread(); return replace(request, Provenance.EDITED_TRANSCRIPT); }
    public Result editRequest(String request) { checkThread(); return edit(request); }
    private Result replace(String request, Provenance source) {
        invalidate(); editable = value(request); revision++; provenance = source;
        surface = Surface.TRANSCRIPT;
        message = tooLong(editable) ? "Please shorten the request to 4,096 characters or fewer. Nothing was submitted."
                : "Review the words, then use this request.";
        return tooLong(editable) ? Result.DENIED : Result.ACCEPTED;
    }
    public Result submit() { checkThread();
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
    public Result deliverProposal(long g, long r, Proposal proposal) { checkThread();
        if (g != generation || r != revision || !proposalPending || surface != Surface.CLARIFICATION) return Result.STALE;
        proposalPending = false;
        if (proposal == null || !isEnabled(proposal.capability)) {
            choicesAvailable = false;
            message = "That request is unavailable in this fixture. You can edit it or use an available local control.";
            return Result.DENIED;
        }
        if (proposal.capability == Capability.LOCAL_DRAFT) {
            draftBody = "I’ll call after dinner.";
            surface = Surface.DRAFT_RECIPIENT;
            choicesAvailable = true;
            message = "Two fictional Davids match. Choose one before the local draft is prepared.";
            return Result.ACCEPTED;
        }
        if (proposal.capability == Capability.MEDIA_PLAY_FROM_SEARCH) {
            return prepareMedia(proposal.exactArtist);
        }
        choicesAvailable = true; message = "Choose Standard, Larger, Larger still, or Largest.";
        return Result.ACCEPTED;
    }
    private Result prepareMedia(String artist) {
        mediaArtist = value(artist).trim();
        if (mediaArtist.isEmpty()) {
            surface = Surface.MEDIA_SERVICE; choicesAvailable = false;
            message = "I need an artist before asking a music app. Nothing was opened.";
            return Result.DENIED;
        }
        try { mediaHandlers = List.copyOf(mediaPort.compatibleHandlers()); }
        catch (RuntimeException unavailable) { mediaHandlers = List.of(); }
        if (mediaHandlers.isEmpty()) {
            surface = Surface.MEDIA_SERVICE; choicesAvailable = false;
            message = "No compatible music app is visible for this Android handoff. Nothing was opened.";
            return Result.DENIED;
        }
        if (mediaHandlers.size() == 1) return bindMediaHandler(mediaHandlers.get(0), false);
        surface = Surface.MEDIA_SERVICE; choicesAvailable = true;
        message = "More than one compatible music app is available. Choose where to send this request.";
        return Result.ACCEPTED;
    }
    public Result chooseMediaHandler(String componentId) { checkThread();
        if (surface != Surface.MEDIA_SERVICE || !choicesAvailable || !isEnabled(Capability.MEDIA_PLAY_FROM_SEARCH)) {
            return Result.DENIED;
        }
        MediaPlayFromSearchPort.Handler selected = mediaHandlers.stream()
                .filter(item -> item.componentId.equals(componentId)).findFirst().orElse(null);
        return selected == null ? Result.DENIED : bindMediaHandler(selected, true);
    }
    private Result bindMediaHandler(MediaPlayFromSearchPort.Handler selected, boolean newRevision) {
        String artist = mediaArtist;
        List<MediaPlayFromSearchPort.Handler> handlers = mediaHandlers;
        if (newRevision) { invalidate(); revision++; }
        mediaArtist = artist; mediaHandlers = handlers; mediaHandler = selected;
        consequence = "Ask " + selected.label + " to play artist “" + artist
                + "”. This opens another app; Granny cannot yet verify playback or pause it.";
        surface = Surface.MEDIA_PREVIEW; choicesAvailable = false;
        message = "Check the artist and music app. Nothing has been opened yet.";
        return Result.ACCEPTED;
    }
    public Result approveMedia(long g, long r, String shownConsequence) { checkThread();
        if (g != generation || r != revision || !Objects.equals(shownConsequence, consequence)) return Result.STALE;
        if (surface != Surface.MEDIA_PREVIEW || mediaHandler == null || mediaArtist.isEmpty()
                || !isEnabled(Capability.MEDIA_PLAY_FROM_SEARCH)) return Result.DENIED;
        mediaPermit = new MediaPermit(generation, revision, editable, consequence, mediaArtist, mediaHandler);
        surface = Surface.MEDIA_DISPATCHING;
        message = "Waiting to send the approved request. Stop is available until the handoff begins.";
        return Result.QUEUED;
    }
    public Result dispatchMedia(long g) { checkThread();
        if (g != generation || mediaPermit == null || surface != Surface.MEDIA_DISPATCHING
                || !isEnabled(Capability.MEDIA_PLAY_FROM_SEARCH)) return Result.STALE;
        MediaPermit active = mediaPermit; mediaPermit = null;
        if (active.revision != revision || !active.request.equals(editable)
                || !active.consequence.equals(consequence)) return Result.STALE;
        entered = true;
        MediaPlayFromSearchPort.LaunchResult result;
        try { result = mediaPort.requestArtist(active.handler, active.artist); }
        catch (RuntimeException uncertain) { result = MediaPlayFromSearchPort.LaunchResult.UNKNOWN; }
        if (g != generation) return Result.STALE;
        entered = false;
        if (result == MediaPlayFromSearchPort.LaunchResult.HANDOFF_ACCEPTED) {
            surface = Surface.MEDIA_REQUESTED;
            message = "Request sent to " + active.handler.label
                    + ". Granny has not verified what is playing and cannot pause that app here.";
            return Result.DISPATCHED;
        }
        if (result == MediaPlayFromSearchPort.LaunchResult.NO_HANDLER) {
            surface = Surface.MEDIA_SERVICE;
            choicesAvailable = false;
            message = "That music app was no longer available. Nothing was opened; edit or cancel this request.";
            return Result.DENIED;
        }
        surface = Surface.MEDIA_UNKNOWN;
        message = "The music-app handoff has an unknown outcome. Granny will not retry automatically.";
        return Result.UNKNOWN;
    }
    public Result chooseDraftRecipient(String endpointId) { checkThread();
        if (surface != Surface.DRAFT_RECIPIENT || !choicesAvailable || !isEnabled(Capability.LOCAL_DRAFT)) {
            return Result.DENIED;
        }
        DraftRecipient chosen = null;
        for (DraftRecipient recipient : DRAFT_RECIPIENTS) {
            if (recipient.endpointId.equals(endpointId)) chosen = recipient;
        }
        if (chosen == null) return Result.DENIED;
        String body = draftBody;
        invalidate();
        revision++;
        draftBody = body;
        draftRecipient = chosen;
        consequence = "Fictional local draft — not sent\nTo: " + chosen.label
                + " (" + chosen.endpointId + ")\nChannel: " + chosen.channel + "\nMessage: " + body;
        surface = Surface.DRAFT_PREVIEW;
        message = "Check the exact recipient, channel and words. Nothing will leave Granny.";
        return Result.ACCEPTED;
    }
    public Result keepLocalDraft() { checkThread();
        if (surface != Surface.DRAFT_PREVIEW || draftRecipient == null || draftBody.isEmpty()
                || !isEnabled(Capability.LOCAL_DRAFT)) return Result.DENIED;
        generation++;
        choicesAvailable = false;
        proposalPending = false;
        surface = Surface.DRAFT_READY;
        message = "Draft ready here — not sent. It will be cleared when you leave this session.";
        return Result.KNOWN;
    }
    public Result chooseTextScale(TextScale scale) { checkThread(); return prepare(scale, false); }
    public Result chooseRestore() { checkThread(); return prepare(null, true); }
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
    public Result approve() { checkThread(); return approve(generation, revision, consequence); }
    public Result approve(long g, long r, String shownConsequence) { checkThread();
        if (g != generation || r != revision || !Objects.equals(shownConsequence, consequence)) return Result.STALE;
        if (surface != Surface.PREVIEW || prepared == null || !isEnabled(Capability.TEXT_SCALE)) return Result.DENIED;
        permit = new Permit(generation, revision, editable, consequence, prepared);
        prepared = null; surface = Surface.ACTIVE; message = "Waiting to save the approved local change. Stop is available.";
        return Result.QUEUED;
    }
    public Result dispatchApproved() { checkThread(); return dispatchApproved(generation); }
    public Result dispatchApproved(long g) { checkThread();
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
    public Result stop() { checkThread(); return stop(null); }
    public Result stop(Runnable cleanup) { checkThread();
        boolean wasEntered = entered;
        boolean mediaUncertain = surface == Surface.MEDIA_REQUESTED || surface == Surface.MEDIA_UNKNOWN;
        boolean mediaInFlight = surface == Surface.MEDIA_DISPATCHING;
        boolean uncertain = wasEntered || surface == Surface.UNKNOWN || mediaUncertain;
        invalidate(); surface = uncertain ? Surface.UNKNOWN : Surface.IDLE;
        if (mediaUncertain || mediaInFlight) {
            surface = Surface.MEDIA_UNKNOWN;
            message = "The handoff may already have reached the music app. Granny cannot stop or verify its playback here.";
        } else message = uncertain ? "Stopped. The text-size result remains unknown."
                : "Cancelled before any new change. You can type or talk.";
        runCleanup(cleanup); return Result.ACCEPTED;
    }
    public Result clearForBackground(Runnable cleanup) { checkThread();
        editable = ""; partial = ""; provenance = Provenance.TYPED; stop(cleanup);
        return Result.ACCEPTED;
    }
    public Result dismissResult() { checkThread();
        if (surface != Surface.KNOWN && surface != Surface.UNKNOWN && surface != Surface.DRAFT_READY
                && surface != Surface.MEDIA_REQUESTED && surface != Surface.MEDIA_UNKNOWN) return Result.DENIED;
        invalidate(); surface = Surface.IDLE; editable = ""; message = "Type or talk to make a request.";
        return Result.ACCEPTED;
    }
    public void restoreUnknownOutcome() { checkThread();
        invalidate(); editable = ""; surface = Surface.UNKNOWN; message = "The earlier text-size result is unknown.";
    }
    public void restoreMediaUnknownOutcome() { checkThread();
        invalidate(); editable = ""; surface = Surface.MEDIA_UNKNOWN;
        message = "The earlier music-app handoff remains unknown. Granny will not retry it automatically.";
    }
    public Result reviewStatus() { checkThread();
        if (surface != Surface.UNKNOWN) return Result.DENIED;
        TextScaleStore.ReadResult read = observe();
        message = read.status == TextScaleStore.ReadResult.Status.PRESENT
                ? "Current stored text size: " + read.value.current.label() + ". The earlier result remains unknown."
                : "The earlier result remains unknown. No change or retry was requested.";
        return Result.UNKNOWN;
    }
    public boolean isEnabled(Capability capability) { checkThread();
        return (capability == Capability.TEXT_SCALE || capability == Capability.LOCAL_DRAFT
                || capability == Capability.MEDIA_PLAY_FROM_SEARCH)
                && mode == BuildMode.SYNTHETIC_LAB;
    }
    public CapabilityMetadata metadata(Capability capability) { checkThread(); return new CapabilityMetadata(capability, isEnabled(capability)); }
    private void checkThread() {
        if (Thread.currentThread() != owner) throw new IllegalStateException("Conversation calls must use their creating thread");
    }
    private void invalidate() {
        generation++; permit = null; mediaPermit = null; prepared = null; proposalPending = false; choicesAvailable = false;
        partial = ""; consequence = ""; entered = false; draftBody = ""; draftRecipient = null;
        mediaArtist = ""; mediaHandlers = List.of(); mediaHandler = null; safeCancel();
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
    private static final class MediaPermit {
        final long generation, revision;
        final String request, consequence, artist;
        final MediaPlayFromSearchPort.Handler handler;
        MediaPermit(long generation, long revision, String request, String consequence,
                String artist, MediaPlayFromSearchPort.Handler handler) {
            this.generation = generation; this.revision = revision; this.request = request;
            this.consequence = consequence; this.artist = artist; this.handler = handler;
        }
    }
}
