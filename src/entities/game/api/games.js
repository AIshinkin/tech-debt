import { request } from '@/shared/api';

export function getPublishedGames() {
  return request('/api/games');
}

export function getFeaturedGame() {
  return request('/api/games/featured');
}

export function getGame(gameId) {
  return request(`/api/games/${encodeURIComponent(gameId)}`);
}
