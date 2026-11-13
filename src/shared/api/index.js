export async function request(path, options) {
  const response = await fetch(path, options);

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const error = new Error(payload?.error || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}
