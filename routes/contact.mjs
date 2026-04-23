import express from 'express';
import db from '../db/db.mjs';

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/', (req, res) => {
    res.render('contact', { success: req.query.success === 'true' });
});

router.post('/', (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();
    const subject = (req.body.subject || '').trim();
    const message = (req.body.message || '').trim();

    // Server-side validation — client-side is the nice UX, this is the safety net
    if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
        return res.status(400).send('Invalid submission');
    }

    db.run(
        `INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)`,
        [name, email, subject, message],
        (err) => {
            if (err) return res.status(500).send('Database error');
            res.redirect('/contact?success=true');
        }
    );
});

export default router;
