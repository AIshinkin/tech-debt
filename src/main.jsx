import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LoginPage } from './Account.jsx';
import { NewsEditor } from './AdminNews.jsx';
import { About } from './About.jsx';
import { FeedbackInbox } from './FeedbackInbox.jsx';
import { GamePage } from './GamePage.jsx';
import { Games } from './Games.jsx';
import { Home } from './Home.jsx';
import { Modal } from './Modal.jsx';
import { NewsArticle, NewsList } from './News.jsx';
import './styles.css';

const pages = [
  { url: '/', title: 'Главная' },
  { url: '/gallery', title: 'Галерея' },
  { url: '/news', title: 'Новости' },
  { url: '/about', title: 'О студии' },
];

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const gameId = path.match(/^\/games\/(\d+)$/)?.[1];
const newsId = path.match(/^\/news\/(\d+)$/)?.[1];
const editNewsId = path.match(/^\/admin\/news\/(\d+)\/edit$/)?.[1];
const inbox = path === '/admin/feedback';
const newsEditor = path === '/admin/news/new' || Boolean(editNewsId);
const adminPage = inbox || newsEditor;
const activePath = gameId ? '/gallery' : newsId || newsEditor ? '/news' : path;

function Navigation({ label }) {
  return (
    <nav aria-label={label}>
      {pages.map(({ url, title }) => (
        <a
          key={url}
          href={url}
          aria-current={activePath === url ? 'page' : undefined}
        >
          {title}
        </a>
      ))}
    </nav>
  );
}

function Feedback({ onClose }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  async function sendFeedback(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = Object.fromEntries(new FormData(form));
    setSending(true);
    setStatus('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (!response.ok) throw new Error('Feedback request failed');

      form.reset();
      setStatus('Сообщение отправлено.');
    } catch {
      setStatus('Не удалось отправить сообщение. Попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal title="Обратная связь" onClose={onClose}>
      <form className="feedback-form" onSubmit={sendFeedback} noValidate>
        <label>
          Имя
          <input name="name" autoComplete="name" />
        </label>
        <label>
          Электронная почта
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Сообщение
          <textarea name="message" rows="4" />
        </label>
        <button className="button" disabled={sending}>
          {sending ? 'Отправляем…' : 'Отправить'}
        </button>
        {status && <p role="status">{status}</p>}
      </form>
    </Modal>
  );
}

function Page({ role }) {
  if (adminPage && role !== 'admin') {
    return (
      <>
        <h1>Доступ только для администратора</h1>
        <p><a href="/">Вернуться на главную</a></p>
      </>
    );
  }

  if (inbox) return <FeedbackInbox />;
  if (newsEditor) return <NewsEditor newsId={editNewsId} />;
  if (gameId) return <GamePage gameId={gameId} />;
  if (newsId) return <NewsArticle newsId={newsId} role={role} />;
  if (path === '/') return <Home />;
  if (path === '/gallery') return <Games role={role} />;
  if (path === '/news') return <NewsList role={role} />;
  if (path === '/login') return <LoginPage />;
  if (path === '/about') return <About />;

  return (
    <>
      <h1>Страница не найдена</h1>
      <p><a href="/">Вернуться на главную</a></p>
    </>
  );
}

function AccountNavigation({ role }) {
  const [error, setError] = useState('');

  async function logout() {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      window.location.assign('/');
    } catch {
      setError('Не удалось выйти.');
    }
  }

  if (!role) {
    return <a className="button secondary-button" href="/login">Войти</a>;
  }

  return (
    <>
      <button className="button secondary-button" type="button" onClick={logout}>Выйти</button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}

function App() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch('/api/session');
        if (!response.ok) throw new Error('Session request failed');
        const { user } = await response.json();

        if (adminPage && !user) {
          window.location.replace('/login');
          return;
        }
        setRole(user?.role ?? '');
      } catch {
        setSessionError(true);
      }
    }

    loadSession();
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="layout header-content">
          <a className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">▦</span>
            Пиксельная студия
          </a>
          <Navigation label="Главная навигация" />
          <div className="header-actions">
            {role === 'admin' && (
              <a
                className="button"
                href="/admin/feedback"
                aria-current={inbox ? 'page' : undefined}
              >
                Обращения
              </a>
            )}
            {role !== null && role !== 'admin' && (
              <button type="button" className="button" onClick={() => setFeedbackOpen(true)}>
                Обратная связь
              </button>
            )}
            {role !== null && <AccountNavigation role={role} />}
          </div>
        </div>
      </header>

      <main className="layout">
        {sessionError && <p role="alert">Не удалось проверить вход. Обновите страницу.</p>}
        {role === null && !sessionError && <p role="status">Загружаем страницу…</p>}
        {role !== null && <Page role={role} />}
      </main>

      <footer className="site-footer">
        <div className="layout footer-content">
          <Navigation label="Навигация в подвале" />
          <span>Данные об играх предоставлены <a href="https://www.freetogame.com/">FreeToGame</a></span>
        </div>
      </footer>

      {feedbackOpen && <Feedback onClose={() => setFeedbackOpen(false)} />}
    </>
  );
}

createRoot(document.getElementById('app')).render(<App />);
