package org.pueblo98.stage1.speech;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.util.List;
import java.util.Locale;
import org.junit.Test;

public final class OfflineVoiceSelectionTest {
    @Test public void excludesNetworkWrongLanguageAndNotInstalledVoices() {
        OfflineVoiceSelection.VoiceMetadata selected = select(
                v("network", Locale.US, 500, false, true, true),
                v("spanish", new Locale("es", "ES"), 500, false, false, true),
                v("download", Locale.US, 500, false, false, false),
                v("offline", Locale.US, 100, false, false, true));
        assertEquals("offline", selected.name);
    }
    @Test public void exactLocaleBeatsHigherQualitySameLanguageFallback() {
        assertEquals("us", select(v("gb", Locale.UK, 500, false, false, true), v("us", Locale.US, 100, false, false, true)).name);
    }
    @Test public void qualityThenDefaultThenNameBreakTiesDeterministically() {
        assertEquals("quality", select(v("default", Locale.US, 300, true, false, true), v("quality", Locale.US, 400, false, false, true)).name);
        assertEquals("default", select(v("other", Locale.US, 400, false, false, true), v("default", Locale.US, 400, true, false, true)).name);
        assertEquals("alpha", select(v("zeta", Locale.US, 400, false, false, true), v("alpha", Locale.US, 400, false, false, true)).name);
    }
    @Test public void noEligibleOfflineVoiceReturnsNull() { assertNull(select(v("network",Locale.US,1,false,true,true))); }
    private static OfflineVoiceSelection.VoiceMetadata select(OfflineVoiceSelection.VoiceMetadata... voices) { return OfflineVoiceSelection.select(List.of(voices),Locale.US); }
    private static OfflineVoiceSelection.VoiceMetadata v(String n,Locale l,int q,boolean d,boolean network,boolean installed) { return new OfflineVoiceSelection.VoiceMetadata(n,l,q,d,network,installed); }
}
