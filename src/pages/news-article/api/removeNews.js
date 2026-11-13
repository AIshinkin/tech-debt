import { request } from '@/shared/api';

export function removeNews(newsId) {
  return request(`/api/admin/news/${newsId}`, { method: 'DELETE' });
}
