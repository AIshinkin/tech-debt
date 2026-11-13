import { About } from '@/pages/about';
import { FeedbackInbox } from '@/pages/feedback-inbox';
import { GamePage } from '@/pages/game';
import { Games } from '@/pages/gallery';
import { Home } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { NewsList } from '@/pages/news';
import { NewsArticle } from '@/pages/news-article';
import { NewsEditor } from '@/pages/news-editor';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const gameId = path.match(/^\/games\/(\d+)$/)?.[1];
const newsId = path.match(/^\/news\/(\d+)$/)?.[1];
const editNewsId = path.match(/^\/admin\/news\/(\d+)\/edit$/)?.[1];
const inbox = path === '/admin/feedback';
const newsEditor = path === '/admin/news/new' || Boolean(editNewsId);

export const route = {
  inbox,
  adminOnly: inbox || newsEditor,
  activePath: gameId ? '/gallery' : newsId || newsEditor ? '/news' : path,
};

export function Page({ role }) {
  if (route.adminOnly && role !== 'admin') {
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
