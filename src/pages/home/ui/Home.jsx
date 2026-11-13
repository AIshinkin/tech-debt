import { useEffect, useState } from 'react';
import { getFeaturedGame } from '@/entities/game';
import './home.css';

function FeaturedGame({ game }) {
  const screenshot = game.screenshots?.[0]?.image;
  const image = screenshot || game.thumbnail;

  return (
    <article className="featured-game">
      <div className="featured-content">
        {game.genre && <p className="featured-genre">{game.genre}</p>}
        <h1>{game.title}</h1>
        {game.short_description && <p className="featured-description">{game.short_description}</p>}
        <a className="button" href={`/games/${game.id}`}>
          Подробнее <span aria-hidden="true">→</span>
        </a>
      </div>
      {image && (
        <div className="featured-media">
          <img src={image} alt={`${screenshot ? 'Скриншот' : 'Обложка'} игры ${game.title}`} />
        </div>
      )}
    </article>
  );
}

export function Home() {
  const [game, setGame] = useState(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFeaturedGame() {
      try {
        setGame(await getFeaturedGame());
      } catch {
        setError('Не удалось загрузить игру. Попробуйте обновить страницу.');
      }
    }

    loadFeaturedGame();
  }, []);

  return (
    <>
      {game ? (
        <FeaturedGame game={game} />
      ) : (
        <div className="showcase-placeholder">
          <h1>Браузерные игры</h1>
          {error && <p className="page-intro" role="alert">{error}</p>}
          {!error && game === undefined && <p className="page-intro" role="status">Загружаем игру…</p>}
          {game === null && <p className="page-intro">Студия пока не добавила игры в каталог.</p>}
        </div>
      )}
      <div className="showcase-gallery">
        <a className="button secondary-button" href="/gallery">
          Вся галерея <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
