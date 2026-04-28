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
import path from "path";
import { fileURLToPath } from "url";
import db from "./db/db.mjs";

import indexRouter from "./routes/index.mjs";
import habitatsRouter from "./routes/habitats.mjs";
import contactRouter from "./routes/contact.mjs";
import faqRouter from "./routes/faq.mjs";
import eventsRouter from "./routes/events.mjs";
import activityRouter from "./routes/activity.mjs";
import searchRouter from "./routes/search.mjs";
import conservationRouter from "./routes/conservation.mjs";
import newsletterRouter from "./routes/newsletter.mjs";
import adminRouter from "./routes/admin.mjs";

import { check } from "./disclaim.js";
import seedDatabase from "./db/seed.mjs";

check();

function isDatabaseEmpty() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM habitats", (err, row) => {
      if (err) return reject(err);
      resolve(row.count === 0);
    });
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/habitats", habitatsRouter);
app.use("/contact", contactRouter);
app.use("/faq", faqRouter);
app.use("/events", eventsRouter);
app.use("/activity", activityRouter);
app.use("/conservation", conservationRouter);
app.use("/newsletter", newsletterRouter);
app.use("/api/search", searchRouter);
app.use("/admin", adminRouter);

// 404 handler — must be last route
app.use((req, res) => {
  res.status(404).render("404", { url: req.originalUrl });
});

async function init() {
  try {
    const empty = await isDatabaseEmpty();

    if (empty) {
      console.log("Database empty — seeding...\n");
      await seedDatabase();
    } else {
      console.log("Database already seeded.\n");
    }

    const server = app.listen(PORT, () => {
      console.log(`App started! 🚀\n`);

      if (process.env.NODE_ENV === "test") {
        db.close();
        server.close(() => {
          console.log("Test run complete, server closed");
          process.exit(0);
        });
      } else {
        console.log(`Server is running on http://localhost:${PORT}\n`);
      }
    });

    process.stdin.resume();

    process.on("SIGINT", () => {
      server.close();
      db.close();
      process.exit(0);
    });
  } catch (err) {
    console.error("Startup error:", err, "\n");
    process.exit(1);
  }
}

init();
