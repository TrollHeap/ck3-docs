let _observer = null;

// Reapply theme immediately after DOM swap to prevent flash
document.addEventListener("astro:after-swap", () => {
  if (localStorage.getItem("ck3docs.theme") === "light") {
    document.documentElement.classList.add("light");
  }
});

document.addEventListener("astro:page-load", () => {
  const root = document.documentElement;

  if (localStorage.getItem("ck3docs.theme") === "light") {
    root.classList.add("light");
  }

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("ck3docs.theme", root.classList.contains("light") ? "light" : "dark");
  });

  document.querySelector("[data-lang-select]")?.addEventListener("change", (event) => {
    window.location.href = event.target.value;
  });

  document.querySelectorAll("[data-copy-code]").forEach((button) => {
    button.addEventListener("click", async () => {
      const code = button.closest(".codewrap")?.querySelector("code")?.innerText || "";
      await navigator.clipboard.writeText(code);
      const old = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => button.textContent = old, 900);
    });
  });

  const drawer = document.getElementById("checklistDrawer");
  const open = document.querySelector("[data-checklist-open]");
  const close = document.querySelector("[data-checklist-close]");

  const setDrawer = (state) => {
    drawer?.classList.toggle("open", state);
    drawer?.setAttribute("aria-hidden", state ? "false" : "true");
    open?.setAttribute("aria-expanded", state ? "true" : "false");
  };

  open?.addEventListener("click", () => setDrawer(true));
  close?.addEventListener("click", () => setDrawer(false));

  const pageKey = `ck3docs.checklist.${root.lang}`;
  const saved = JSON.parse(localStorage.getItem(pageKey) || "{}");

  document.querySelectorAll("[data-check-item]").forEach((input) => {
    const key = input.getAttribute("data-check-item");
    input.checked = saved[key] === true;

    input.addEventListener("change", () => {
      saved[key] = input.checked;
      localStorage.setItem(pageKey, JSON.stringify(saved));
    });
  });

  if (_observer) {
    _observer.disconnect();
    _observer = null;
  }

  const activeLinks = [...document.querySelectorAll(".leftNav .navItem")];
  const sections = activeLinks
    .map((link) => document.getElementById(link.getAttribute("href")?.slice(1)))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const byId = new Map(activeLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));
    _observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      activeLinks.forEach((link) => link.classList.remove("active"));
      byId.get(visible.target.id)?.classList.add("active");
    }, { rootMargin: "-82px 0px -70% 0px", threshold: [0.1, 0.25, 0.5] });

    sections.forEach((section) => _observer.observe(section));
  }
});
