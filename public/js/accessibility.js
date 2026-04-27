/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

// =====================================================================
// Accessibility menu — theme / colourblind palette / dyslexia font
// ---------------------------------------------------------------------
// The initial values for data-theme / data-cb / data-font are written
// to <html> by the synchronous boot script in views/partials/header.ejs
// before the page paints (avoids a flash of dark content for light-mode
// users). This script handles the runtime UI: opening the panel, syncing
// the controls to the stored state, persisting changes to localStorage,
// and live-updating when the OS-level colour-scheme preference changes.
// =====================================================================

(function setupAccessibilityMenu() {
  const STORAGE = {
    theme: "a11y-theme", // "auto" | "light" | "dark"
    cb: "a11y-cb", // "none" | "protanopia" | "deuteranopia" | "tritanopia" | "monochrome"
    font: "a11y-font", // "comic" | "dyslexic" | "mono"
    cursor: "a11y-cursor", // "on" | "off"
  };
  const DEFAULTS = { theme: "auto", cb: "none", font: "comic", cursor: "on" };

  const html = document.documentElement;
  const toggle = document.getElementById("a11yToggle");
  const panel = document.getElementById("a11yPanel");
  const closeBtn = document.getElementById("a11yClose");
  const resetBtn = document.getElementById("a11yReset");
  const cursorToggle = document.getElementById("a11yCursorToggle");

  // Bail out cleanly if the partials haven't rendered the panel for some
  // reason (e.g. a bespoke page that includes only the header).
  if (!toggle || !panel) return;

  // ----- storage helpers ------------------------------------------------
  const safeGet = (key, fallback) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };
  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode / disabled storage — silent */
    }
  };
  const safeRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  };

  // ----- apply / read state --------------------------------------------
  const state = {
    theme: safeGet(STORAGE.theme, DEFAULTS.theme),
    cb: safeGet(STORAGE.cb, DEFAULTS.cb),
    font: safeGet(STORAGE.font, DEFAULTS.font),
    cursor: safeGet(STORAGE.cursor, DEFAULTS.cursor),
  };

  const resolveTheme = (mode) => {
    if (mode === "auto") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    }
    return mode;
  };

  const apply = () => {
    html.setAttribute("data-theme", resolveTheme(state.theme));
    html.setAttribute("data-theme-mode", state.theme);
    html.setAttribute("data-cb", state.cb);
    html.setAttribute("data-font", state.font);
    html.setAttribute("data-cursor", state.cursor);
  };

  // ----- sync controls --------------------------------------------------
  const syncControls = () => {
    panel
      .querySelectorAll('input[name="a11y-theme"]')
      .forEach((r) => (r.checked = r.value === state.theme));
    panel
      .querySelectorAll('input[name="a11y-cb"]')
      .forEach((r) => (r.checked = r.value === state.cb));
    panel
      .querySelectorAll('input[name="a11y-font"]')
      .forEach((r) => (r.checked = r.value === state.font));
    if (cursorToggle) cursorToggle.checked = state.cursor === "on";
  };

  // ----- panel open/close ----------------------------------------------
  const openPanel = () => {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    // First focusable element inside the panel
    const firstInput = panel.querySelector("input, button");
    if (firstInput) firstInput.focus({ preventScroll: true });
  };
  const closePanel = ({ returnFocus } = { returnFocus: true }) => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  if (closeBtn) closeBtn.addEventListener("click", () => closePanel());

  // Click-outside-to-close. Bound on document, but bails when the panel
  // is hidden so we're not running this work on every page click.
  document.addEventListener("click", (e) => {
    if (panel.hidden) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    closePanel({ returnFocus: false });
  });

  // Esc closes the panel.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      e.stopPropagation();
      closePanel();
    }
  });

  // ----- change handlers -----------------------------------------------
  panel.addEventListener("change", (e) => {
    const target = e.target;
    if (!target || !target.name) {
      // Switch checkboxes don't have a name attribute — dispatch by id.
      if (target && target.id === "a11yCursorToggle") {
        state.cursor = target.checked ? "on" : "off";
        safeSet(STORAGE.cursor, state.cursor);
        apply();
      }
      return;
    }
    if (target.name === "a11y-theme") {
      state.theme = target.value;
      safeSet(STORAGE.theme, state.theme);
      apply();
    } else if (target.name === "a11y-cb") {
      state.cb = target.value;
      safeSet(STORAGE.cb, state.cb);
      apply();
    } else if (target.name === "a11y-font") {
      state.font = target.value;
      safeSet(STORAGE.font, state.font);
      apply();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.theme = DEFAULTS.theme;
      state.cb = DEFAULTS.cb;
      state.font = DEFAULTS.font;
      state.cursor = DEFAULTS.cursor;
      safeRemove(STORAGE.theme);
      safeRemove(STORAGE.cb);
      safeRemove(STORAGE.font);
      safeRemove(STORAGE.cursor);
      apply();
      syncControls();
    });
  }

  // ----- live-track OS colour scheme while in auto mode -----------------
  // If the user has "auto" selected and changes their system theme (e.g.
  // sunset on macOS, dark-mode toggle on iOS/Android), re-resolve and
  // repaint without requiring a refresh.
  if (window.matchMedia) {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (state.theme === "auto") apply();
    };
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else if (mql.addListener) mql.addListener(onChange); // older Safari
  }

  // Initial paint — boot script set attributes from storage already, but
  // call apply() once more to cover the (rare) case where the user swapped
  // OS theme between boot script and this script running.
  apply();
  syncControls();
})();
