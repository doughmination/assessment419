function toggleFaq(index) {
    const item = document.getElementById(`faq-${index}`);
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

    // Open clicked one if it wasn't already open
    if (!isOpen) item.classList.add('open');
}

document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});