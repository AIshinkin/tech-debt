import { useEffect, useState } from 'react';
import { getGame } from '@/entities/game';
import './game-page.css';

function ScreenshotCarousel({ screenshots, title }) {
  const [index, setIndex] = useState(0);

  function move(step) {
    setIndex((current) => (current + step + screenshots.length) % screenshots.length);
  }

  return (
    <section className="screenshot-gallery" aria-label="Скриншоты">
      <div className="screenshot-stage">
        <img src={screenshots[index].image} alt={`Скриншот ${index + 1} игры ${title}`} />
        {screenshots.length > 1 && (
          <>
            <button className="screenshot-prev" type="button" onClick={() => move(-1)} aria-label="Предыдущий скриншот">‹</button>
            <button className="screenshot-next" type="button" onClick={() => move(1)} aria-label="Следующий скриншот">›</button>
            <span className="screenshot-count" aria-live="polite">{index + 1} / {screenshots.length}</span>
          </>
        )}
      </div>
      {screenshots.length > 1 && (
        <div className="screenshot-thumbnails">
          {screenshots.map((screenshot, position) => (
            <button
              key={screenshot.id}
              type="button"
              aria-label={`Показать скриншот ${position + 1}`}
              aria-pressed={position === index}
              onClick={() => setIndex(position)}
            >
              <img src={screenshot.image} alt="" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function GameFacts({ game }) {
  const platform = game.platform === 'Web Browser' ? 'Браузер' : game.platform;
  const releaseDate = game.release_date && new Date(game.release_date);
  const releaseLabel = releaseDate && !Number.isNaN(releaseDate.getTime())
    ? releaseDate.toLocaleDateString('ru-RU', { dateStyle: 'long', timeZone: 'UTC' })
    : '';
  const facts = [
    ['Жанр', game.genre],
    ['Платформа', platform],
    ['Разработчик', game.developer],
    ['Издатель', game.publisher],
    ['Дата выхода', releaseLabel],
  ];

  return (
    <aside className="game-facts" aria-label="Сведения об игре">
      {game.thumbnail && <img className="game-facts-cover" src={game.thumbnail} alt="" />}
      <div className="game-facts-content">
        <dl>
          {facts.filter(([, value]) => value).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {game.freetogame_profile_url && (
          <a className="game-source" href={game.freetogame_profile_url}>Страница на FreeToGame <span aria-hidden="true">↗</span></a>
        )}
      </div>
    </aside>
  );
}

export function GamePage({ gameId }) {
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGame() {
      try {
        setGame(await getGame(gameId));
      } catch (error) {
        setError(error.status === 404
          ? 'Игра не найдена в каталоге.'
          : 'Не удалось загрузить игру. Попробуйте обновить страницу.');
      }
    }

    loadGame();
  }, [gameId]);

  return (
    <article className="game-detail">
      <a className="game-back" href="/gallery"><span aria-hidden="true">←</span> К галерее</a>
      {error && <h1 role="alert">{error}</h1>}
      {!game && !error && <p role="status">Загружаем игру…</p>}
      {game && (
        <>
          <div className="game-detail-heading">
            <h1>{game.title}</h1>
            {game.game_url && (
              <a className="button game-play" href={game.game_url}>
                Открыть игру <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <div className="game-detail-layout">
            <div className="game-detail-content">
              {game.screenshots?.length > 0 && (
                <ScreenshotCarousel screenshots={game.screenshots} title={game.title} />
              )}
              <section className="game-description" aria-labelledby="game-description-heading">
                <h2 id="game-description-heading">Об игре</h2>
                <p>{game.description || game.short_description || 'Описание пока недоступно.'}</p>
              </section>
            </div>
            <GameFacts game={game} />
          </div>
        </>
      )}
    </article>
  );
}
