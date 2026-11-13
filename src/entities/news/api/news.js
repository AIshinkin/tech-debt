import { request } from '@/shared/api';

export function getNewsList() {
  return request('/api/news');
}

export function getNews(id) {
  return request(`/api/news/${id}`);
}
