import { useEffect, useState } from 'react';
import './admin-news.css';

export function NewsEditor({ newsId }) {
  const returnPath = newsId ? `/news/${newsId}` : '/news';
  const [article, setArticle] = useState(newsId ? null : {});
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!newsId) return;

    async function loadArticle() {
      try {
        const response = await fetch(`/api/news/${newsId}`);
        if (response.status === 404) {
          setLoadError('Новость не найдена.');
          return;
        }
        if (!response.ok) throw new Error('Article request failed');
        setArticle(await response.json());
      } catch {
        setLoadError('Не удалось загрузить новость. Попробуйте обновить страницу.');
      }
    }

    loadArticle();
  }, [newsId]);

  async function saveNews(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    setSaveError('');

    try {
      const response = await fetch(newsId ? `/api/admin/news/${newsId}` : '/api/admin/news', {
        method: newsId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (response.status === 401) {
        setSaveError('Сессия закончилась. Войдите в новой вкладке и повторите сохранение.');
        return;
      }
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setSaveError(result.error || 'Не удалось сохранить новость. Попробуйте ещё раз.');
        return;
      }

      window.location.assign(returnPath);
    } catch {
      setSaveError('Не удалось сохранить новость. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="news-editor">
      <a className="news-editor-back" href={returnPath}>
        <span aria-hidden="true">←</span> {newsId ? 'К новости' : 'К списку новостей'}
      </a>
      <h1>{newsId ? 'Редактировать новость' : 'Добавить новость'}</h1>

      {loadError && <p className="account-error" role="alert">{loadError}</p>}
      {!article && !loadError && <p role="status">Загружаем новость…</p>}
      {article && (
        <form className="news-editor-form" onSubmit={saveNews}>
          <label>
            Заголовок
            <input name="title" defaultValue={article.title} required />
          </label>
          <label>
            Краткое описание (необязательно)
            <textarea name="summary" defaultValue={article.summary} rows="2" />
          </label>
          <label>
            Ссылка на обложку (необязательно)
            <input name="cover_url" inputMode="url" defaultValue={article.cover_url} />
          </label>
          <label>
            Текст новости
            <textarea name="body" defaultValue={article.body} rows="9" required />
          </label>
          {saveError && <p className="account-error" role="alert">{saveError}</p>}
          <div className="news-editor-actions">
            <button className="button" disabled={saving}>
              {saving ? 'Сохраняем…' : newsId ? 'Сохранить изменения' : 'Опубликовать'}
            </button>
            <a className="button secondary-button" href={returnPath}>Отмена</a>
          </div>
        </form>
      )}
    </section>
  );
}
