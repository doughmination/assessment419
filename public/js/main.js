/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

// ===== Marker greeting in DevTools console =====
// Examiners almost always open DevTools (Network tab, Elements, etc.) when
// inspecting a submission. This drops a tasteful greeting in the console
// they can't miss. Bigger version on /admin since they're already in the bit.
(function consoleGreeting() {
    const isAdmin = window.location.pathname === '/admin';
    const log = (text, css) => console.log('%c' + text, css);

    // Sitewide greeting — every page.
    log(
        '  Hi there 👋  ',
        'font-size: 30px; font-weight: 700; color: #fff;' +
        'background: linear-gradient(135deg, #ff6eb4, #c084fc);' +
        'padding: 12px 24px; border-radius: 12px;' +
        'text-shadow: 0 1px 2px rgba(0,0,0,0.35);'
    );
    log(
        'If you\'re marking this assessment — hello, hope you\'re having a good day.',
        'font-size: 13px; color: #c084fc; padding: 4px 0;'
    );
    log(
        'The site is built on Express + EJS + SQLite. Source is well-commented.',
        'font-size: 12px; color: rgba(255,255,255,0.55); padding: 2px 0;'
    );
    log(
        '— Clove',
        'font-size: 12px; color: #ff6eb4; font-style: italic; padding: 2px 0;'
    );

    if (isAdmin) {
        log(
            '🎵  And yes. You\'ve been rickrolled.  🎵',
            'font-size: 18px; font-weight: 700; color: #fff;' +
            'background: linear-gradient(135deg, #ff5722, #ff9800, #ffca28);' +
            'padding: 10px 18px; border-radius: 8px; margin-top: 6px;'
        );
    }
})();

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

        // Guard: synthetic events (or events on Document/Window) won't have
        // .closest(). Bail out cleanly rather than throwing.
        if (!e.target || typeof e.target.closest !== 'function') return;

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

        // Skip the transition for the Admin nav link — the 180ms setTimeout
        // before navigation can cause some browsers to drop the carried-over
        // user activation, which kills our "play unmuted on arrival" trick.
        // Native synchronous navigation preserves activation cleanly.
        if (link.id === 'adminNavLink') return;

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

// ===== Admin nav "double-tap" — arms the rickroll =====
// When the user clicks the Admin nav link, we:
//   1. Set a sessionStorage flag so the destination page knows to start LOUD.
//   2. Do a tiny visual "double-tap" wiggle on the link for the joke.
// User activation from a same-origin click survives the navigation in modern
// browsers, so the destination page can call .play() with audio unmuted
// without waiting for further interaction.
(function setupAdminDoubleTap() {
    const adminLink = document.getElementById('adminNavLink');
    if (!adminLink) return;

    adminLink.addEventListener('click', () => {
        try { sessionStorage.setItem('rickroll-armed', '1'); } catch { /* private mode */ }
        adminLink.classList.add('admin-double-tap');
        // The class is removed after the animation finishes (or after navigation,
        // whichever wins). It's harmless if the page navigates away first.
        setTimeout(() => adminLink.classList.remove('admin-double-tap'), 360);
    });
})();

