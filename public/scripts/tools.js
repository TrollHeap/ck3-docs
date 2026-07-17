document.addEventListener("astro:page-load", () => {
  // ── Event Generator ──────────────────────────────────────
  const eventForm = document.querySelector("[data-generator-form]");
  const eventOutput = document.querySelector("[data-generator-output]");

  if (eventForm && eventOutput) {
    const val = (name) => eventForm.elements[name]?.value?.trim() || "";

    eventForm.onsubmit = (e) => {
      e.preventDefault();
      const namespace = val("namespace") || "my_story";
      const eventId = val("eventId") || "0001";
      const effect = val("effect") || "add_trait = brave";
      const receiver = val("receiver") || "root";
      const target = val("target") || "scope:target";
      const cb = val("cb") || "independence_war";
      const eventType = val("eventType") || "character_event";

      let code;
      if (eventType === "hidden_setup") {
        const flag = `${namespace}_active`;
        code = `namespace = ${namespace}

# Hidden setup — fires once per character (guarded by variable)
${namespace}.${eventId} = {
  type = character_event
  hidden = yes

  trigger = {
    NOT = { has_variable = ${flag} }
    exists = ${target}
  }

  immediate = {
    set_variable = {
      name = ${flag}
      value = yes
    }
    save_scope_as = story_owner
    ${receiver} = {
      ${effect}
    }
    # Uncomment to start a story cycle:
    # start_story = ${namespace}
  }
}`;
      } else {
        code = `namespace = ${namespace}

${namespace}.${eventId} = {
  type = character_event
  title = ${namespace}.${eventId}.title
  desc = ${namespace}.${eventId}.desc

  trigger = {
    exists = ${target}
  }

  immediate = {
    save_scope_as = story_owner
  }

  option = {
    name = ${namespace}.${eventId}.a
    ${receiver} = {
      ${effect}
    }
  }

  option = {
    name = ${namespace}.${eventId}.b
    start_war = {
      casus_belli = ${cb}
      target = ${target}
    }
  }
}`;
      }

      eventOutput.querySelector("code").textContent = code;
      const titleEl = eventOutput.querySelector("[data-output-title]");
      if (titleEl) {
        titleEl.textContent = eventType === "hidden_setup" ? "hidden setup event" : "character event";
      }
    };
  }

  // ── Scripted Trigger Generator ───────────────────────────
  const triggerForm = document.querySelector("[data-trigger-form]");
  const triggerOutput = document.querySelector("[data-trigger-output]");

  if (triggerForm && triggerOutput) {
    const val = (name) => triggerForm.elements[name]?.value?.trim() || "";

    triggerForm.onsubmit = (e) => {
      e.preventDefault();
      const name = val("triggerName") || "my_story_is_active";
      const varFlag = val("varFlag") || "my_story_active";
      const scopeAlias = val("scopeAlias");
      const extraCond = val("extraCond");

      const lines = [`  has_variable = ${varFlag}`];
      if (scopeAlias) lines.push(`  scope:${scopeAlias} = { exists = this }`);
      if (extraCond) lines.push(`  ${extraCond}`);

      triggerOutput.querySelector("code").textContent = `${name} = {\n${lines.join("\n")}\n}`;
    };
  }

  // ── Scripted Effect Generator ────────────────────────────
  const effectForm = document.querySelector("[data-effect-form]");
  const effectOutput = document.querySelector("[data-effect-output]");

  if (effectForm && effectOutput) {
    const val = (name) => effectForm.elements[name]?.value?.trim() || "";

    effectForm.onsubmit = (e) => {
      e.preventDefault();
      const name = val("effectName") || "my_story_start";
      const varFlag = val("varFlag") || "my_story_active";
      const scopeAlias = val("scopeAlias") || "story_owner";
      const effectContent = val("effectContent") || "start_story = my_namespace";

      effectOutput.querySelector("code").textContent = `${name} = {
  if = {
    limit = { NOT = { has_variable = ${varFlag} } }
    set_variable = {
      name = ${varFlag}
      value = yes
    }
    save_scope_as = ${scopeAlias}
    ${effectContent}
  }
}`;
    };
  }
});
