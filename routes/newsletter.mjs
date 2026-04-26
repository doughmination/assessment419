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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  db.run(`INSERT INTO newsletter_subscriptions (email) VALUES (?)`, [email], function (err) {
    if (err) {
      // UNIQUE constraint — already subscribed. Treat as success to avoid leaking info.
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.json({ ok: true, message: "You're already on the list!" });
      }
      return res.status(500).json({ ok: false, error: "Database error" });
    }
    res.json({ ok: true, message: "Thanks for subscribing!" });
  });
});

export default router;
