/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

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