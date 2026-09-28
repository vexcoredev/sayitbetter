/* Say It Better — landing page demos. No dependencies. */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------------------------------------------------------------
   * Visibility gate: demos only advance while on screen.
   * ------------------------------------------------------------- */
  function gate(el) {
    let visible = false;
    let waiters = [];
    const flush = () => { const w = waiters; waiters = []; w.forEach((r) => r()); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { visible = e.isIntersecting; if (visible) flush(); });
      }, { threshold: 0.2 }).observe(el);
    } else {
      visible = true;
    }
    const waitVisible = () => (visible && !document.hidden ? Promise.resolve() : new Promise((r) => waiters.push(r)));
    document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) flush(); });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms)).then(waitVisible);
    return { sleep, waitVisible, isVisible: () => visible };
  }

  /* Move a fake cursor to the center of a target, relative to a container. */
  function moveCursor(cursor, container, target, dx = 0, dy = 0) {
    const c = container.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const x = t.left - c.left + t.width / 2 - 3 + dx;
    const y = t.top - c.top + t.height / 2 - 3 + dy;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }
  function parkCursor(cursor, container, fx = 0.85, fy = 0.95) {
    const c = container.getBoundingClientRect();
    cursor.style.transform = `translate(${c.width * fx}px, ${c.height * fy}px)`;
  }
  function click(cursor) {
    cursor.classList.remove("click");
    void cursor.offsetWidth;
    cursor.classList.add("click");
  }

  /* ---------------------------------------------------------------
   * 1. Hero: ghost-text autocomplete
   * ------------------------------------------------------------- */
  function heroDemo() {
    const root = $("#demo-auto");
    if (!root) return;
    const typed = $("[data-typed]", root);
    const ghost = $("[data-ghost]", root);
    const compose = $(".compose", root);
    const head = $("[data-hero-head]", root);
    const noteTitle = $("[data-hero-notetitle]", root);
    const title = $("[data-hero-title]", root);
    const appLabel = $("[data-hero-app]", root);
    const appChips = $$(".apps-row li[data-app]");
    const keys = {};
    $$("[data-key]", root).forEach((k) => (keys[k.dataset.key] = k));

    const scenes = [
      {
        app: "Mail", title: "New Message", head: true,
        steps: [
          ["type", "Hi Sam,\n\nThanks for walking me through the new onboarding flow today. I'll"],
          ["wait", 380],
          ["ghost", " share my notes with the team by Thursday."],
          ["wait", 1100],
          ["tab"], ["wait", 520],
          ["tab"], ["wait", 520],
          ["match", " notes"], ["wait", 600],
          ["all"], ["wait", 2600],
        ],
      },
      {
        app: "Notes", title: "Notes", note: "Lisbon trip",
        steps: [
          ["type", "Pack: comfy walking shoes, sunscreen, and a light"],
          ["wait", 380],
          ["ghost", " jacket for the evenings."],
          ["wait", 1000],
          ["tab"], ["wait", 600],
          ["right"], ["wait", 600],
          ["all"], ["wait", 900],
          ["type", "\nBook dinner in Alfama for"],
          ["wait", 380],
          ["ghost", " Friday night."],
          ["wait", 1000],
          ["all"], ["wait", 2600],
        ],
      },
    ];
    const finalScene = { text: "Hi Sam,\n\nThanks for walking me through the new onboarding flow today. I'll", ghost: " share my notes with the team by Thursday." };

    const g = gate(root);
    let textNode = null;

    const clear = () => { typed.textContent = ""; ghost.textContent = ""; textNode = null; };
    const addChar = (ch) => {
      if (!textNode || textNode !== typed.lastChild) { textNode = document.createTextNode(""); typed.appendChild(textNode); }
      textNode.data += ch;
    };
    const accept = (str) => {
      const s = document.createElement("span");
      s.className = "acc";
      s.textContent = str;
      typed.appendChild(s);
      textNode = null;
    };
    const press = (k) => {
      const el = keys[k];
      if (!el) return;
      el.classList.add("pressed");
      if (k === "opt") keys.tab && keys.tab.classList.add("pressed");
      setTimeout(() => { el.classList.remove("pressed"); keys.tab && keys.tab.classList.remove("pressed"); }, 380);
    };
    const nextWord = () => {
      const m = ghost.textContent.match(/^\s*\S+/);
      return m ? m[0] : "";
    };
    const setScene = (sc) => {
      title.textContent = sc.title;
      appLabel.textContent = sc.app;
      head.hidden = !sc.head;
      noteTitle.hidden = !sc.note;
      if (sc.note) noteTitle.textContent = sc.note;
      appChips.forEach((c) => c.classList.toggle("on", c.dataset.app === sc.app));
    };

    async function run(step) {
      const [op, arg] = step;
      if (op === "type") {
        root.classList.add("typing");
        for (const ch of arg) {
          addChar(ch);
          await g.sleep(ch === " " ? rand(60, 120) : ch === "\n" ? 260 : rand(28, 70));
        }
        root.classList.remove("typing");
      } else if (op === "ghost") {
        ghost.textContent = arg;
        ghost.classList.remove("in"); void ghost.offsetWidth; ghost.classList.add("in");
      } else if (op === "tab" || op === "right") {
        press(op);
        const w = nextWord();
        ghost.textContent = ghost.textContent.slice(w.length);
        accept(w);
      } else if (op === "all") {
        press("opt");
        const rest = ghost.textContent;
        ghost.textContent = "";
        accept(rest);
      } else if (op === "match") {
        // Typing characters that match the ghost text just consumes them.
        root.classList.add("typing");
        for (const ch of arg) {
          addChar(ch);
          if (ghost.textContent[0] === ch) ghost.textContent = ghost.textContent.slice(1);
          await g.sleep(ch === " " ? 110 : rand(55, 95));
        }
        root.classList.remove("typing");
      } else if (op === "wait") {
        await g.sleep(arg);
      }
    }

    if (reduced) {
      setScene(scenes[0]);
      typed.textContent = finalScene.text;
      ghost.textContent = finalScene.ghost;
      return;
    }

    (async () => {
      await g.waitVisible();
      for (;;) {
        for (const sc of scenes) {
          setScene(sc);
          clear();
          compose.classList.remove("fade");
          await g.sleep(500);
          for (const st of sc.steps) await run(st);
          compose.classList.add("fade");
          await g.sleep(420);
        }
      }
    })();
  }

  /* ---------------------------------------------------------------
   * 2. Say It Better (rewrite) panel
   * ------------------------------------------------------------- */
  function rewriteDemo() {
    const root = $("#demo-rewrite");
    if (!root) return;
    const line = $("[data-rw-line]", root);
    const empty = $("[data-rw-status]", root);
    const emptyText = $("[data-rw-status-text]", root);
    const steps = $$("[data-rw-step]", root);
    const rows = $$("[data-rw-row]", root);
    const target = $("[data-rw-target]", root);
    const targetRow = target.closest("li");
    const toast = $("[data-rw-toast]", root);
    const cursor = $("[data-cursor]", root);
    const g = gate(root);

    const raw = "can you check once why access is not coming";
    const idle = emptyText.textContent;

    const showAll = () => {
      line.textContent = raw;
      empty.classList.add("hide");
      steps.forEach((s) => s.classList.add("show"));
      rows.forEach((r) => r.classList.add("show"));
    };

    if (reduced) {
      showAll();
      return;
    }

    const reset = () => {
      line.textContent = "";
      steps.forEach((s) => s.classList.remove("show"));
      rows.forEach((r) => r.classList.remove("show"));
      empty.classList.remove("hide", "thinking");
      emptyText.textContent = idle;
      target.classList.remove("done");
      targetRow.classList.remove("hover");
      toast.classList.remove("show");
      cursor.classList.remove("show");
    };

    (async () => {
      await g.waitVisible();
      for (;;) {
        reset();
        parkCursor(cursor, root);
        await g.sleep(700);
        root.classList.add("typing");
        for (const ch of raw) {
          line.textContent += ch;
          await g.sleep(ch === " " ? rand(50, 110) : rand(25, 60));
        }
        root.classList.remove("typing");
        await g.sleep(300);
        empty.classList.add("thinking");
        emptyText.textContent = "Thinking…";
        await g.sleep(1100);
        empty.classList.add("hide");
        steps[0].classList.add("show");
        await g.sleep(350);
        steps[1].classList.add("show");
        for (const r of rows) { await g.sleep(160); r.classList.add("show"); }
        await g.sleep(1400);
        cursor.classList.add("show");
        await g.sleep(60);
        moveCursor(cursor, root, target);
        await g.sleep(700);
        targetRow.classList.add("hover");
        await g.sleep(400);
        click(cursor);
        target.classList.add("press");
        await g.sleep(140);
        target.classList.remove("press");
        target.classList.add("done");
        toast.classList.add("show");
        await g.sleep(1800);
        toast.classList.remove("show");
        target.classList.remove("done");
        await g.sleep(700);
        parkCursor(cursor, root);
        targetRow.classList.remove("hover");
        cursor.classList.remove("show");
        await g.sleep(900);
        steps.forEach((s) => s.classList.remove("show"));
        await g.sleep(600);
      }
    })();
  }

  /* ---------------------------------------------------------------
   * 3. Menu bar popover
   * ------------------------------------------------------------- */
  function menubarDemo() {
    const root = $("#demo-menubar");
    if (!root) return;
    const icon = $("[data-mb-icon]", root);
    const pop = $("[data-mb-pop]", root);
    const text = $("[data-mb-text]", root);
    const sugs = $$("[data-mb-sug]", root);
    const empty = $("[data-mb-empty]", root);
    const cursor = $("[data-cursor]", root);
    const g = gate(root);
    const raw = "lets grab lunch tmrw at 1? my treat";

    if (reduced) {
      icon.classList.add("active");
      pop.classList.add("open");
      text.textContent = raw;
      sugs.forEach((s) => s.classList.add("show"));
      empty.classList.add("hide");
      return;
    }

    (async () => {
      await g.waitVisible();
      for (;;) {
        text.textContent = "";
        sugs.forEach((s) => s.classList.remove("show"));
        empty.classList.remove("hide");
        parkCursor(cursor, root, 0.45, 0.8);
        cursor.classList.add("show");
        await g.sleep(700);
        moveCursor(cursor, root, icon, 2, 2);
        await g.sleep(1000);
        click(cursor);
        icon.classList.add("active");
        pop.classList.add("open");
        await g.sleep(300);
        parkCursor(cursor, root, 0.3, 0.85);
        await g.sleep(500);
        root.classList.add("typing");
        for (const ch of raw) {
          text.textContent += ch;
          await g.sleep(ch === " " ? rand(60, 110) : rand(30, 70));
        }
        root.classList.remove("typing");
        await g.sleep(600);
        empty.classList.add("hide");
        for (const s of sugs) { s.classList.add("show"); await g.sleep(180); }
        await g.sleep(3200);
        moveCursor(cursor, root, icon, 2, 2);
        await g.sleep(1000);
        click(cursor);
        pop.classList.remove("open");
        icon.classList.remove("active");
        await g.sleep(900);
      }
    })();
  }

  /* ---------------------------------------------------------------
   * 4. Provider toggle
   * ------------------------------------------------------------- */
  function providerDemo() {
    const root = $("#demo-provider");
    if (!root) return;
    const btns = $$(".seg-btn", root);
    const caption = $("[data-prov-caption]", root);
    const captions = {
      local: "Everything runs on your Mac. 0 bytes leave your machine.",
      cloud: "Your text (and context, if enabled) goes to OpenAI or Claude, using your own key.",
    };
    let userChose = false;
    const set = (mode) => {
      root.dataset.mode = mode;
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
      caption.textContent = captions[mode];
    };
    btns.forEach((b) => b.addEventListener("click", () => { userChose = true; set(b.dataset.mode); }));
    set("local");
    if (reduced) return;
    const g = gate(root);
    (async () => {
      await g.waitVisible();
      for (;;) {
        await g.sleep(4200);
        if (userChose) return;
        set(root.dataset.mode === "local" ? "cloud" : "local");
      }
    })();
  }

  /* ---------------------------------------------------------------
   * 5. Shortcut keycaps
   * ------------------------------------------------------------- */
  function keysDemo() {
    const root = $("#demo-keys");
    if (!root || reduced) return;
    const groups = $$(".keycard", root).map((card) => $$(".cap", card));
    const g = gate(root);
    (async () => {
      await g.waitVisible();
      for (let i = 0; ; i = (i + 1) % groups.length) {
        const caps = groups[i];
        for (const c of caps) { c.classList.add("pressed"); await g.sleep(90); }
        await g.sleep(420);
        caps.forEach((c) => c.classList.remove("pressed"));
        await g.sleep(700);
      }
    })();
  }

  /* ---------------------------------------------------------------
   * 6. Round-trip comparison: chips appear one by one with timers
   * ------------------------------------------------------------- */
  function compareDemo() {
    const root = $("#demo-compare");
    if (!root) return;
    const rows = $$(".cmp-row", root).map((row) => ({
      row,
      chips: $$(".cmp-chips li", row),
      timer: $("[data-timer]", row),
      end: Number(row.dataset.end) || 0,
    }));
    const finish = () => rows.forEach((r) => {
      r.chips.forEach((c) => c.classList.add("show"));
      r.timer.textContent = "~" + r.end;
      r.row.classList.add("done");
    });
    if (reduced) { finish(); return; }
    const g = gate(root);
    const STEP = 480; // ms between chips, same pace for both rows

    async function playRow(r) {
      const total = r.chips.length * STEP;
      const start = performance.now();
      let raf = 0;
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / total);
        r.timer.textContent = String(Math.round(t * r.end));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      for (const c of r.chips) { c.classList.add("show"); await g.sleep(STEP); }
      cancelAnimationFrame(raf);
      r.timer.textContent = "~" + r.end;
      r.row.classList.add("done");
    }

    (async () => {
      await g.waitVisible();
      for (;;) {
        rows.forEach((r) => {
          r.chips.forEach((c) => c.classList.remove("show"));
          r.timer.textContent = "0";
          r.row.classList.remove("done");
        });
        await g.sleep(500);
        await Promise.all(rows.map(playRow));
        await g.sleep(3800);
      }
    })();
  }

  /* ---------------------------------------------------------------
   * Download metadata (optional downloads/latest.json)
   * ------------------------------------------------------------- */
  function downloadMeta() {
    if (location.protocol === "file:") return;
    fetch("downloads/latest.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j || typeof j !== "object") return;
        const parts = [];
        if (j.version) parts.push(String(j.version).replace(/^v?/, "v"));
        if (j.size) parts.push(typeof j.size === "number" ? (j.size / 1048576).toFixed(1) + " MB" : String(j.size));
        if (parts.length) $$("[data-dl-meta]").forEach((el) => (el.textContent = parts.join(" · ")));
        if (j.url && typeof j.url === "string" && !/^\s*javascript:/i.test(j.url)) {
          $$("[data-dl]").forEach((a) => a.setAttribute("href", j.url));
        }
      })
      .catch(() => {});
  }

  /* ---------------------------------------------------------------
   * After a download starts: show how to get past Gatekeeper
   * ------------------------------------------------------------- */
  function downloadGuide() {
    const dlg = $("#dl-guide");
    if (!dlg || typeof dlg.showModal !== "function") return;
    $$("[data-dl]").forEach((a) => a.addEventListener("click", () => setTimeout(() => dlg.showModal(), 400)));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  heroDemo();
  rewriteDemo();
  menubarDemo();
  providerDemo();
  keysDemo();
  compareDemo();
  downloadMeta();
  downloadGuide();
})();
