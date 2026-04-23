import express from 'express';
import db from '../db/db.mjs';

const router = express.Router();

// !! API routes MUST come before /:id !!

// AJAX - get available years
router.get('/api/years', (req, res) => {
    db.all(
        `SELECT DISTINCT strftime('%Y', date) as year FROM events ORDER BY year DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows.map(r => r.year));
        }
    );
});

// AJAX - get all categories
router.get('/api/categories', (req, res) => {
    db.all(`SELECT * FROM event_categories ORDER BY name`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// AJAX - filter events by year and category
router.get('/api/filter', (req, res) => {
    const { year, category } = req.query;
    let query = `SELECT events.*, event_categories.name as category 
                 FROM events 
                 JOIN event_categories ON events.category_id = event_categories.id
                 WHERE strftime('%Y', events.date) = ?`;
    const params = [year || new Date().getFullYear().toString()];

    if (category && category !== 'all') {
        query += ` AND event_categories.name = ?`;
        params.push(category);
    }

    query += ` ORDER BY events.date ASC`;

    db.all(query, params, (err, events) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        const today = new Date().toISOString().split('T')[0];
        const result = events.map(e => ({ ...e, isPast: e.date < today }));
        res.json(result);
    });
});

// Main events page
router.get('/', (req, res) => {
    res.render('events');
});

// Individual event page - MUST be last
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get(
        `SELECT events.*, event_categories.name as category 
         FROM events 
         JOIN event_categories ON events.category_id = event_categories.id
         WHERE events.id = ?`,
        [id],
        (err, event) => {
            if (err || !event) return res.status(404).send('Event not found');
            const today = new Date().toISOString().split('T')[0];
            event.isPast = event.date < today;
            res.render('event-detail', { event });
        }
    );
});

export default router;