// ===== Admin rickroll: try unmuted first, fall back to interaction unmute =====
// If the user clicked the Admin nav link, the same-origin click's user
// activation propagates here, so we try to .play() with audio on immediately.
// If that fails (cold page load, deep link, refresh), we fall back to the
// "unmute on first interaction" behavior so the rickroll always lands eventually.
(function setupRickrollAutoplay() {
    const video = document.getElementById('adminRickrollVideo');
    if (!video) return;

    // ⚠️ TWEAK ME — single source of truth for rickroll volume.
    // 0.0 = silent, 1.0 = full source volume. Note: this is LINEAR amplitude,
    // so 0.5 ≈ -6 dB (still pretty loud). Try 0.10–0.25 for a tame level.
    const RICKROLL_VOLUME = 0.15;

    // Set it on the element up front so even the muted phase carries the value.
    video.volume = RICKROLL_VOLUME;

    let armed = false;
    try { armed = sessionStorage.getItem('rickroll-armed') === '1'; } catch { /* ignore */ }
    // Consume the flag so a hard refresh on /admin doesn't re-trigger.
    try { sessionStorage.removeItem('rickroll-armed'); } catch { /* ignore */ }

    let trapShown = false;
    const playMuted = () => {
        video.muted = true;
        video.volume = RICKROLL_VOLUME;
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => { /* ignore */ });
    };
    // Quietly set up the trap whenever we end up muted.
    const ensureTrap = () => {
        if (trapShown) return;
        trapShown = true;
        showClickTrap();
    };

    if (armed) {
        // Optimistic: try with sound right away using the carried-over activation.
        video.muted = false;
        video.volume = RICKROLL_VOLUME;
        const p = video.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                // Success — audio is playing, no trap needed.
            }).catch(() => {
                // Browser blocked it — fall back to muted autoplay + trap + interaction unmute.
                playMuted();
                attachUnmuteOnInteraction();
                ensureTrap();
            });
        }
    } else {
        playMuted();
        attachUnmuteOnInteraction();
        ensureTrap();
    }

    function showClickTrap() {
        // Invisible full-page overlay. The first real pointerdown anywhere
        // unmutes the video and the overlay self-destructs. Counts as user
        // activation because event.isTrusted === true.
        const overlay = document.createElement('div');
        overlay.className = 'admin-click-trap';
        overlay.setAttribute('aria-hidden', 'true');

        // After a moment with no interaction, fade in a tasteful hint so
        // direct visitors don't get stuck wondering what's wrong.
        const hintTimer = setTimeout(() => {
            overlay.classList.add('admin-click-trap--show-hint');
        }, 1800);

        const trigger = () => {
            clearTimeout(hintTimer);
            video.muted = false;
            video.volume = RICKROLL_VOLUME;
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => { /* ignore */ });
            overlay.remove();
        };

        // Listen for the first real activation event anywhere on the overlay.
        // Pointer/touch/key all qualify; mousemove is intentionally NOT here.
        ['pointerdown', 'touchstart', 'keydown'].forEach(ev => {
            overlay.addEventListener(ev, trigger, { once: true, passive: true });
        });
        // Some events bubble from the document (keydown, scroll/wheel) but
        // the overlay sits on top, so add window-level listeners too as a
        // safety net for keyboard activations.
        const winTrigger = () => {
            if (overlay.parentNode) trigger();
        };
        ['keydown', 'wheel', 'scroll'].forEach(ev => {
            window.addEventListener(ev, winTrigger, { once: true, passive: true, capture: true });
        });

        document.body.appendChild(overlay);
    }

    function attachUnmuteOnInteraction() {
        // Only listeners get removed once we CONFIRM audio is playing —
        // failed play attempts don't consume the listeners.
        let detached = false;
        // Includes mousemove/pointermove/mouseover — those don't grant user
        // activation on their own, but if the user has already produced any
        // qualifying gesture in the session, the next motion event will fire
        // .play() with sound and the browser will allow it through.
        const events = [
            'pointerdown', 'click', 'keydown', 'scroll', 'touchstart', 'wheel',
            'mousemove', 'pointermove', 'mouseover'
        ];
        const detach = () => {
            if (detached) return;
            detached = true;
            events.forEach(ev => window.removeEventListener(ev, tryUnmute, true));
        };
        const tryUnmute = () => {
            if (detached) return;
            video.muted = false;
            video.volume = RICKROLL_VOLUME;
            const p = video.play();
            if (p && typeof p.then === 'function') {
                p.then(() => {
                    // Confirmed playing with audio: we're done, stop listening.
                    if (!video.muted) detach();
                }).catch(() => {
                    // Browser blocked it (no activation yet) — re-mute and
                    // keep the listeners attached for the next event.
                    video.muted = true;
                    video.play().catch(() => {});
                });
            } else {
                // Old browser, no promise returned — assume it worked.
                detach();
            }
        };
        events.forEach(ev => window.addEventListener(ev, tryUnmute, { capture: true, passive: true }));
    }
})();

