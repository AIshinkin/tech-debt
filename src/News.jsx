import { useEffect, useState } from 'react';
import './news.css';

const dateFormat = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' });
const commentDateFormat = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function NewsList({ role }) {
  const [news, setNews] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('News request failed');

        setNews(await response.json());
      } catch {
        setError('Не удалось загрузить новости. Попробуйте обновить страницу.');
      }
    }

    loadNews();
  }, []);

  return (
    <section>
      <header className="news-list-heading">
        <h1>Новости</h1>
        {role === 'admin' && (
          <a className="button" href="/admin/news/new">Добавить новость</a>
        )}
      </header>
      {error && <p className="page-intro" role="alert">{error}</p>}
      {!news && !error && <p className="page-intro" role="status">Загружаем новости…</p>}
      {news?.length === 0 && <p className="page-intro">Пока нет опубликованных новостей.</p>}
      {news?.length > 0 && (
        <ul className="news-grid">
          {news.map(({ id, title, summary, cover_url, created_at }) => (
            <li key={id}>
              <a className="news-card" href={`/news/${id}`}>
                {cover_url && <img src={cover_url} alt="" loading="lazy" />}
                <div className="news-card-content">
                  <time dateTime={created_at}>{dateFormat.format(new Date(created_at))}</time>
                  <h2>{title}</h2>
                  {summary && <p>{summary}</p>}
                  <span className="news-card-arrow" aria-hidden="true">↗</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Comments({ newsId, role, initialComments }) {
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
      const response = await fetch(`/api/news/${newsId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });

      if (response.status === 401) {
        setCanComment(false);
        return;
      }
      if (!response.ok) {
        const failure = await response.json();
        setError(failure.error || 'Не удалось отправить комментарий.');
        return;
      }

      const comment = await response.json();
      setComments((current) => [...current, comment]);
      form.reset();
    } catch {
      setError('Не удалось отправить комментарий. Попробуйте ещё раз.');
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

function NewsArticleActions({ article }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function deleteNews() {
    if (!window.confirm(`Удалить новость «${article.title}» вместе с комментариями?`)) return;

    setError('');
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/news/${article.id}`, { method: 'DELETE' });
      if (response.status === 401) {
        window.location.assign(`/login?next=/news/${article.id}`);
        return;
      }
      if (!response.ok && response.status !== 404) throw new Error('Delete request failed');

      window.location.assign('/news');
    } catch {
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

export function NewsArticle({ newsId, role }) {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArticle() {
      try {
        const response = await fetch(`/api/news/${newsId}`);
        if (response.status === 404) {
          setError('Новость не найдена.');
          return;
        }
        if (!response.ok) throw new Error('News article request failed');

        setArticle(await response.json());
      } catch {
        setError('Не удалось загрузить новость. Попробуйте обновить страницу.');
      }
    }

    loadArticle();
  }, [newsId]);

  return (
    <div className="news-detail">
      <div className="news-article-navigation">
        <a className="news-back" href="/news"><span aria-hidden="true">←</span> К новостям</a>
        {role === 'admin' && article && <NewsArticleActions article={article} />}
      </div>
      {error && <p className="page-intro" role="alert">{error}</p>}
      {!article && !error && <p className="page-intro" role="status">Загружаем новость…</p>}
      {article && (
        <>
          <article className="news-story">
            <header>
              <time dateTime={article.created_at}>{dateFormat.format(new Date(article.created_at))}</time>
              <h1>{article.title}</h1>
              {article.summary && <p className="news-story-summary">{article.summary}</p>}
            </header>
            {article.cover_url && <img className="news-story-cover" src={article.cover_url} alt="" />}
            <div className="news-story-body">{article.body}</div>
          </article>
          <Comments key={article.id} newsId={article.id} role={role} initialComments={article.comments} />
        </>
      )}
    </div>
  );
}
