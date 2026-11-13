import { FeedbackButton } from '@/features/send-feedback';
import { SignOutButton } from '@/features/sign-out';
import './site-layout.css';

const links = [
  { url: '/', title: 'Главная' },
  { url: '/gallery', title: 'Галерея' },
  { url: '/news', title: 'Новости' },
  { url: '/about', title: 'О студии' },
];

function Navigation({ label, activePath }) {
  return (
    <nav aria-label={label}>
      {links.map(({ url, title }) => (
        <a key={url} href={url} aria-current={activePath === url ? 'page' : undefined}>
          {title}
        </a>
      ))}
    </nav>
  );
}

export function SiteLayout({ activePath, role, inbox, children }) {
  return (
    <>
      <header className="site-header">
        <div className="layout header-content">
          <a className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">▦</span>
            Пиксельная студия
          </a>
          <Navigation label="Главная навигация" activePath={activePath} />
          <div className="header-actions">
            {role === 'admin' && (
              <a className="button" href="/admin/feedback" aria-current={inbox ? 'page' : undefined}>
                Обращения
              </a>
            )}
            {role !== null && role !== 'admin' && <FeedbackButton />}
            {role === '' && <a className="button secondary-button" href="/login">Войти</a>}
            {role && <SignOutButton />}
          </div>
        </div>
      </header>

      <main className="layout">{children}</main>

      <footer className="site-footer">
        <div className="layout footer-content">
          <Navigation label="Навигация в подвале" activePath={activePath} />
          <span>Данные об играх предоставлены <a href="https://www.freetogame.com/">FreeToGame</a></span>
        </div>
      </footer>
    </>
  );
}