// ===== Admin DVD-screensaver bouncer =====
// Bounces a DVD logo around the viewport on the admin page. On every wall
// hit we swap to a different colour variant. When it lands on an exact
// corner (both axes hit the same frame), a celebration glow fires.
(function setupDvdBouncer() {
    // Admin-only: gate on the rickroll video element.
    if (!document.getElementById('adminRickrollVideo')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const variants = [
        '/images/dvd/dvdlogo-01.svg',
        '/images/dvd/dvdlogo-02.svg',
        '/images/dvd/dvdlogo-03.svg',
        '/images/dvd/dvdlogo-04.svg',
        '/images/dvd/dvdlogo-05.svg',
        '/images/dvd/dvdlogo-06.svg',
        '/images/dvd/dvdlogo-07.svg',
    ];

    const dvd = document.createElement('img');
    dvd.className = 'dvd-bouncer';
    dvd.alt = '';
    dvd.setAttribute('aria-hidden', 'true');
    let currentVariant = Math.floor(Math.random() * variants.length);
    dvd.src = variants[currentVariant];
    document.body.appendChild(dvd);

    // Random starting position somewhere in the inner viewport.
    let x = 60 + Math.random() * Math.max(0, window.innerWidth - 260);
    let y = 60 + Math.random() * Math.max(0, window.innerHeight - 160);
    // Velocity in px per ~16ms frame. Sign randomized.
    let dx = (Math.random() < 0.5 ? 1 : -1) * (1.6 + Math.random() * 0.8);
    let dy = (Math.random() < 0.5 ? 1 : -1) * (1.6 + Math.random() * 0.8);

    const swapVariant = () => {
        if (variants.length < 2) return;
        let next = currentVariant;
        while (next === currentVariant) {
            next = Math.floor(Math.random() * variants.length);
        }
        currentVariant = next;
        dvd.src = variants[next];
    };

    const triggerCornerCelebration = () => {
        dvd.classList.remove('dvd-bouncer--sparkle');
        // Force reflow so the animation restarts even if it fires twice in a row.
        void dvd.offsetWidth;
        dvd.classList.add('dvd-bouncer--sparkle');
    };

    let lastFrame = performance.now();

    function tick(now) {
        // Clamp dt so tab-backgrounding doesn't teleport the logo across the screen.
        const dt = Math.min(50, now - lastFrame);
        lastFrame = now;
        const factor = dt / 16;

        x += dx * factor;
        y += dy * factor;

        const w = dvd.offsetWidth || 140;
        const h = dvd.offsetHeight || 62;
        const maxX = Math.max(0, window.innerWidth - w);
        const maxY = Math.max(0, window.innerHeight - h);

        let hitH = false, hitV = false;
        if (x <= 0) { x = 0; dx = Math.abs(dx); hitH = true; }
        else if (x >= maxX) { x = maxX; dx = -Math.abs(dx); hitH = true; }
        if (y <= 0) { y = 0; dy = Math.abs(dy); hitV = true; }
        else if (y >= maxY) { y = maxY; dy = -Math.abs(dy); hitV = true; }

        if (hitH || hitV) swapVariant();
        if (hitH && hitV) triggerCornerCelebration();

        dvd.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Keep it on-screen if the viewport shrinks.
    window.addEventListener('resize', () => {
        const w = dvd.offsetWidth || 140;
        const h = dvd.offsetHeight || 62;
        x = Math.min(Math.max(0, x), Math.max(0, window.innerWidth - w));
        y = Math.min(Math.max(0, y), Math.max(0, window.innerHeight - h));
    }, { passive: true });
})();

// ===== Admin: cumulative "time rickrolled" timer =====
// Tracks how many real-time seconds the user has spent on /admin across
// every visit. Pauses when the tab is hidden (so backgrounding the tab
// doesn't inflate the count). Stored in localStorage as integer seconds.
(function setupAdminTimer() {
    const display = document.getElementById('adminTimerValue');
    if (!display) return;

    const STORAGE_KEY = 'clovefunny-timer-lmfao';

    let totalSeconds = 0;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const n = parseInt(stored, 10);
            if (Number.isFinite(n) && n >= 0) totalSeconds = n;
        }
    } catch { /* private mode / disabled storage — silent */ }

    const format = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h) return `${h}h ${m}m ${sec}s`;
        if (m) return `${m}m ${sec}s`;
        return `${sec}s`;
    };

    const render = () => { display.textContent = format(totalSeconds); };
    render();

    let lastTick = performance.now();
    let isVisible = !document.hidden;

    // Tick every second. We don't trust the interval to fire exactly every
    // 1000ms (throttled tabs etc.), so we measure the delta and add whole
    // seconds based on the real elapsed time.
    setInterval(() => {
        if (!isVisible) return;
        const now = performance.now();
        const delta = now - lastTick;
        if (delta < 1000) return;
        const whole = Math.floor(delta / 1000);
        totalSeconds += whole;
        lastTick += whole * 1000;
        render();
    }, 1000);

    // Pause counting when tab is hidden — and reset the lastTick reference
    // when it returns so the user doesn't get charged for the away time.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isVisible = false;
            persist();
        } else {
            isVisible = true;
            lastTick = performance.now();
        }
    });

    // Persist periodically and on tab close / pagehide.
    const persist = () => {
        try { localStorage.setItem(STORAGE_KEY, String(totalSeconds)); } catch { /* ignore */ }
    };
    setInterval(persist, 5000);
    window.addEventListener('beforeunload', persist);
    window.addEventListener('pagehide', persist);
})();

// ===== Cursor bubble trail =====
// Spawns soft bubble elements that follow the mouse and float upward.
// Skipped on touch devices and when the user prefers reduced motion.
(function setupBubbleTrail() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover = window.matchMedia('(hover: none)').matches;
    if (reduceMotion || noHover) return;

    let lastSpawn = 0;
    const SPAWN_INTERVAL = 38; // ms — throttle so we don't flood the DOM
    const MAX_LIVE = 60;       // hard cap on simultaneously visible bubbles
    let liveCount = 0;

    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastSpawn < SPAWN_INTERVAL) return;
        if (liveCount >= MAX_LIVE) return;
        lastSpawn = now;

        const bubble = document.createElement('div');
        bubble.className = 'cursor-bubble';
        const size = 8 + Math.random() * 18;             // 8–26px
        const drift = (Math.random() * 60) - 30;         // -30 to +30px sideways
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (e.clientX - size / 2) + 'px';
        bubble.style.top = (e.clientY - size / 2) + 'px';
        bubble.style.setProperty('--drift', drift + 'px');

        document.body.appendChild(bubble);
        liveCount++;
        bubble.addEventListener('animationend', () => {
            bubble.remove();
            liveCount--;
        }, { once: true });
    }, { passive: true });
})();