// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });
}

// AJAX Search
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput && searchResults) {
    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = searchInput.value.trim();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length === 0) {
                        searchResults.style.display = 'none';
                        return;
                    }

                    searchResults.innerHTML = data.map(item => {
                        const url = item.type === 'habitat'
                            ? `/habitats/${item.id}`
                            : `/habitats/${item.habitat_id}`;
                        return `
                            <div class="search-result-item" onclick="window.location.href='${url}'">
                                <div class="type-badge">${item.type}</div>
                                <h4>${item.name}</h4>
                                <p>${item.description.substring(0, 80)}...</p>
                            </div>
                        `;
                    }).join('');

                    searchResults.style.display = 'block';
                })
                .catch(() => { searchResults.style.display = 'none'; });
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}