/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });
}

// ===== Page transition: fade out before same-origin navigation =====
// The enter animation is handled in CSS (body { animation: page-enter }).
// This hook intercepts internal link clicks to play a short exit before navigating.
(function setupPageTransitions() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    document.addEventListener('click', (e) => {
        // Only respond to primary-button clicks with no modifiers
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (e.defaultPrevented) return;

        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;
        if (link.target && link.target !== '_self') return;      // new tab / frame
        if (link.hasAttribute('download')) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        let url;
        try { url = new URL(href, window.location.origin); } catch { return; }
        if (url.origin !== window.location.origin) return;        // external link
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;

        e.preventDefault();
        document.body.classList.add('page-leaving');
        setTimeout(() => { window.location.href = url.href; }, 180);
    });

    // If the user navigates back, browsers may restore the page from bfcache with
    // the leaving class still applied — clear it on pageshow so it doesn't stick.
    window.addEventListener('pageshow', () => {
        document.body.classList.remove('page-leaving');
    });
})();

// Escape HTML to prevent XSS when inserting DB content into the DOM
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
                                <div class="type-badge">${escapeHTML(item.type)}</div>
                                <h4>${escapeHTML(item.name)}</h4>
                                <p>${escapeHTML(item.description.substring(0, 80))}...</p>
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

// Newsletter signup (footer)
const newsletterForm = document.getElementById('newsletterForm');
const newsletterStatus = document.getElementById('newsletterStatus');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletterEmail');
        const email = emailInput.value.trim();

        newsletterStatus.classList.remove('error', 'success');

        if (!EMAIL_RE.test(email)) {
            newsletterStatus.textContent = 'Please enter a valid email address.';
            newsletterStatus.classList.add('error');
            return;
        }

        try {
            const res = await fetch('/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.ok) {
                newsletterStatus.textContent = data.message || 'Thanks for subscribing!';
                newsletterStatus.classList.add('success');
                emailInput.value = '';
            } else {
                newsletterStatus.textContent = data.error || 'Something went wrong. Please try again.';
                newsletterStatus.classList.add('error');
            }
        } catch {
            newsletterStatus.textContent = 'Could not reach the server. Please try again.';
            newsletterStatus.classList.add('error');
        }
    });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
}