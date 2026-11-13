import { useEffect, useState } from 'react';

export function GameImport({ publishedGames, onPublish }) {
  const [catalog, setCatalog] = useState(null);
  const [search, setSearch] = useState('');
  const [publishingId, setPublishingId] = useState(null);
  const [error, setError] = useState('');
  const [failedGameId, setFailedGameId] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!status) return;

    const timeout = window.setTimeout(() => setStatus(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await fetch('/api/admin/games');
        if (response.status === 401) {
          window.location.assign('/login');
          return;
        }
        if (!response.ok) throw new Error('Catalog request failed');

        const { games, publishedIds } = await response.json();
        setCatalog(games.filter((game) => !publishedIds.includes(game.id)));
      } catch {
        setError('Не удалось загрузить каталог FreeToGame. Обновите страницу, чтобы попробовать снова.');
      }
    }

    loadCatalog();
  }, []);

  async function publishGame(game) {
    setPublishingId(game.id);
    setFailedGameId(null);
    setStatus('');

    try {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: game.id }),
      });

      if (response.status === 401) {
        window.location.assign('/login');
        return;
      }
      if (!response.ok && response.status !== 409) throw new Error('Publish request failed');

      await onPublish(response.status === 409 ? null : await response.json());
      setStatus(response.status === 409
        ? `«${game.title}» уже есть в галерее.`
        : `«${game.title}» добавлена в галерею.`);
    } catch {
      setFailedGameId(game.id);
    } finally {
      setPublishingId(null);
    }
  }

  const publishedIds = new Set(publishedGames.map(({ id }) => id));
  const availableGames = catalog?.filter((game) => !publishedIds.has(game.id));
  const query = search.trim().toLowerCase();
  const matches = availableGames?.filter((game) => game.title.toLowerCase().includes(query));

  return (
    <section className="game-import" id="game-import" aria-labelledby="game-import-heading">
      <h2 id="game-import-heading">Игры для добавления</h2>
      {availableGames?.length > 0 && (
        <label className="admin-search">
          Поиск по каталогу FreeToGame
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      )}

      {!catalog && !error && <p role="status">Загружаем каталог…</p>}
      {error && <p className="account-error" role="alert">{error}</p>}
      {availableGames?.length === 0 && <p>Все игры из каталога уже добавлены.</p>}
      {availableGames?.length > 0 && matches.length === 0 && <p>Игры не найдены.</p>}
      {matches?.length > 0 && (
        <ul className="admin-games">
          {matches.map((game) => (
            <li className="admin-game" key={game.id}>
              <img src={game.thumbnail} alt="" loading="lazy" />
              <div className="admin-game-name">
                <strong>{game.title}</strong>
                <span>{game.genre}</span>
              </div>
              <button
                className="button secondary-button admin-game-action"
                type="button"
                disabled={publishingId !== null}
                aria-label={`Добавить ${game.title}`}
                onClick={() => publishGame(game)}
              >
                {publishingId === game.id ? 'Добавляем…' : 'Добавить'}
              </button>
              {failedGameId === game.id && (
                <p className="admin-row-error account-error" role="alert">Не удалось добавить игру. Попробуйте ещё раз.</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="admin-toast" role="status">
        {status && <p>{status}</p>}
      </div>
    </section>
  );
}
