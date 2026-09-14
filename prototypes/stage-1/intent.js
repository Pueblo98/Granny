/* Deterministic intent extraction for fictional prototype requests. */
(function (root) {
  "use strict";
  function parse(text) {
    const request = String(text == null ? "" : text).trim();
    if (!request) return { kind: "empty", request };
    const command = request.match(/^(?:please\s+)?(?:tell|message)\s+(.+)$/i);
    if (!command) return { kind: "unsupported", request };
    const tail = command[1];
    const match = tail.match(/^(David|Sophie)(?:\s+that)?(?:\s*[:,])?\s+(.+)$/i)
      || tail.match(/^([^,:]+)\s*[:,]\s*(.+)$/);
    if (!match) return { kind: "unsupported", request };
    const recipient = match[1].trim();
    const body = match[2];
    if (!recipient || !body) return { kind: "unsupported", request };
    return { kind: "message", request, recipient, body };
  }
  const api = { parse };
  root.GrannyIntent = api;
  if (typeof module !== "undefined") module.exports = api;
})(globalThis);
