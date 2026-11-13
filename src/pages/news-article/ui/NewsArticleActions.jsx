import { useState } from 'react';
import { removeNews } from '../api/removeNews.js';

export function NewsArticleActions({ article }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function deleteNews() {
    if (!window.confirm(`Удалить новость «${article.title}» вместе с комментариями?`)) return;

    setError('');
    setDeleting(true);

    try {
      await removeNews(article.id);
      window.location.assign('/news');
    } catch (error) {
      if (error.status === 401) {
        window.location.assign(`/login?next=/news/${article.id}`);
        return;
      }
      if (error.status === 404) {
        window.location.assign('/news');
        return;
      }
      setError('Не удалось удалить новость. Попробуйте ещё раз.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="news-article-management">
      <div className="news-article-actions">
        <a className="button secondary-button" href={`/admin/news/${article.id}/edit`}>Изменить</a>
        <button
          type="button"
          className="button secondary-button news-delete"
          disabled={deleting}
          onClick={deleteNews}
        >
          {deleting ? 'Удаляем…' : 'Удалить'}
        </button>
      </div>
      {error && <p className="account-error" role="alert">{error}</p>}
    </div>
  );
}
