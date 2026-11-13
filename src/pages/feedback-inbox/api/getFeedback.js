import { request } from '@/shared/api';

export function getFeedback() {
  return request('/api/admin/feedback');
}
