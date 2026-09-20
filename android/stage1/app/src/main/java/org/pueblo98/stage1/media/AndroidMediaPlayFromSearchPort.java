package org.pueblo98.stage1.media;

import android.app.SearchManager;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.provider.MediaStore;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Exact-component adapter for Android's documented voice-command media intent. */
public final class AndroidMediaPlayFromSearchPort implements MediaPlayFromSearchPort {
    private final Context context;
    private final PackageManager packages;

    public AndroidMediaPlayFromSearchPort(Context context) {
        this.context = context;
        this.packages = context.getPackageManager();
    }

    @Override public List<Handler> compatibleHandlers() {
        Map<String, Handler> unique = new LinkedHashMap<>();
        for (ResolveInfo info : packages.queryIntentActivities(baseIntent("fixture"), PackageManager.MATCH_DEFAULT_ONLY)) {
            if (info.activityInfo == null || info.activityInfo.packageName == null || info.activityInfo.name == null) continue;
            ComponentName component = new ComponentName(info.activityInfo.packageName, info.activityInfo.name);
            CharSequence loaded = info.loadLabel(packages);
            String label = loaded == null || loaded.toString().isBlank()
                    ? info.activityInfo.packageName : loaded.toString();
            Handler handler = new Handler(component.flattenToString(), info.activityInfo.packageName, label);
            unique.put(handler.componentId, handler);
        }
        ArrayList<Handler> result = new ArrayList<>(unique.values());
        result.sort(Comparator.comparing((Handler item) -> item.label, String.CASE_INSENSITIVE_ORDER)
                .thenComparing(item -> item.componentId));
        return List.copyOf(result);
    }

    @Override public LaunchResult requestArtist(Handler selected, String exactArtist) {
        if (selected == null || exactArtist == null || exactArtist.isBlank()) return LaunchResult.NO_HANDLER;
        Handler current = compatibleHandlers().stream()
                .filter(item -> item.componentId.equals(selected.componentId)
                        && item.packageName.equals(selected.packageName))
                .findFirst().orElse(null);
        if (current == null) return LaunchResult.NO_HANDLER;
        ComponentName component = ComponentName.unflattenFromString(current.componentId);
        if (component == null || !component.getPackageName().equals(current.packageName)) return LaunchResult.NO_HANDLER;
        Intent intent = baseIntent(exactArtist).setComponent(component);
        try {
            context.startActivity(intent);
            return LaunchResult.HANDOFF_ACCEPTED;
        } catch (ActivityNotFoundException | SecurityException failure) {
            return LaunchResult.NO_HANDLER;
        } catch (RuntimeException uncertain) {
            return LaunchResult.UNKNOWN;
        }
    }

    private static Intent baseIntent(String artist) {
        return new Intent(MediaStore.INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH)
                .addCategory(Intent.CATEGORY_DEFAULT)
                .putExtra(MediaStore.EXTRA_MEDIA_FOCUS, MediaStore.Audio.Artists.ENTRY_CONTENT_TYPE)
                .putExtra(MediaStore.EXTRA_MEDIA_ARTIST, artist)
                .putExtra(SearchManager.QUERY, artist);
    }
}
