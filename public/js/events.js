/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

const yearSelect = document.getElementById("yearSelect");
const categorySelect = document.getElementById("categorySelect");
const eventsGrid = document.getElementById("eventsGrid");
const eventCount = document.getElementById("eventCount");

const categoryColours = {
  "Wildlife Festival": "badge-pink",
  "Conservation Workshop": "badge-mint",
  "Night Safari": "badge-purple",
  "Guest Speaker": "badge-yellow",
  "Family Activity Day": "badge-coral",
};

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function renderEvents(events) {
  if (events.length === 0) {
    eventsGrid.innerHTML = `<div class="no-events">😢 No events found for these filters!</div>`;
    eventCount.textContent = "0 events";
    return;
  }

  eventCount.textContent = `${events.length} event${events.length !== 1 ? "s" : ""}`;

  eventsGrid.innerHTML = events
    .map((event) => {
      const colourClass = categoryColours[event.category] || "badge-pink";
      const pastClass = event.isPast ? "is-past" : "";
      return `
            <a href="/events/${encodeURIComponent(event.id)}" class="event-card ${pastClass}">
                <div class="event-card-top">
                    <span class="badge ${colourClass}">${escapeHTML(event.category)}</span>
                    ${event.isPast ? '<span class="badge badge-past">Past</span>' : '<span class="badge badge-mint">Upcoming</span>'}
                </div>
                <h3>${escapeHTML(event.title)}</h3>
                <p>${escapeHTML(event.description.substring(0, 100))}...</p>
                <div class="event-date">📅 ${formatDate(event.date)}</div>
            </a>
        `;
    })
    .join("");
}

function loadEvents() {
  const year = yearSelect.value;
  const category = categorySelect.value;

  eventsGrid.innerHTML = `<div class="events-loading">🍬 Loading events...</div>`;

  fetch(
    `/events/api/filter?year=${encodeURIComponent(year)}&category=${encodeURIComponent(category)}`
  )
    .then((res) => res.json())
    .then((data) => renderEvents(data))
    .catch(() => {
      eventsGrid.innerHTML = `<div class="no-events">❌ Failed to load events. Please try again.</div>`;
    });
}

// Wait for both dropdowns to be populated before loading events
const currentYear = new Date().getFullYear().toString();

Promise.all([
  fetch("/events/api/years").then((res) => res.json()),
  fetch("/events/api/categories").then((res) => res.json()),
])
  .then(([years, categories]) => {
    yearSelect.innerHTML = years
      .map(
        (year) => `
        <option value="${escapeHTML(year)}" ${year === currentYear ? "selected" : ""}>${escapeHTML(year)}</option>
    `
      )
      .join("");

    categorySelect.innerHTML =
      `<option value="all">All Categories</option>` +
      categories
        .map((cat) => `<option value="${escapeHTML(cat.name)}">${escapeHTML(cat.name)}</option>`)
        .join("");

    loadEvents();
  })
  .catch(() => {
    eventsGrid.innerHTML = `<div class="no-events">❌ Failed to load filters. Please try again.</div>`;
  });

yearSelect.addEventListener("change", loadEvents);
categorySelect.addEventListener("change", loadEvents);
