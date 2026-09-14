/* Opt-in conversation transport. Proposals are data, never dispatched by fetch. */
(() => {
  'use strict';
  window.GrannyCloud = { create({ onChange, onTurn }) {
    let enabled = false, controller = null, generation = 0, history = [], proposal = null, note = '', metrics = null;
    const changed = () => onChange();
    const cancel = (message = 'Stopped. Nothing was run by the model.') => {
      const hadWork = !!controller || !!proposal;
      generation++; controller?.abort(); controller = null; proposal = null;
      if (hadWork) { note = message; changed(); }
    };
    return {
      get enabled() { return enabled; },
      get busy() { return !!controller; },
      get proposal() { return proposal; },
      get note() { return note; },
      get metrics() { return metrics; },
      cancel,
      reset() { cancel(); history = []; note = ''; metrics = null; changed(); },
      enable(value) { cancel(); enabled = value; history = []; note = ''; metrics = null; changed(); },
      takeProposal() { const p = proposal; cancel(''); return p; },
      async ask(text) {
        if (!enabled || !text.trim()) return;
        cancel('');
        const mine = ++generation;
        const request = new AbortController(); controller = request; proposal = null; note = 'Asking Qwen… You can stop at any time.'; metrics = null;
        const message = { role:'user', content:text };
        // Only cloud-mode conversation since consent; no local aliases, task history or screenshots.
        const messages = [...history, message].slice(-11);
        while (messages.reduce((n, m) => n + m.content.length, 0) > 12000 && messages.length > 1) messages.shift();
        onTurn('user', text); changed();
        const timer = setTimeout(() => request.abort(), 30000);
        try {
          const response = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ consent:true, messages }), signal:request.signal });
          const data = await response.json();
          if (mine !== generation) return;
          if (!response.ok) {
            const errors = { not_configured:'Qwen is not configured on the local server.', provider_auth:'The server’s OpenRouter key was not accepted.', provider_credit:'OpenRouter reports insufficient credit.', provider_request:'The provider did not accept this request format.', provider_route:'No provider route is available under the current model, privacy and price limits.', provider_busy:'The provider is rate-limiting requests. Wait before trying again.', request_limit:'The local request limit has been reached. Wait a minute, or stop the server and review the budget before restarting.', timeout:'Qwen did not reply in time.', invalid_proposal:'Qwen suggested an unsupported task. Nothing was run.', incomplete_response:'Qwen’s answer was incomplete. Nothing was run.' };
            throw new Error(errors[data.error] || 'Qwen is unavailable or its response could not be safely used.');
          }
          history = [...messages, { role:'assistant', content:data.reply }].slice(-10);
          proposal = data.proposal; metrics = { elapsedMs:data.elapsedMs, tokens:data.usage?.total_tokens };
          note = 'AI reply — not verified. Device actions remain fictional.';
          onTurn('assistant', data.reply);
        } catch (error) {
          if (mine !== generation) return;
          note = (request.signal.aborted ? 'The request stopped or timed out.' : error.message) + ' Nothing was run. You can retry explicitly or turn AI mode off for the scripted examples.';
        } finally {
          clearTimeout(timer);
          if (mine === generation) { controller = null; changed(); }
        }
      }
    };
  } };
})();
