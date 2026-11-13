import { useState } from 'react';
import { createComment } from '../api/createComment.js';
import './news-comments.css';

const commentDateFormat = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function NewsComments({ newsId, role, initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [canComment, setCanComment] = useState(Boolean(role));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function sendComment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = new FormData(form).get('body');
    setSending(true);
    setError('');

    try {
      const comment = await createComment(newsId, body);
      setComments((current) => [...current, comment]);
      form.reset();
    } catch (error) {
      if (error.status === 401) {
        setCanComment(false);
        return;
      }
      setError(error.status === 400 || error.status === 404
        ? error.message
        : 'Не удалось отправить комментарий. Попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="news-comments" aria-labelledby="news-comments-heading">
      <h2 id="news-comments-heading">Комментарии</h2>
      {comments.length === 0 && <p className="page-intro">Пока нет комментариев.</p>}
      {comments.length > 0 && (
        <ul className="news-comment-list">
          {comments.map(({ id, author, body, created_at }) => (
            <li key={id} className="news-comment">
              <header>
                <strong>{author}</strong>
                <time dateTime={created_at}>{commentDateFormat.format(new Date(created_at))}</time>
              </header>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      )}
      {canComment ? (
        <form className="news-comment-form" onSubmit={sendComment}>
          <label>
            Ваш комментарий
            <textarea name="body" rows="4" />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="button" disabled={sending}>{sending ? 'Отправляем…' : 'Отправить'}</button>
        </form>
      ) : (
        <div className="news-comment-signin">
          <p>Войдите, чтобы оставить комментарий.</p>
          <a className="button secondary-button" href={`/login?next=/news/${newsId}`}>Войти</a>
        </div>
      )}
    </section>
  );
}
