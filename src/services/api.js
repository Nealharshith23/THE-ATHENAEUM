const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Something went wrong.');
  return body;
};
export const api = {
  getClub: () => request('/club'),
  checkIn: (memberId) => request(`/members/${memberId}/check-in`, { method: 'POST' }),
  createTask: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, task) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(task) })
};
