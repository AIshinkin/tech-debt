import { getFeaturedGame, getGame, getGames, getPublishedIds, saveGame } from '../models/gameModel.js'
import { fetchGame, fetchGames } from '../services/freeToGame.js'

export function listGames(req, res) {
  res.json(getGames())
}

export function showFeaturedGame(req, res) {
  res.json(getFeaturedGame())
}

export function showGame(req, res) {
  const game = getGame(Number(req.params.id))
  if (!game) {
    return res.status(404).json({ error: 'Игра не найдена.' })
  }
  res.json(game)
}

export async function listImportableGames(req, res) {
  const games = await fetchGames()
  res.json({ games, publishedIds: getPublishedIds() })
}

export async function publishGame(req, res) {
  const game = await fetchGame(req.body?.id)

  if (!saveGame(game)) {
    return res.status(409).json({ error: 'Игра уже опубликована.' })
  }

  res.status(201).json(game)
}
