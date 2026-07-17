let _observer = null;
let _keydownHandler = null;

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
      try {
        await navigator.clipboard.writeText(code);
        button.classList.add("copied");
        setTimeout(() => button.classList.remove("copied"), 900);
      } catch {
        // clipboard access denied — button stays in default state
      }
    });
  });

  const drawer = document.getElementById("checklistDrawer");
  const backdrop = document.querySelector("[data-checklist-backdrop]");
  const open = document.querySelector("[data-checklist-open]");
  const badgeEl = document.querySelector("[data-checklist-count]");

  const setDrawer = (state) => {
    drawer?.classList.toggle("open", state);
    backdrop?.classList.toggle("open", state);
    drawer?.setAttribute("aria-hidden", state ? "false" : "true");
    open?.setAttribute("aria-expanded", state ? "true" : "false");
    if (state) {
      drawer?.querySelector("button, [href], input, [tabindex]:not([tabindex='-1'])")?.focus();
    } else {
      open?.focus();
    }
  };

  open?.addEventListener("click", () => setDrawer(true));
  document.querySelector("[data-checklist-close]")?.addEventListener("click", () => setDrawer(false));
  backdrop?.addEventListener("click", () => setDrawer(false));

  const pageKey = `ck3docs.checklist.${root.lang}`;
  const saved = JSON.parse(localStorage.getItem(pageKey) || "{}");
  const checkItems = document.querySelectorAll("[data-check-item]");

  const updateBadge = () => {
    if (!badgeEl) return;
    const checked = Object.values(saved).filter(Boolean).length;
    const total = checkItems.length;
    badgeEl.textContent = checked ? `${checked}/${total}` : (total || "");
  };

  checkItems.forEach((input) => {
    const key = input.getAttribute("data-check-item");
    input.checked = saved[key] === true;

    input.addEventListener("change", () => {
      saved[key] = input.checked;
      localStorage.setItem(pageKey, JSON.stringify(saved));
      updateBadge();
    });
  });

  updateBadge();

  if (_keydownHandler) {
    document.removeEventListener("keydown", _keydownHandler);
  }
  _keydownHandler = (e) => {
    if (e.key === "Escape") {
      setDrawer(false);
      return;
    }
    if (e.key === "Tab" && drawer?.classList.contains("open")) {
      const focusable = [...drawer.querySelectorAll("button, input, [href], [tabindex]:not([tabindex=\"-1\"])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };
  document.addEventListener("keydown", _keydownHandler);

  document.querySelector(".recipeListItem.active")
    ?.scrollIntoView({ block: "nearest", behavior: "smooth" });

  const filterInput = document.querySelector("[data-sidebar-filter]");
  if (filterInput) {
    filterInput.value = "";
    filterInput.addEventListener("input", () => {
      const q = filterInput.value.toLowerCase().trim();
      document.querySelectorAll(".leftNav [data-nav-group]").forEach((nav) => {
        const title = nav.previousElementSibling;
        let anyVisible = false;
        nav.querySelectorAll(".navItem").forEach((link) => {
          const match = !q || link.textContent.toLowerCase().includes(q);
          link.style.display = match ? "" : "none";
          if (match) anyVisible = true;
        });
        if (title) title.style.display = anyVisible ? "" : "none";
        nav.style.display = anyVisible ? "" : "none";
      });
    });
  }

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
      const activeLink = byId.get(visible.target.id);
      activeLink?.classList.add("active");
      activeLink?.scrollIntoView({ block: "nearest" });
    }, { rootMargin: "-82px 0px -70% 0px", threshold: [0.1, 0.25, 0.5] });

    sections.forEach((section) => _observer.observe(section));
  }
});
