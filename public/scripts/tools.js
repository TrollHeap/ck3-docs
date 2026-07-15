document.addEventListener("astro:page-load", () => {
  const form = document.querySelector("[data-generator-form]");
  const output = document.querySelector("[data-generator-output]");
  if (!form || !output) return;

  const val = (name) => form.elements[name]?.value?.trim() || "";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const namespace = val("namespace") || "my_story";
    const eventId = val("eventId") || "0001";
    const effect = val("effect") || "add_trait = brave";
    const receiver = val("receiver") || "root";
    const target = val("target") || "scope:target";
    const cb = val("cb") || "independence_war";

    const code = `namespace = ${namespace}

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

    output.querySelector("code").textContent = code;
  });
});
