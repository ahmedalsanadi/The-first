// frontend/lib/auth.js
const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.local.test';

export async function getCsrf() {
  await fetch(`${API}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function login({ email, password }) {
  await getCsrf();
  const res = await fetch(`${API}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed: ' + (await res.text()));
  return res.json();
}

export async function getUser() {
  const res = await fetch(`${API}/api/user`, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await fetch(`${API}/api/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });
}
