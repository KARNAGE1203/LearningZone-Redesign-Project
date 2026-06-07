import type { DashboardData } from '../types';

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const token = localStorage.getItem('lz_token');
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `API ${res.status}`);
  return data as T;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    studentId: string;
    programme: string;
    year: number;
    avatar: string | null;
  };
}

export const api = {
  login: (studentId: string, password: string) =>
    post<LoginResponse>('/auth/login', { studentId, password }),
  getDashboard: (userId: string) => get<DashboardData>(`/dashboard/${userId}`),
};
