import express from 'express';
import db from '../db/db.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    const query = `%${req.query.q || ''}%`;

    db.all(
        `SELECT 'habitat' as type, id, name, description, null as habitat_id FROM habitats 
         WHERE name LIKE ? OR description LIKE ?
         UNION
         SELECT 'exhibit' as type, id, name, description, habitat_id FROM exhibits
         WHERE name LIKE ? OR description LIKE ?
         LIMIT 10`,
        [query, query, query, query],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(results);
        }
    );
});

export default router;