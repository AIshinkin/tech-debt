import {
  addComment, addNews, getComments, getNews, getNewsList, removeNews, updateNews,
} from '../models/newsModel.js'

function newsFields(data = {}) {
  const title = String(data.title ?? '').trim()
  const body = String(data.body ?? '').trim()
  const summary = String(data.summary ?? '').trim()
  const cover_url = String(data.cover_url ?? '').trim()
  return { title, summary, body, cover_url }
}

export function listNews(req, res) {
  res.json(getNewsList())
}

export function showNews(req, res) {
  const id = Number(req.params.id)
  const news = getNews(id)
  if (!news) return res.status(404).json({ error: 'Новость не найдена.' })

  res.json({ ...news, comments: getComments(id) })
}

export function createNews(req, res) {
  const news = newsFields(req.body)
  if (!news.title || !news.body) {
    return res.status(400).json({ error: 'Заполните заголовок и текст новости.' })
  }

  res.status(201).json(addNews(news))
}

export function editNews(req, res) {
  const news = newsFields(req.body)
  if (!news.title || !news.body) {
    return res.status(400).json({ error: 'Заполните заголовок и текст новости.' })
  }

  const updated = updateNews(Number(req.params.id), news)
  if (!updated) return res.status(404).json({ error: 'Новость не найдена.' })

  res.json(updated)
}

export function deleteNews(req, res) {
  if (!removeNews(Number(req.params.id))) {
    return res.status(404).json({ error: 'Новость не найдена.' })
  }

  res.sendStatus(204)
}

export function createComment(req, res) {
  const user = req.session.user
  if (!user) {
    return res.status(401).json({ error: 'Войдите, чтобы оставить комментарий.' })
  }

  const body = String(req.body?.body ?? '').trim()
  if (!body) return res.status(400).json({ error: 'Введите текст комментария.' })

  const comment = addComment(Number(req.params.id), user.username, body)
  if (!comment) return res.status(404).json({ error: 'Новость не найдена.' })

  res.status(201).json(comment)
}
