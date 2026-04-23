import express from 'express';
import db from '../db/db.mjs';

const router = express.Router();

// All habitats
router.get('/', (req, res) => {
    db.all(`SELECT * FROM habitats`, [], (err, habitats) => {
        if (err) return res.status(500).send('Database error');
        res.render('habitats', { habitats });
    });
});

// Individual habitat with its exhibits
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM habitats WHERE id = ?`, [id], (err, habitat) => {
        if (err || !habitat) return res.status(404).send('Habitat not found');
        db.all(`SELECT * FROM exhibits WHERE habitat_id = ?`, [id], (err, exhibits) => {
            if (err) return res.status(500).send('Database error');
            res.render('habitat-detail', { habitat, exhibits });
        });
    });
});

export default router;