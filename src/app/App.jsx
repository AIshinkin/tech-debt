import { useEffect, useState } from 'react';
import { getSession } from '@/entities/session';
import { SiteLayout } from '@/widgets/site-layout';
import { Page, route } from './routing/routes.jsx';

export function App() {
  const [role, setRole] = useState(null);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const { user } = await getSession();
        if (route.adminOnly && !user) {
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
    <SiteLayout activePath={route.activePath} role={role} inbox={route.inbox}>
      {sessionError && <p role="alert">Не удалось проверить вход. Обновите страницу.</p>}
      {role === null && !sessionError && <p role="status">Загружаем страницу…</p>}
      {role !== null && <Page role={role} />}
    </SiteLayout>
  );
}
