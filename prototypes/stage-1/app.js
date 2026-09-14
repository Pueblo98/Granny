/* Native browser controls; every external effect is a fictional fixture. */
(() => {
  "use strict";
  const P = window.GrannyPrototype, state = P.create();
  const $ = id => document.getElementById(id);
  const iconPaths = {
    mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
    type: '<path d="M4 5h16M12 5v15M8 20h8"/>',
    photo: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
    message: '<path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h7"/>',
    music: '<path d="M10 18V5l10-2v13M10 9l10-2"/><ellipse cx="6" cy="18" rx="4" ry="3"/><ellipse cx="16" cy="16" rx="4" ry="3"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5M12 16v1"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/>',
    stop: '<rect x="4" y="4" width="16" height="16" rx="2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>'
  };
  function el(tag, cls, text) {
    const n = document.createElement(tag); if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text; return n;
  }
  function icon(name) {
    const n = el("span", "icon"); n.setAttribute("aria-hidden", "true");
    n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (iconPaths[name] || iconPaths.arrow) + '</svg>';
    return n;
  }
  function go(event, value) {
    const rev = state.revision;
    if (P.dispatch(state, event, value, rev)) render();
  }
  function action(label, event, value, kind, name) {
    const b = el("button", "button " + (kind || ""), label); b.type = "button";
    b.dataset.event = event; if (value !== undefined) b.dataset.value = String(value);
    const rev = state.revision;
    if (name) b.prepend(icon(name));
    b.addEventListener("click", () => { if (P.dispatch(state, event, value, rev)) render(); });
    return b;
  }
  function paragraph(text, cls) { return el("p", cls || "body-copy", text); }
  function card(title, text, kind) {
    const c = el("section", "content-card " + (kind || ""));
    if (title) c.append(el("h2", "", title));
    if (text) c.append(paragraph(text)); return c;
  }
  function preview() {
    const c = card("Your message", "", "message-preview");
    const dl = el("dl", "recipient");
    [["To", state.recipient ? state.recipient.name + " · " + state.recipient.detail : "Not chosen"],
     ["Using", state.channel || "Not chosen"],
     ["Address", state.recipient ? state.recipient.id + (state.channel === "Example Mail" ? "@example.invalid" : "") : "Not chosen"]].forEach(([k,v]) => {
      dl.append(el("dt", "", k), el("dd", "", v));
    });
    c.append(dl, el("blockquote", "", state.draft)); return c;
  }
  function photoArt(index) {
    const c = el("div", "photo-art"); c.setAttribute("role", "img");
    c.setAttribute("aria-label", index === 0 ? "Fictional photo placeholder: garden flowers" : "Fictional photo placeholder: seaside view");
    // Editable, original wireframe illustrations; no real personal photos.
    c.innerHTML = index === 0
      ? '<svg viewBox="0 0 400 230" aria-hidden="true"><path d="M0 205Q100 175 200 202T400 195" fill="none" stroke="currentColor" stroke-width="2"/><g fill="none" stroke="currentColor" stroke-width="2"><path d="M140 190V95M245 192V110M140 155q-50-35-45-50 45 0 45 50M245 170q40-35 45-45-40 0-45 45"/><circle cx="140" cy="80" r="24"/><circle cx="140" cy="80" r="8"/><circle cx="245" cy="98" r="30"/><circle cx="245" cy="98" r="10"/></g></svg>'
      : '<svg viewBox="0 0 400 230" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="300" cy="62" r="22"/><path d="M0 140Q50 120 100 140T200 140T300 140T400 140M0 165Q50 145 100 165T200 165T300 165T400 165M0 190Q50 170 100 190T200 190T300 190T400 190M0 115h400"/></g></svg>';
    return c;
  }
  function form(label, initial, event, hint, max) {
    const wrap = el("div", "field");
    const l = el("label", "", label); l.htmlFor = "editor";
    const t = el("textarea"); t.id = "editor"; t.value = initial; t.maxLength = max || 2000;
    t.rows = 4; t.autocomplete = "off"; t.spellcheck = false;
    const h = paragraph(hint, "supporting"); h.id = "field-hint"; t.setAttribute("aria-describedby", h.id);
    const b = el("button", "button primary", "Use these words"); b.type = "button"; b.dataset.event = event;
    b.addEventListener("click", () => go(event, t.value));
    wrap.append(l, t, h, b);
    if (state.error) { const error = paragraph(state.error, "error"); error.setAttribute("role", "alert"); wrap.append(error); }
    return wrap;
  }
  function render() {
    const content = $("screen"); content.replaceChildren();
    const meta = P.meta(state), section = state.screen;
    document.documentElement.style.setProperty("--app-scale", String(state.scale));
    $("tablet").classList.toggle("large-text", state.scale * Number($("review-scale").value) >= 1.5);
    $("mic-state").textContent = section === "listening" ? "Listening · simulated" : "Microphone off";
    $("state-label").textContent = meta[2];
    $("trace").textContent = meta[0] + " · " + meta[1] + " · " + section;
    $("review-current").textContent = "Current: " + section + " · simulated time " + state.clock + "s";
    $("send-review").checked = state.sendMode;
    $("send-review").disabled = P.ACTIVE.includes(section) || section === "unknown";
    const title = el("h1"); title.id = "screen-title"; title.tabIndex = -1; content.append(title);
    const body = el("div", "screen-body"); content.append(body);
    const actions = el("div", "actions"); content.append(actions);
    const set = (heading, text) => { title.textContent = heading; if (text) body.append(paragraph(text)); };
    const a = (label, event, value, kind, name) => actions.append(action(label, event, value, kind, name));
    const route = (label, dest, kind, name) => a(label, "route", dest, kind, name);
    const home = () => a("Back to Home", "home");
    const cancel = () => a("Cancel", "cancel");
    switch (section) {
      case "home": {
        set("What would you like to do?", "Tell me what you need. We’ll take it one step at a time.");
        const entry = el("div", "entry-grid");
        entry.append(action("Talk", "route", "listening", "primary hero-action", "mic"), action("Type a request", "route", "request", "hero-action", "type"));
        body.append(entry, el("h2", "section-label", "Or choose something"));
        const grid = el("div", "task-grid");
        [
          ["Find family photos", "Choose a person and a date", "photoPerson", "photo"],
          ["Draft a message", "Review every word before it leaves", "entry", "message"],
          ["Play some music", "Find the title you mean", "music", "music"],
          ["Make text larger", "Adjust Granny, at your pace", "sizeScope", "type"],
          ["Explain a screen", "Understand what you’re looking at", "screen", "help"]
        ].forEach(([name, desc, dest, symbol]) => {
          const b = action("", "route", dest, "task-card");
          const words = el("span", "task-words"); words.append(el("strong", "", name), el("span", "supporting", desc));
          b.append(icon(symbol), words, icon("arrow")); grid.append(b);
        });
        body.append(grid);
        if (state.playing) { const c = card("Music is still playing · simulation", state.song + " · " + state.performer); c.append(action("Return to player", "openPlayer")); body.append(c); }
        break;
      }
      case "request":
        set("What would you like help with?", "You can write naturally. This design demo asks you to choose a task next; it does not use AI to interpret your words.");
        body.append(form("Your request", state.requestText, "request", "Fictional examples only. No text leaves this tab."));
        cancel(); break;
      case "intent":
        set("Which kind of help do you mean?", "This is a manual stand-in for intent understanding. The real agent still needs implementation and evaluation.");
        body.append(card("Your request", state.requestText));
        route("Find family photos", "photoPerson"); route("Draft a message", "entry"); route("Play music", "music"); route("Make Granny text larger", "sizeScope"); route("Explain a screen", "screen");
        a("Edit request", "editRequest"); cancel(); break;
      case "entry":
        set("What should your message say?", "We’ll choose the person next. Nothing is sent here.");
        body.append(form("Message text", state.draft, "heard", "Use fictional words only. Text stays in this tab until reset or close."));
        cancel(); break;
      case "listening":
        set("I’m listening", "This is a voice-path demonstration. Your microphone is not recording.");
        body.append(card("Heard so far · sample", "Tell David I’ll call after dinner.", "transcript"));
        a("Done listening", "request", "Tell David I’ll call after dinner.", "primary", "mic");
        a("Use touch instead", "edit");
        cancel(); break;
      case "heard":
        set("Did I get that right?", "Review the words before we choose where the message goes.");
        body.append(card("Your words", state.draft, "transcript"));
        a("Use this request", "useRequest", undefined, "primary"); a("Edit the words", "edit"); cancel(); break;
      case "person":
        set("Which David?", "These are fictional, user-entered labels. I won’t guess from recent activity.");
        P.PEOPLE.forEach(p => a(p.name + " · " + p.detail, "person", p.id));
        a("Edit the words", "edit"); cancel(); break;
      case "channel":
        set("How should the draft open?", "To " + state.recipient.name + " · " + state.recipient.detail);
        body.append(card("Unselected integrations", "Example Messages and Example Mail are fictional. No account is connected."));
        a("Example Messages", "channel", "Example Messages", "primary");
        a("Example Mail", "channel", "Example Mail"); a("Change person or words", "edit"); cancel(); break;
      case "preview": case "expired":
        set(section === "expired" ? "Please review this again" : state.sendMode ? "Send this message?" : "Open this draft?",
          section === "expired" ? "The earlier approval expired or the details changed. Your words stay here; there’s no need to rush."
          : state.sendMode ? "Reviewer-only admitted-send scenario. This simulates sending now; it cannot be reliably recalled."
          : "You’ll still need to tap Send in the other app. Opening a draft does not send it.");
        body.append(preview());
        a("Change person or words", "edit"); cancel();
        a(section === "expired" ? "Renew preview" : state.sendMode ? "Send to " + state.recipient.name + " · simulated" : "Open this draft",
          section === "expired" ? "renew" : "confirm", undefined, "primary"); break;
      case "planning": case "acting": case "waiting": case "verifying": {
        const goals = { message: state.sendMode ? "Sending your message" : "Opening your draft",
          photos: "Finding " + state.photoPerson.name + "’s photos", music: "Opening your music",
          explain: "Reading your selected screen", return: "Returning to your article" };
        set(section === "planning" ? "Here’s what I’ll do" : section === "waiting" ? "Waiting for the app" : section === "verifying" ? "Checking what happened" : goals[state.job],
          section === "verifying" ? "An app response alone doesn’t prove success. I’m checking the requested outcome."
          : section === "waiting" ? "The app has not yet provided the result. You can stop or continue yourself."
          : "One scoped step at a time. You can interrupt or take over.");
        body.append(card("Current task", goals[state.job], "progress-card"));
        if (state.job === "message") body.append(preview());
        if (state.job === "photos") body.append(paragraph("Sophie · " + state.photoPerson.detail + " · " + state.photoDate));
        if (state.dispatched) body.append(paragraph("Stop prevents further actions, but the message may already have left.", "notice"));
        a("Stop", "stop", undefined, "primary", "stop"); a("Take over", "takeover"); break;
      }
      case "result":
        set(state.outcome === "sent" ? "Message sent to " + state.recipient.name
          : state.job === "message" ? "Draft opened. Not sent." : "You’re back at the article",
          state.job === "message" ? state.outcome === "sent" ? "The fixture confirms the exact message in the intended conversation. Delivery and reading are not confirmed."
          : "Review it in the other app and tap Send there if you choose. Granny has not sent it." : "The sample confirms “A walk by the sea” is visible again. No settings were changed.");
        if (state.job === "message") body.append(preview());
        body.append(paragraph("Simulated outcome — no external app or account is connected.", "notice"));
        home(); break;
      case "unknown":
        set("I can’t confirm whether it sent", "No further actions will run. Check the conversation before trying again; sending again could create a duplicate.");
        body.append(preview());
        a("Check the conversation yourself", "manualUnknown", undefined, "primary"); a("Return to Granny", "dismissUnknown"); break;
      case "stopped": case "cancelled": case "manual":
        set(section === "manual" ? "You’re in control" : section === "cancelled" ? "Cancelled. Nothing sent." : "Stopped",
          section === "manual" ? "Automation is stopped. Use the other app directly. Its real return and Stop controls still need Android testing."
          : section === "cancelled" ? "No send was started in this path. You can begin again whenever you’re ready."
          : "No more steps will run. Earlier navigation may remain; stopping is not the same as undoing.");
        if (section === "manual") body.append(card("Android-owned surface · not reproduced", "This browser stays here. It does not open or control an app."));
        home(); break;
      case "photoPerson":
        set("Which Sophie’s photos?", "Choose the person you mean.");
        P.SOPHIES.forEach(p => a(p.name + " · " + p.detail, "photoPerson", p.id)); cancel(); break;
      case "photoDate":
        set("When were they sent?", "Looking in Sophie · " + state.photoPerson.detail + "’s Example Messages conversation.");
        a("Yesterday · 13 September", "photoDate", "13 September", "primary");
        a("12 September", "photoDate", "12 September"); cancel(); break;
      case "photoConsent":
        set("Look in this conversation?", "Opening it may mark messages as read. I’ll only look for photos in the selected person and date.");
        body.append(card("Search scope", "Sophie · " + state.photoPerson.detail + "\nExample Messages · " + state.photoDate));
        a("Open and look for photos", "photoLook", undefined, "primary"); cancel(); break;
      case "photos": {
        set("Two photos from Sophie", "Sophie · " + state.photoPerson.detail + " · " + state.photoDate + " · Example Messages");
        const grid = el("div", "photo-grid");
        ["Garden flowers", "A seaside view"].forEach((label, i) => {
          const c = el("section", "photo-card"); c.append(photoArt(i), action("Open " + label.toLowerCase(), "photoOpen", i));
          grid.append(c);
        });
        body.append(grid, paragraph("Fictional image fixtures matched to the chosen source and date.", "supporting"));
        a("Change person or date", "photoAgain"); home(); break;
      }
      case "photoDetail":
        set(state.photoIndex === 0 ? "Garden flowers" : "A seaside view", "Sophie · " + state.photoPerson.detail + " · " + state.photoDate);
        body.append(photoArt(state.photoIndex), paragraph("Illustrated placeholder, not a real family photo. Native photo zoom is not implemented.", "supporting"));
        a("Back to the photos", "photoBack", undefined, "primary"); home(); break;
      case "noPhotos":
        set("I couldn’t find matching photos", "I haven’t found a verified match for that person and date. That doesn’t mean no photos exist.");
        a("Change person or date", "photoAgain", undefined, "primary"); a("Look yourself", "takeover"); home(); break;
      case "screen":
        set("Choose the screen to explain", "Use one screen you choose. I won’t inspect other screens or private sign-in fields.");
        body.append(card("Example Reader · selected fictional screen", "Display settings\nText size: Standard\nTheme: Light\n\nPreviously open: “A walk by the sea”", "external-sample"));
        a("Explain this sample screen", "explain", undefined, "primary"); cancel(); break;
      case "explanation": case "options":
        set(section === "options" ? "What these options mean" : "These are reading settings",
          "Text size changes the article’s lettering. Theme changes its light or dark background. I haven’t changed either setting.");
        body.append(card("Where you were", "The sample’s previous screen was “A walk by the sea”."));
        a("Go back to the article", "backArticle", undefined, "primary");
        if (section === "explanation") a("Explain the options", "options");
        a("Take over", "takeover"); home(); break;
      case "lostContext":
        set("I don’t know the previous screen", "I won’t guess a destination or discard unsaved work. You can continue yourself.");
        a("Take over", "takeover", undefined, "primary"); home(); break;
      case "music":
        set("Which “Quiet Harbour”?", "Choose the performer you mean. Both are fictional music fixtures.");
        a("Quiet Harbour · The Lantern Trio", "music", "The Lantern Trio", "primary", "music");
        a("Quiet Harbour · Evening Quartet", "music", "Evening Quartet", "", "music"); cancel(); break;
      case "player": {
        set(state.playing ? "Now playing" : "Music paused", "Playback state is simulated. No audio plays in this browser.");
        const album = card("", "", "album"); album.append(icon("music"), el("h2", "", state.song), paragraph(state.performer + " · Example Music")); body.append(album);
        a(state.playing ? "Pause" : "Resume", "playback", undefined, "primary"); home(); break;
      }
      case "mediaPartial":
        set("Music app opened. Playback unknown.", "I can’t verify that the requested music is playing. Check the player before trying another action.");
        a("Check the player yourself", "takeover", undefined, "primary"); home(); break;
      case "sizeScope":
        set("Where should text be bigger?", "I can change text inside Granny. Android and other apps keep their own settings.");
        a("Inside Granny", "size", undefined, "primary"); a("In another app or Android", "takeover"); cancel(); break;
      case "size": {
        set("Find a comfortable text size", "This changes Granny only. It works offline and needs no extra permission.");
        const sample = card("Your preview", "You can change your mind at any time.", "scale-preview");
        sample.style.fontSize = (state.previewScale / state.scale) + "em"; body.append(sample);
        const options = el("div", "scale-options");
        [[1,"Standard"],[1.15,"Larger"],[1.3,"Larger still"],[1.5,"Largest"]].forEach(([value,label]) => {
          const b = action(label + " · " + Math.round(value * 100) + "%", "previewScale", value);
          b.setAttribute("aria-pressed", String(state.previewScale === value)); options.append(b);
        });
        body.append(options);
        a("Apply this size", "applyScale", undefined, "primary"); a("Restore previous size", "restoreScale"); cancel(); break;
      }
      case "sizeResult":
        set("Granny’s text size is " + Math.round(state.scale * 100) + "%", "Your choice now applies throughout this prototype. Other apps are unchanged. Reloading resets this tab’s preferences.");
        a("Restore previous size", "restoreScale"); home(); break;
      case "setup":
        set("A little help, on your terms", "Ask for help with photos, messages and music. See what happens, change your mind or take over.");
        body.append(card("About this experience", "Granny is experimental software, not a person. This prototype uses fictional examples and operates no real apps."));
        a("Set up my preferences", "setupNext", undefined, "primary"); home(); break;
      case "preferences":
        set("Make this comfortable", "On-screen replies are always available. Voice is optional and your choices can change later.");
        a("Continue with on-screen replies", "setupNext", undefined, "primary"); a("Choose text size", "size"); home(); break;
      case "micConsent":
        set("Would you like to use your voice?", "The microphone would start only when you tap Talk. Typing and buttons work without microphone access.");
        a("Review the Android handoff", "setupNext", undefined, "primary"); a("Not now · use touch", "skipMic"); home(); break;
      case "micOS":
        set("Android microphone permission", "Android owns this prompt. Its actual appearance must be checked on the reference tablet.");
        body.append(card("Placeholder, not a permission request", "Neither button below changes browser or Android permissions."));
        a("Simulate allowing microphone", "mic", true); a("Simulate declining microphone", "mic", false); home(); break;
      case "micDenied":
        set("You can keep using touch", "Microphone access is off. You can type or choose a task. I won’t repeatedly ask you to turn it on.");
        a("Continue", "setupNext", undefined, "primary"); home(); break;
      case "cloudConsent":
        set("Online help is a separate choice", "A real service would need a named provider, the exact data sent and retention terms. None has been selected.");
        body.append(card("Online processing is unavailable", "No consent is collected and no data leaves this prototype. We can review the next setup step with online help kept off."));
        a("Keep online help off · continue", "setupNext", undefined, "primary"); home(); break;
      case "screenConsent":
        set("Choose what I can see", "Screen access is separate from microphone and online help. You can decline; there is no background or family viewing.");
        body.append(card("Samples only", "There is no browser capture or Android permission here."));
        a("Try with sample screens", "screenChoice", true, "primary"); a("Keep screen access off", "screenChoice", false); break;
      case "settings":
        set("Make Granny yours", "Your choices stay in this tab only. No disability or family relationship is inferred.");
        a("Text size", "size", undefined, "primary"); route("Remembered aliases", "memory"); route("Privacy and permissions", "privacy"); route("Help and feedback", "help"); route("Try setup", "setup"); home(); break;
      case "history":
        set(state.history.length ? "Your activity" : "No activity yet", "Session-only summaries. No message bodies or people are stored in this list.");
        state.history.forEach(h => body.append(card(h.job, h.outcome)));
        route("Privacy and deletion", "privacy"); home(); break;
      case "privacy":
        set("Privacy, under your control", "Microphone: no recording\nOnline processing: off\nScreen access: fictional samples only\nFamily access: none\nStorage: this tab’s memory only");
        body.append(card("Reset clears this design session", "No personal data should be entered. Nothing is uploaded, written to browser storage or sent to another app."));
        a("Review deleting activity", "deleteHistory"); route("Remembered aliases", "memory"); home(); break;
      case "deleteHistory":
        set("Delete this tab’s activity?", "This removes the prototype’s task summaries. It does not delete messages, photos or any other app’s data.");
        cancel(); a("Delete activity", "clearHistory", undefined, "danger"); break;
      case "memory":
        set("What I remember", state.alias ? "One explicit fictional alias. Source: entered by you in this sample. Private to this tab." : "No remembered aliases. Nothing is inferred or saved automatically.");
        if (state.alias) body.append(card("Alias", state.alias));
        a(state.alias ? "Correct alias" : "Add an alias", "aliasEdit");
        if (state.alias) a("Delete alias", "deleteAlias"); home(); break;
      case "aliasEdit":
        set("Use your own words", "This does not change contacts or choose a message recipient.");
        body.append(form("Alias", state.alias, "aliasSave", "Fictional examples only; private to this tab.", 120)); cancel(); break;
      case "deleteAlias":
        set("Delete this remembered alias?", "This removes the prototype’s alias. It does not delete a contact, photo or message.");
        body.append(card("Alias to remove", state.alias)); cancel(); a("Delete alias", "clearAlias", undefined, "danger"); break;
      case "help":
        set("Help without sharing private content", "You can practice stopping a sample task or review what a diagnostics summary would contain.");
        route("Practice screen help and Stop", "screen", "primary"); route("Review sample diagnostics", "diagnostics"); home(); break;
      case "diagnostics":
        set("Review before sharing", "This prototype sends no report. The example excludes screenshots, audio, message text, recipients and account identifiers.");
        body.append(card("Sample diagnostics", "Task category: message draft\nOutcome: app unavailable\nRetry count: 0"));
        route("Back to Help", "help"); home(); break;
      case "offline": case "permission": case "auth": case "restricted": case "failed": case "unsupported": {
        const copy = {
          offline: ["You’re offline", "This task has stopped. Nothing will run automatically when the connection returns. Granny’s text settings still work."],
          permission: ["Screen access is off", "I stopped reading and acting. Re-enabling a permission never silently resumes a task."],
          auth: ["Sign in privately", "I won’t read, store or type your password or verification code. Start again with a fresh screen after signing in yourself."],
          restricted: ["I can’t do that here", "Protected screens, purchases and account security stay under your control. I won’t bypass a protection or start a subscription."],
          failed: ["I couldn’t finish this task", "No send was started in this path. I won’t keep trying in the background. Your draft remains in this tab."],
          unsupported: ["That path isn’t available", "This prototype supports only the named sample workflows. It has not substituted another person or action."]
        };
        set(...copy[section]); if (section === "offline") route("Change Granny text size", "sizeScope", "primary");
        a("Continue yourself", "takeover"); home(); break;
      }
      default: throw new Error("Missing screen renderer: " + section);
    }
    const active = P.ACTIVE.includes(section);
    for (const id of ["history","settings"]) { $(id).disabled = active || section === "listening" || section === "unknown"; $(id).title = $(id).disabled ? "Stop or finish this task first." : ""; }
    for (const o of $("fault").options) o.disabled = o.value === "noPhotos" && state.job !== "photos" || o.value === "lostContext" && !["explain","return"].includes(state.job);
    $("simulation-step").hidden = !active;
    $("advance").disabled = !active;
    $("finish-sample").disabled = !active;
    $("expire").disabled = section !== "preview";
    $("fault").disabled = !(active || ["screen","preview","expired"].includes(section));
    $("tick").disabled = !(active || section === "preview");
    $("global-stop").hidden = !(active || section === "listening");
    $("announcement").textContent = meta[2] + ". " + title.textContent;
    document.title = title.textContent + " · Granny prototype";
    title.focus({ preventScroll: true });
    if (section !== "size") window.scrollTo({ top: 0, behavior: "instant" });
  }
  $("home").onclick = () => go("home");
  $("history").onclick = () => go("route", "history");
  $("settings").onclick = () => go("route", "settings");
  $("global-stop").onclick = () => go("stop");
  $("advance").onclick = () => go("advance");
  $("finish-sample").onclick = () => { for (let i=0; i<4 && P.ACTIVE.includes(state.screen); i++) P.dispatch(state,"advance"); render(); };
  $("expire").onclick = () => go("tick", 60);
  $("tick").onclick = () => go("tick", 15);
  $("fault").onchange = e => { if (e.target.value) go("fault", e.target.value); e.target.value = ""; };
  $("reset").onclick = () => { $("review-scale").value = "1"; document.documentElement.style.setProperty("--review-scale","1"); go("reset"); };
  $("send-review").onchange = e => go("reviewSend", e.target.checked);
  $("review-scale").onchange = e => { document.documentElement.style.setProperty("--review-scale", e.target.value); render(); };
  document.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); go("escape"); } });
  window.addEventListener("pagehide", () => { Object.assign(state, P.create()); });
  render();
})();
