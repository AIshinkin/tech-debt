import { request } from '@/shared/api';

export function createComment(newsId, body) {
  return request(`/api/news/${newsId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
}
