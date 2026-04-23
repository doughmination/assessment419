import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db/db.mjs';

import indexRouter from './routes/index.mjs';
import habitatsRouter from './routes/habitats.mjs';
import contactRouter from './routes/contact.mjs';
import faqRouter from './routes/faq.mjs';
import eventsRouter from './routes/events.mjs';
import activityRouter from './routes/activity.mjs';
import searchRouter from './routes/search.mjs';

import { check } from './disclaim.js';

check();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/habitats', habitatsRouter);
app.use('/contact', contactRouter);
app.use('/faq', faqRouter);
app.use('/events', eventsRouter);
app.use('/activity', activityRouter);
app.use('/api/search', searchRouter);

const server = app.listen(PORT, () => {
    console.log(`App started! 🚀`);
});

process.stdin.resume();

process.on('SIGINT', () => {
    server.close();
    db.close();
    process.exit(0);
});