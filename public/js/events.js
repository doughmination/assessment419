const yearSelect = document.getElementById('yearSelect');
const categorySelect = document.getElementById('categorySelect');
const eventsGrid = document.getElementById('eventsGrid');
const eventCount = document.getElementById('eventCount');

const categoryColours = {
    'Wildlife Festival':      'badge-pink',
    'Conservation Workshop':  'badge-mint',
    'Night Safari':           'badge-purple',
    'Guest Speaker':          'badge-yellow',
    'Family Activity Day':    'badge-coral',
};

// Format date nicely
function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Render events into the grid
function renderEvents(events) {
    if (events.length === 0) {
        eventsGrid.innerHTML = `<div class="no-events">😢 No events found for these filters!</div>`;
        eventCount.textContent = '0 events';
        return;
    }

    eventCount.textContent = `${events.length} event${events.length !== 1 ? 's' : ''}`;

    eventsGrid.innerHTML = events.map(event => {
        const colourClass = categoryColours[event.category] || 'badge-pink';
        const pastClass = event.isPast ? 'is-past' : '';
        return `
            <a href="/events/${event.id}" class="event-card ${pastClass}">
                <div class="event-card-top">
                    <span class="badge ${colourClass}">${event.category}</span>
                    ${event.isPast ? '<span class="badge badge-past">Past</span>' : '<span class="badge badge-mint">Upcoming</span>'}
                </div>
                <h3>${event.title}</h3>
                <p>${event.description.substring(0, 100)}...</p>
                <div class="event-date">📅 ${formatDate(event.date)}</div>
            </a>
        `;
    }).join('');
}

// Fetch and render events based on current filter selections
function loadEvents() {
    const year = yearSelect.value;
    const category = categorySelect.value;

    eventsGrid.innerHTML = `<div class="events-loading">🍬 Loading events...</div>`;

    fetch(`/events/api/filter?year=${encodeURIComponent(year)}&category=${encodeURIComponent(category)}`)
        .then(res => res.json())
        .then(data => renderEvents(data))
        .catch(() => {
            eventsGrid.innerHTML = `<div class="no-events">❌ Failed to load events. Please try again.</div>`;
        });
}

// Load years into dropdown
fetch('/events/api/years')
    .then(res => res.json())
    .then(years => {
        const currentYear = new Date().getFullYear().toString();
        yearSelect.innerHTML = years.map(year => `
            <option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>
        `).join('');
        loadEvents();
    });

// Load categories into dropdown
fetch('/events/api/categories')
    .then(res => res.json())
    .then(categories => {
        categorySelect.innerHTML = `<option value="all">All Categories</option>` +
            categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
    });

// Listen for filter changes
yearSelect.addEventListener('change', loadEvents);
categorySelect.addEventListener('change', loadEvents);