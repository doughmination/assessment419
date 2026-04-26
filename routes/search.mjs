/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

import express from "express";
import db from "../db/db.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  const q = (req.query.q || "").trim();
  if (q.length < 2) return res.json([]);
  const query = `%${q}%`;

  db.all(
    `SELECT 'habitat' as type, id, name, description, null as habitat_id FROM habitats 
         WHERE name LIKE ? OR description LIKE ?
         UNION
         SELECT 'exhibit' as type, id, name, description, habitat_id FROM exhibits
         WHERE name LIKE ? OR description LIKE ?
         LIMIT 10`,
    [query, query, query, query],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    }
  );
});

export default router;
