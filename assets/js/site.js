const STORE_PREFIX = "checked:";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Home: search box and category chips filter the same card list.
function initFilter() {
  const grid = $("#recipes");
  if (!grid) return;

  const input = $("#q");
  const chips = $$(".filters .chip");
  const cards = $$(".card", grid);
  const empty = $("#empty");
  const status = $("#status");
  let tag = "";

  const apply = () => {
    const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;

    for (const card of cards) {
      const tags = card.dataset.tags.split("|");
      const text = card.dataset.search;
      const match = (!tag || tags.includes(tag)) && words.every((w) => text.includes(w));
      card.hidden = !match;
      if (match) shown++;
    }

    empty.hidden = shown > 0;
    status.textContent = `${shown} recipes shown`;
  };

  input.addEventListener("input", apply);

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      tag = chip.dataset.tag;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      apply();
    });
  }
}

// Recipe: tick off ingredients and steps while cooking. State is kept per page.
function initChecklist() {
  const items = $$(".recipe .prose li");
  if (!items.length) return;

  const key = STORE_PREFIX + location.pathname;
  const reset = $("[data-reset]");
  let saved = [];

  try { saved = JSON.parse(localStorage.getItem(key)) || []; } catch {}

  const save = () => {
    const done = items.flatMap((li, i) => (li.classList.contains("done") ? [i] : []));
    reset.hidden = done.length === 0;
    try { localStorage.setItem(key, JSON.stringify(done)); } catch {}
  };

  items.forEach((li, i) => {
    li.tabIndex = 0;
    li.setAttribute("role", "checkbox");

    const set = (on) => {
      li.classList.toggle("done", on);
      li.setAttribute("aria-checked", String(on));
    };
    set(saved.includes(i));

    const toggle = (e) => {
      // Nested lists: only the clicked item toggles.
      e.stopPropagation();
      if (e.target.closest("a")) return;
      set(!li.classList.contains("done"));
      save();
    };

    li.addEventListener("click", toggle);
    li.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(e); }
    });
  });

  reset.addEventListener("click", () => {
    items.forEach((li) => { li.classList.remove("done"); li.setAttribute("aria-checked", "false"); });
    save();
  });

  reset.hidden = saved.length === 0;
}

function initPrint() {
  $$("[data-print]").forEach((b) => b.addEventListener("click", () => window.print()));
}

initFilter();
initChecklist();
initPrint();
