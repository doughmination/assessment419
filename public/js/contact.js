/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {
  let valid = true;

  const fields = {
    name: {
      el: document.getElementById("name"),
      err: document.getElementById("nameError"),
      check: (v) => v.trim().length >= 2,
    },
    email: {
      el: document.getElementById("email"),
      err: document.getElementById("emailError"),
      check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    },
    message: {
      el: document.getElementById("message"),
      err: document.getElementById("messageError"),
      check: (v) => v.trim().length >= 10,
    },
  };

  // Reset all
  Object.values(fields).forEach(({ el, err }) => {
    err.classList.remove("show");
    el.style.borderColor = "";
  });

  // Validate each
  Object.values(fields).forEach(({ el, err, check }) => {
    if (!check(el.value)) {
      err.classList.add("show");
      el.style.borderColor = "#dc2626";
      valid = false;
    }
  });

  if (!valid) e.preventDefault();
});

// Live character counter for the message field
const messageField = document.getElementById("message");
const counter = document.getElementById("messageCount");
const MIN_CHARS = 10;
const MAX_CHARS = 1000;

if (messageField && counter) {
  const update = () => {
    const len = messageField.value.length;
    counter.textContent = `${len} / ${MAX_CHARS}`;
    counter.classList.remove("under", "over", "ok");
    if (len === 0) {
      counter.classList.remove("under", "over", "ok");
    } else if (len < MIN_CHARS) {
      counter.classList.add("under");
    } else if (len > MAX_CHARS) {
      counter.classList.add("over");
    } else {
      counter.classList.add("ok");
    }
  };
  messageField.addEventListener("input", update);
  update();
}

// Auto-hide success banner and clean URL after 5 seconds
const banner = document.querySelector(".success-banner");
if (banner) {
  setTimeout(() => {
    banner.style.transition = "opacity 0.5s ease";
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 500);
    window.history.replaceState({}, document.title, "/contact");
  }, 5000);
}
