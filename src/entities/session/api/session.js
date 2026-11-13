import { request } from '@/shared/api';

export function getSession() {
  return request('/api/session');
}

export function signIn(credentials) {
  return request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export function signOut() {
  return request('/api/logout', { method: 'POST' });
}
