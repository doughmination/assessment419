/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "database.db");

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to SQLite database");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS habitats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS exhibits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitat_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT,
        FOREIGN KEY (habitat_id) REFERENCES habitats(id)
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS event_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        image TEXT,
        FOREIGN KEY (category_id) REFERENCES event_categories(id)
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS conservation_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        impact TEXT,
        icon TEXT,
        ordering INTEGER DEFAULT 0
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

export default db;
