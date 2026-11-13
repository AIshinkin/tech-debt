import { request } from '@/shared/api';

export function saveNews(id, fields) {
  return request(id ? `/api/admin/news/${id}` : '/api/admin/news', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
}
