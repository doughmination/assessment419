import express from 'express';
import db from '../db/db.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    db.all(`SELECT * FROM habitats`, [], (err, habitats) => {
        if (err) return res.status(500).send('Database error');
        res.render('index', { habitats });
    });
});

export default router;