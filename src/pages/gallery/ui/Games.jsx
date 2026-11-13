import { useEffect, useState } from 'react';
import { GameCard, getPublishedGames } from '@/entities/game';
import { GameImport } from '@/features/import-game';
import './gallery.css';

export function Games({ role }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState('');

  async function refreshGames() {
    setGames(await getPublishedGames());
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
                <GameCard game={game} loading={index < 4 ? 'eager' : 'lazy'} />
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
