const cards = document.querySelectorAll('.exhibit-card');
const modal = document.getElementById('exhibitModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalIcon = document.getElementById('modalIcon');
const modalClose = document.getElementById('modalClose');
const icons = ['🐾', '🌿', '👀', '✨', '🦋', '🔭'];

cards.forEach((card, i) => {
    card.addEventListener('click', () => {
        modalTitle.textContent = card.dataset.name;
        modalDesc.textContent = card.dataset.desc;
        modalIcon.textContent = icons[i % icons.length];
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
}