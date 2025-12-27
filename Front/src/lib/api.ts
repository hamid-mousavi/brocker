export type ApiEnvelope<T> = { success: boolean; message?: string | null; data?: T; meta?: any };

const API_URL = (import.meta.env.VITE_API_URL as string) || "";

async function handleResponse<T>(res: Response): Promise<ApiEnvelope<T>> {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw payload;
  return payload as ApiEnvelope<T>;
}

export async function getAgents(page = 1, pageSize = 10, port?: string, service?: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (port) params.append('port', port);
  if (service) params.append('service', service);

  const url = API_URL ? `${API_URL}/api/agents?${params.toString()}` : `/api/agents?${params.toString()}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  const payload = await handleResponse<any>(res);

  // map backend shape to frontend Broker shape
  if (payload.success && Array.isArray(payload.data)) {
    payload.data = payload.data.map((a: any) => ({
      id: a.id,
      name: a.fullName ?? a.companyName ?? '',
      ports: a.customs ?? [],
      services: a.goodsTypes ?? [],
      experience: a.yearsOfExperience ?? 0,
      verified: a.isVerified ?? false,
      mobile: a.mobile ?? '',      phoneNumbers: a.phoneNumbers ?? [],      description: a.bio ?? ''
    }));
  }

  return payload;
}

function getAuthHeader() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getRegistrations(page = 1, pageSize = 10, status?: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status) params.append('status', status);
  const url = API_URL ? `${API_URL}/api/admin/registrations?${params.toString()}` : `/api/admin/registrations?${params.toString()}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json', ...getAuthHeader() } });
  return handleResponse<any>(res);
}

export async function login(phone: string) {
  const url = API_URL ? `${API_URL}/api/auth/login` : `/api/auth/login`;
  const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
  return handleResponse<any>(res);
}

export async function approveRegistration(id: string) {
  const url = API_URL ? `${API_URL}/api/admin/registrations/${id}/approve` : `/api/admin/registrations/${id}/approve`;
  const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...getAuthHeader() } });
  return handleResponse<any>(res);
}

export async function rejectRegistration(id: string) {
  const url = API_URL ? `${API_URL}/api/admin/registrations/${id}/reject` : `/api/admin/registrations/${id}/reject`;
  const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...getAuthHeader() }, body: '{}' });
  return handleResponse<any>(res);
}

export async function getAgentById(id: string, reviewsPage = 1, reviewsPageSize = 10) {
  const url = API_URL ? `${API_URL}/api/agents/${id}?reviewsPage=${reviewsPage}&reviewsPageSize=${reviewsPageSize}` : `/api/agents/${id}?reviewsPage=${reviewsPage}&reviewsPageSize=${reviewsPageSize}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getReviews(agentId: string, page = 1, pageSize = 10) {
  const url = API_URL ? `${API_URL}/api/agents/${agentId}/reviews?page=${page}&pageSize=${pageSize}` : `/api/agents/${agentId}/reviews?page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function postReview(agentId: string, body: { reviewerName: string; rating: number; comment: string }) {
  const url = API_URL ? `${API_URL}/api/agents/${agentId}/reviews` : `/api/agents/${agentId}/reviews`;
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return handleResponse(res);
}