import express from 'express';
import db from '../db/db.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('contact', { success: req.query.success === 'true' });
});

router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;
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