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
  db.all(`SELECT * FROM habitats`, [], (err, habitats) => {
    if (err) return res.status(500).send("Database error");
    res.render("index", { habitats });
  });
});

export default router;
