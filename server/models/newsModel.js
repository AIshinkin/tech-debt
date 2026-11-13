import { db } from './database.js'

export function getNewsList() {
  return db.prepare(`
    SELECT id, title,
      CASE
        WHEN summary <> '' THEN summary
        WHEN length(body) > 160 THEN rtrim(substr(body, 1, 160)) || '…'
        ELSE body
      END AS summary,
      cover_url, created_at, updated_at
    FROM news
    ORDER BY id DESC
  `).all()
}

export function getNews(id) {
  return db.prepare('SELECT * FROM news WHERE id = ?').get(id)
}

export function addNews({ title, summary, body, cover_url }) {
  const now = new Date().toISOString()
  return db.prepare(`
    INSERT INTO news (title, summary, body, cover_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING *
  `).get(title, summary, body, cover_url, now, now)
}

export function updateNews(id, { title, summary, body, cover_url }) {
  return db.prepare(`
    UPDATE news
    SET title = ?, summary = ?, body = ?, cover_url = ?, updated_at = ?
    WHERE id = ?
    RETURNING *
  `).get(title, summary, body, cover_url, new Date().toISOString(), id)
}

export function removeNews(id) {
  return db.prepare('DELETE FROM news WHERE id = ?').run(id).changes > 0
}

export function getComments(newsId) {
  return db.prepare(`
    SELECT id, author, body, created_at
    FROM news_comments
    WHERE news_id = ?
    ORDER BY id
  `).all(newsId)
}

export function addComment(newsId, author, body) {
  return db.prepare(`
    INSERT INTO news_comments (news_id, author, body, created_at)
    SELECT id, ?, ?, ? FROM news WHERE id = ?
    RETURNING id, author, body, created_at
  `).get(author, body, new Date().toISOString(), newsId)
}
