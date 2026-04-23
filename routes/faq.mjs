import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const faqs = [
        { q: 'What are your opening times?', a: 'We are open every day from 9am to 6pm, including bank holidays.' },
        { q: 'Is there parking available?', a: 'Yes, we have free parking for over 500 vehicles.' },
        { q: 'Are dogs allowed in the park?', a: 'Guide dogs and assistance dogs are welcome. Pet dogs are not permitted inside the park.' },
        { q: 'Is the park accessible for wheelchairs?', a: 'Yes, all key pathways and facilities are fully wheelchair accessible.' },
        { q: 'Can I bring my own food?', a: 'Yes, picnic areas are available throughout the park.' },
        { q: 'How long does a visit typically take?', a: 'Most visitors spend between 4 and 6 hours exploring the park.' },
        { q: 'Are there places to eat inside the park?', a: 'Yes, we have three cafés and a restaurant spread across the park.' },
        { q: 'Is there an age limit for any experiences?', a: 'Some adventure activities have minimum age or height requirements. Please check each experience page for details.' },
    ];
    res.render('faq', { faqs });
});

export default router;