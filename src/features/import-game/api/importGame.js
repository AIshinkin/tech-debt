import { request } from '@/shared/api';

export function getImportCatalog() {
  return request('/api/admin/games');
}

export async function importGame(id) {
  try {
    return await request('/api/admin/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  } catch (error) {
    if (error.status === 409) return null;
    throw error;
  }
}
