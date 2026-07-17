const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const keywordSet = new Set([
  "hidden",
  "trigger",
  "immediate",
  "option",
  "after",
  "limit",
  "else_if",
  "else",
  "if",
  "random",
  "random_list",
  "trigger_event",
  "on_trigger_fail",
  "cooldown",
  "save_scope_as",
  "save_temporary_scope_as",
  "set_variable",
  "create_story",
  "create_character",
  "spawn_army",
  "start_war",
  "start_scheme",
  "start_travel_plan",
  "duel",
  "create_faction",
  "set_player_character",
  "add_character_flag",
  "remove_character_flag",
  "add_trait",
  "remove_trait",
  "add_character_modifier",
  "add_opinion",
  "debug_log",
  "debug_log_date",
  "name",
  "value",
  "target",
  "type",
  "modifier",
  "years",
  "days",
  "months",
  "id",
  "destination",
  "return_trip",
  "on_arrival_event",
  "casus_belli",
  "skill",
  "namespace",
  "NOT",
  "AND",
  "OR",
  "NOR",
  "start_story",
  "has_variable",
  "has_character_flag",
  "has_trait",
  "exists",
  "is_alive",
  "is_adult",
  "is_landed",
  "is_at_war",
  "add_gold",
  "add_stress",
]);

const scopeWords = new Set([
  "root",
  "prev",
  "this",
  "liege",
  "top_liege",
  "dynasty",
  "capital_province",
  "location",
]);

const tokenRe = /("[^"]*"|#[^\n]*|\b[A-Za-z_][A-Za-z0-9_:.\/]*\b|\b\d+(?:\.\d+){0,2}\b|&gt;=|&lt;=|&gt;|&lt;|=|\{|\})/g;

export function highlightJomini(raw = "") {
  return escapeHtml(raw).replace(tokenRe, (token) => {
    let cls = "";

    if (token.startsWith("#")) cls = "jom-comment";
    else if (token.startsWith("\"")) cls = "jom-string";
    else if (/^\d/.test(token)) cls = "jom-number";
    else if (/^(yes|no|always)$/.test(token)) cls = "jom-bool";
    else if (/^(&gt;=|&lt;=|&gt;|&lt;|=|\{|\})$/.test(token)) cls = "jom-op";
    else if (/^(scope:|culture:|faith:|religion:|title:|character:|flag:)/.test(token) || scopeWords.has(token)) {
      cls = "jom-scope";
    } else if (/^[A-Za-z0-9_]+:[A-Za-z0-9_.\/]+$/.test(token)) cls = "jom-ref";
    else if (keywordSet.has(token)) cls = "jom-key";

    return cls ? `<span class="${cls}">${token}</span>` : token;
  });
}
