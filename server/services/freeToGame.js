import axios from 'axios'

const freeToGame = axios.create({
  baseURL: 'https://www.freetogame.com/api',
  timeout: 10000,
})

export async function fetchGames() {
  const response = await freeToGame.get('/games', {
    params: { platform: 'browser' },
  })
  return response.data
}

export async function fetchGame(id) {
  const response = await freeToGame.get('/game', { params: { id } })
  return response.data
}
