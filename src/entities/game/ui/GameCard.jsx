import './game-card.css';

export function GameCard({ game, loading }) {
  return (
    <a className="game-card" href={`/games/${game.id}`}>
      <img src={game.thumbnail} alt="" loading={loading} />
      <span className="game-info">
        <span className="game-title">{game.title}</span>
        <span className="game-genre">{game.genre}</span>
      </span>
      <span className="game-arrow" aria-hidden="true">↗</span>
    </a>
  );
}
