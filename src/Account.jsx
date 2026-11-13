import { useState } from 'react';
import './account.css';

export function LoginPage() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function login(event) {
    event.preventDefault();
    const credentials = Object.fromEntries(new FormData(event.currentTarget));
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.status === 401) {
        setError('Неверный логин или пароль.');
        return;
      }

      if (!response.ok) throw new Error('Login request failed');

      const next = new URLSearchParams(window.location.search).get('next');
      window.location.assign(/^\/news\/\d+$/.test(next) ? next : '/gallery');
    } catch {
      setError('Не удалось войти. Попробуйте ещё раз.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="login-panel">
      <h1>Вход</h1>
      <form className="login-form" onSubmit={login}>
        <label>
          Логин
          <input name="username" autoComplete="username" />
        </label>
        <label>
          Пароль
          <input name="password" type="password" autoComplete="current-password" />
        </label>
        {error && <p className="account-error" role="alert">{error}</p>}
        <button className="button" disabled={sending}>{sending ? 'Входим…' : 'Войти'}</button>
      </form>
    </section>
  );
}
