import { useState } from 'react';
import { signOut } from '@/entities/session';

export function SignOutButton() {
  const [error, setError] = useState('');

  async function logout() {
    try {
      await signOut();
      window.location.assign('/');
    } catch {
      setError('Не удалось выйти.');
    }
  }

  return (
    <>
      <button className="button secondary-button" type="button" onClick={logout}>Выйти</button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}
