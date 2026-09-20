package org.pueblo98.stage1.speech;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/** Pure ranking policy for already-installed, offline Android TTS voices. */
public final class OfflineVoiceSelection {
    public static final class VoiceMetadata {
        public final String name;
        public final Locale locale;
        public final int quality;
        public final boolean defaultVoice, networkRequired, installed;
        public VoiceMetadata(String name, Locale locale, int quality, boolean defaultVoice,
                boolean networkRequired, boolean installed) {
            this.name=name; this.locale=locale; this.quality=quality; this.defaultVoice=defaultVoice;
            this.networkRequired=networkRequired; this.installed=installed;
        }
    }
    private OfflineVoiceSelection() {}
    public static VoiceMetadata select(List<VoiceMetadata> voices, Locale requested) {
        if (voices == null || requested == null) return null;
        List<VoiceMetadata> eligible=new ArrayList<>();
        for (VoiceMetadata voice:voices) if (voice != null && voice.installed && !voice.networkRequired
                && voice.locale != null && requested.getLanguage().equals(voice.locale.getLanguage())) eligible.add(voice);
        eligible.sort(Comparator.comparing((VoiceMetadata v)->!requested.equals(v.locale))
                .thenComparing((VoiceMetadata v)->-v.quality)
                .thenComparing((VoiceMetadata v)->!v.defaultVoice)
                .thenComparing(v->v.name == null ? "" : v.name));
        return eligible.isEmpty()?null:eligible.get(0);
    }
}
