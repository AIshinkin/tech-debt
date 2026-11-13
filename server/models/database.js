import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const databasePath =
  process.env.DATABASE_PATH ||
  fileURLToPath(new URL("../data/catalog.sqlite", import.meta.url));

if (databasePath !== ":memory:") {
  mkdirSync(dirname(databasePath), { recursive: true });
}

export const db = new DatabaseSync(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    thumbnail TEXT,
    short_description TEXT,
    description TEXT,
    genre TEXT,
    platform TEXT,
    developer TEXT,
    publisher TEXT,
    release_date TEXT,
    game_url TEXT,
    freetogame_profile_url TEXT,
    screenshots TEXT NOT NULL,
    published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS news_comments (
    id INTEGER PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);
