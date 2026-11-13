import { db } from "./database.js";

export function getGames() {
  return db
    .prepare(
      `
    SELECT id, title, thumbnail, short_description, genre, platform
    FROM games
    ORDER BY published_at DESC, rowid DESC
  `,
    )
    .all();
}

export function getGame(id) {
  const game = db.prepare("SELECT * FROM games WHERE id = ?").get(id);
  if (game) {
    game.screenshots = JSON.parse(game.screenshots);
  }
  return game;
}

export function getFeaturedGame() {
  const latest = db
    .prepare(
      "SELECT id FROM games ORDER BY published_at DESC, rowid DESC LIMIT 1",
    )
    .get();
  return latest ? getGame(latest.id) : null;
}

export function getPublishedIds() {
  return db
    .prepare("SELECT id FROM games")
    .all()
    .map((game) => game.id);
}

export function saveGame(game) {
  const result = db
    .prepare(
      `
    INSERT INTO games (
      id, title, thumbnail, short_description, description, genre, platform,
      developer, publisher, release_date, game_url, freetogame_profile_url, screenshots
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `,
    )
    .run(
      game.id,
      game.title,
      game.thumbnail ?? null,
      game.short_description ?? null,
      game.description ?? null,
      game.genre ?? null,
      game.platform ?? null,
      game.developer ?? null,
      game.publisher ?? null,
      game.release_date ?? null,
      game.game_url ?? null,
      game.freetogame_profile_url ?? null,
      JSON.stringify(game.screenshots ?? []),
    );
  return result.changes > 0;
}
