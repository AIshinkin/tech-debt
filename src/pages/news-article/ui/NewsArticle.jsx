import { useEffect, useState } from 'react';
import { getNews, NewsDate } from '@/entities/news';
import { NewsComments } from '@/features/comment-news';
import { NewsArticleActions } from './NewsArticleActions.jsx';
import './news-article.css';

export function NewsArticle({ newsId, role }) {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArticle() {
      try {
        setArticle(await getNews(newsId));
      } catch (error) {
        setError(error.status === 404
          ? 'Новость не найдена.'
          : 'Не удалось загрузить новость. Попробуйте обновить страницу.');
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
              <NewsDate value={article.created_at} />
              <h1>{article.title}</h1>
              {article.summary && <p className="news-story-summary">{article.summary}</p>}
            </header>
            {article.cover_url && <img className="news-story-cover" src={article.cover_url} alt="" />}
            <div className="news-story-body">{article.body}</div>
          </article>
          <NewsComments key={article.id} newsId={article.id} role={role} initialComments={article.comments} />
        </>
      )}
    </div>
  );
}
