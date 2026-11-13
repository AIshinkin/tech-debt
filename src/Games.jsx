import { useEffect, useState } from 'react';
import { GameImport } from './GameImport.jsx';

export function Games({ role }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState('');

  async function refreshGames() {
    const response = await fetch('/api/games');
    if (!response.ok) throw new Error('Catalog request failed');
    setGames(await response.json());
    setError('');
  }

  useEffect(() => {
    refreshGames().catch(() => {
      setError('Не удалось загрузить игры. Обновите страницу, чтобы попробовать снова.');
    });
  }, []);

  async function showPublishedGame(game) {
    if (!game || !games) {
      await refreshGames();
      return;
    }
    setGames((current) => [game, ...current.filter(({ id }) => id !== game.id)]);
  }

  const canImport = role === 'admin';

  return (
    <>
      <header className={canImport ? 'catalog-heading admin-heading' : 'catalog-heading'}>
        <div>
          <h1>Галерея игр</h1>
          <p className="page-intro">Подборка бесплатных браузерных игр от Пиксельной студии.</p>
        </div>
        {canImport && <a className="button" href="#game-import">Добавить игры</a>}
      </header>

      {error && <p role="alert">{error}</p>}
      {!games && !error && <p role="status">Загружаем игры…</p>}
      {games?.length === 0 && <p>Студия пока не добавила игры в каталог.</p>}

      {games?.length > 0 && (
        <>
          {canImport && <h2 className="published-games-heading">Опубликованные игры</h2>}
          <ul className="game-grid">
            {games.map((game, index) => (
              <li key={game.id}>
                <a className="game-card" href={`/games/${game.id}`}>
                  <img src={game.thumbnail} alt="" loading={index < 4 ? 'eager' : 'lazy'} />
                  <span className="game-info">
                    <span className="game-title">{game.title}</span>
                    <span className="game-genre">{game.genre}</span>
                  </span>
                  <span className="game-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      {canImport && (
        <GameImport publishedGames={games ?? []} onPublish={showPublishedGame} />
      )}
    </>
  );
}
