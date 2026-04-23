document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});
