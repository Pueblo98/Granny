/* Deterministic intent extraction for fictional prototype requests. */
(function(root) {
"use strict";
function parse(text) {
  const request = String(text == null ? "" : text).trim();
  if (!request)
    return {kind : "empty", request};
  const command = request.match(
      /^(?:please\s+)?(?:tell|message|text|write\s+(?:a\s+)?message\s+to)(?:\s+(.*))?$/i);
  if (!command)
    return {kind : "unsupported", request};
  const tail = (command[1] || "").trim();
  if (!tail)
    return {
      kind : "message",
      request,
      recipient : "",
      detail : "",
      channel : "",
      body : ""
    };
  const channelMatch =
      tail.match(/\s+(?:via|in)\s+(Example Messages|Example Mail)\s*$/i);
  const channel = channelMatch && channelMatch[1]
                                      .replace(/\b\w/g, (c) => c.toUpperCase())
                                      .replace("MESSAGES", "Messages")
                                      .replace("MAIL", "Mail");
  const content = channelMatch ? tail.slice(0, channelMatch.index) : tail;
  const personOnly = content.match(
      /^(David|Sophie)(?:\s+(Brother|Gardening group|Daughter|Book club))?$/i);
  if (personOnly)
    return {
      kind : "message", request, recipient : personOnly[1],
      detail : personOnly[2] || "", channel : channel || "", body : ""
    };
  const match =
      content.match(
          /^(David|Sophie)(?:\s+(Brother|Gardening group|Daughter|Book club))?(?:\s+that)?(?:\s*[:,])?\s+(.+)$/i) ||
      tail.match(/^([^,:]+)\s*[:,]\s*(.+)$/);
  if (!match)
    return {kind : "unsupported", request};
  const recipient = match[1].trim();
  const detail = match.length > 3 ? (match[2] || "").trim() : "";
  const body = match.length > 3 ? match[3] : match[2];
  if (!recipient || !body)
    return {kind : "unsupported", request};
  return {kind : "message", request, recipient, detail, channel, body};
}
function followup(text) {
  const value = String(text == null ? "" : text).trim();
  const correction = value.match(
      /^(?:actually,?\s*)?(?:change (?:the )?message to|make it)\s+(.+)$/i);
  if (correction)
    return {type : "body", value : correction[1]};
  return {type : "slot", value};
}
const api = {
  parse,
  followup
};
root.GrannyIntent = api;
if (typeof module !== "undefined")
  module.exports = api;
})(globalThis);
