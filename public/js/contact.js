const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
    let valid = true;

    const fields = {
        name: {
            el: document.getElementById('name'),
            err: document.getElementById('nameError'),
            check: v => v.trim().length >= 2
        },
        email: {
            el: document.getElementById('email'),
            err: document.getElementById('emailError'),
            check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        },
        message: {
            el: document.getElementById('message'),
            err: document.getElementById('messageError'),
            check: v => v.trim().length >= 10
        },
    };

    // Reset all
    Object.values(fields).forEach(({ el, err }) => {
        err.style.display = 'none';
        el.style.borderColor = '';
    });

    // Validate each
    Object.values(fields).forEach(({ el, err, check }) => {
        if (!check(el.value)) {
            err.style.display = 'block';
            el.style.borderColor = '#dc2626';
            valid = false;
        }
    });

    if (!valid) e.preventDefault();
});

// Auto-hide success banner and clean URL after 5 seconds
const banner = document.querySelector('.success-banner');
if (banner) {
    setTimeout(() => {
        banner.style.transition = 'opacity 0.5s ease';
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 500);
        window.history.replaceState({}, document.title, '/contact');
    }, 5000);
}