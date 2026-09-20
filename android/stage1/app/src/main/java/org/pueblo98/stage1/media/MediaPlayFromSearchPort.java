package org.pueblo98.stage1.media;

import java.util.List;
import java.util.Objects;

/** Narrow Android media handoff port. An accepted launch is not playback evidence. */
public interface MediaPlayFromSearchPort {
    enum LaunchResult { HANDOFF_ACCEPTED, NO_HANDLER, UNKNOWN }

    final class Handler {
        public final String componentId;
        public final String packageName;
        public final String label;

        public Handler(String componentId, String packageName, String label) {
            this.componentId = Objects.requireNonNull(componentId);
            this.packageName = Objects.requireNonNull(packageName);
            this.label = Objects.requireNonNull(label);
        }
    }

    /** Returns only exact handlers for Android's play-from-search action. */
    List<Handler> compatibleHandlers();

    /** Requests an artist handoff to a previously returned exact component. */
    LaunchResult requestArtist(Handler handler, String exactArtist);

    static MediaPlayFromSearchPort unavailable() {
        return new MediaPlayFromSearchPort() {
            @Override public List<Handler> compatibleHandlers() { return List.of(); }
            @Override public LaunchResult requestArtist(Handler handler, String exactArtist) {
                return LaunchResult.NO_HANDLER;
            }
        };
    }
}
