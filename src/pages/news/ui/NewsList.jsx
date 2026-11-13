import { useEffect, useState } from 'react';
import { getNewsList, NewsDate } from '@/entities/news';
import './news.css';

export function NewsList({ role }) {
  const [news, setNews] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNews() {
      try {
        setNews(await getNewsList());
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
                  <NewsDate value={created_at} />
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
