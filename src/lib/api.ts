const BASE = import.meta.env.VITE_API_BASE_URL || '';

function authHeaders(token?: string | null): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handleResponse<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return r.json();
}

export const api = {
  // ─── Events ────────────────────────────────────────────────────────────────
  getEvents: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetch(`${BASE}/api/events${qs}`).then(r => handleResponse<any[]>(r));
  },
  getEvent: (id: string) =>
    fetch(`${BASE}/api/events/${id}`).then(r => handleResponse<any>(r)),
  createEvent: (data: any, token: string) =>
    fetch(`${BASE}/api/events`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  updateEvent: (id: string, data: any, token: string) =>
    fetch(`${BASE}/api/events/${id}`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  deleteEvent: (id: string, token: string) =>
    fetch(`${BASE}/api/events/${id}`, {
      method: 'DELETE', headers: authHeaders(token),
    }).then(r => handleResponse<any>(r)),

  // ─── Tickets ───────────────────────────────────────────────────────────────
  getTickets: (token: string) =>
    fetch(`${BASE}/api/tickets`, { headers: authHeaders(token) }).then(r => handleResponse<any[]>(r)),
  bookTicket: (data: any, token: string) =>
    fetch(`${BASE}/api/tickets`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  updateTicket: (id: string, data: any, token: string) =>
    fetch(`${BASE}/api/tickets/${id}`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),

  // ─── Payment ───────────────────────────────────────────────────────────────
  generateQR: (data: { amount: number; description: string; ticketId: string }) =>
    fetch(`${BASE}/api/payment/qr`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),

  // ─── Vault ─────────────────────────────────────────────────────────────────
  getVault: (token: string) =>
    fetch(`${BASE}/api/vault`, { headers: authHeaders(token) }).then(r => handleResponse<any[]>(r)),
  uploadImage: (image: string, folder: string, token: string) =>
    fetch(`${BASE}/api/vault/upload`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify({ image, folder }),
    }).then(r => handleResponse<{ url: string; publicId: string }>(r)),
  createMemory: (data: any, token: string) =>
    fetch(`${BASE}/api/vault`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),

  // ─── Tarot ─────────────────────────────────────────────────────────────────
  getTarotCards: () =>
    fetch(`${BASE}/api/tarot`).then(r => handleResponse<any[]>(r)),
  createTarotCard: (data: any, token: string) =>
    fetch(`${BASE}/api/tarot`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  updateTarotCard: (id: string, data: any, token: string) =>
    fetch(`${BASE}/api/tarot/${id}`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  deleteTarotCard: (id: string, token: string) =>
    fetch(`${BASE}/api/tarot/${id}`, {
      method: 'DELETE', headers: authHeaders(token),
    }).then(r => handleResponse<any>(r)),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  getStats: (token: string) =>
    fetch(`${BASE}/api/admin/stats`, { headers: authHeaders(token) }).then(r => handleResponse<any>(r)),
  getUsers: (token: string) =>
    fetch(`${BASE}/api/admin/users`, { headers: authHeaders(token) }).then(r => handleResponse<any[]>(r)),
  updateUserRole: (userId: string, role: string, token: string) =>
    fetch(`${BASE}/api/admin/users`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify({ userId, role }),
    }).then(r => handleResponse<any>(r)),
  getBanks: (token: string) =>
    fetch(`${BASE}/api/admin/bank`, { headers: authHeaders(token) }).then(r => handleResponse<any[]>(r)),
  createBank: (data: any, token: string) =>
    fetch(`${BASE}/api/admin/bank`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  updateBank: (id: string, data: any, token: string) =>
    fetch(`${BASE}/api/admin/bank/${id}`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  deleteBank: (id: string, token: string) =>
    fetch(`${BASE}/api/admin/bank/${id}`, {
      method: 'DELETE', headers: authHeaders(token),
    }).then(r => handleResponse<any>(r)),

  // ─── Settings ─────────────────────────────────────────────────────────────────
  getSettings: () =>
    fetch(`${BASE}/api/settings`).then(r => handleResponse<any>(r)),
  updateSettings: (data: any, token: string) =>
    fetch(`${BASE}/api/admin/settings`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  activateBank: (id: string, token: string) =>
    fetch(`${BASE}/api/admin/bank/${id}/activate`, {
      method: 'PUT', headers: authHeaders(token),
    }).then(r => handleResponse<any>(r)),
  getAddons: () =>
    fetch(`${BASE}/api/admin/addons`).then(r => handleResponse<any[]>(r)),
  createAddon: (data: any, token: string) =>
    fetch(`${BASE}/api/admin/addons`, {
      method: 'POST', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  updateAddon: (id: string, data: any, token: string) =>
    fetch(`${BASE}/api/admin/addons/${id}`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
  deleteAddon: (id: string, token: string) =>
    fetch(`${BASE}/api/admin/addons/${id}`, {
      method: 'DELETE', headers: authHeaders(token),
    }).then(r => handleResponse<any>(r)),

  // ─── Auth ──────────────────────────────────────────────────────────────────
  getProfile: (token: string) =>
    fetch(`${BASE}/api/auth/me`, { headers: authHeaders(token) }).then(r => handleResponse<any>(r)),
  updateProfile: (data: any, token: string) =>
    fetch(`${BASE}/api/auth/me`, {
      method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data),
    }).then(r => handleResponse<any>(r)),
};
