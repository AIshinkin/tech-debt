import demoNews from './demoNews.js'
import { db } from './models/database.js'
import { getGame, getPublishedIds, saveGame } from './models/gameModel.js'
import { addNews, getNewsList } from './models/newsModel.js'
import { fetchGame } from './services/freeToGame.js'

const demoGameIds = [340, 347, 620, 345, 350, 573]

try {
  const publishedIds = new Set(getPublishedIds())
  const missingIds = demoGameIds.filter((id) => !publishedIds.has(id))
  const games = await Promise.all(missingIds.map(fetchGame))

  let addedGames = 0
  let addedNews = 0
  db.exec('BEGIN IMMEDIATE')
  try {
    for (const game of games) {
      if (saveGame(game)) addedGames += 1
    }

    const titles = new Set(getNewsList().map((article) => article.title))
    for (const { title, summary, body, gameId, imageIndex } of demoNews) {
      if (titles.has(title)) continue
      const game = gameId ? getGame(gameId) : null
      const cover_url = game?.screenshots[imageIndex]?.image ?? game?.thumbnail ?? ''
      addNews({ title, summary, body, cover_url })
      titles.add(title)
      addedNews += 1
    }

    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }

  console.log(`Добавлено игр: ${addedGames}. Добавлено новостей: ${addedNews}.`)
} catch (error) {
  console.error('Не удалось загрузить демонстрационные данные.', error.message)
  process.exitCode = 1
} finally {
  db.close()
}
