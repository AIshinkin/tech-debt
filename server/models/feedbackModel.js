import { db } from "./database.js";

export function saveFeedback({ name = "", email = "", message = "" }) {
  db.prepare(
    `
    INSERT INTO feedback (name, email, message, created_at)
    VALUES (?, ?, ?, ?)
  `,
  ).run(name, email, message, new Date().toISOString());
}

export function getFeedback() {
  return db.prepare("SELECT * FROM feedback ORDER BY id DESC").all();
}
