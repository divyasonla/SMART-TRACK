/**
 * api.js — Centralised fetch helper.
 * Change BASE_URL here or pass it from the UI.
 *
 * normalizeBase() extracts only the ORIGIN (protocol + host + port)
 * from whatever the user types, so paths like /api/goals are never
 * accidentally included in the base and doubled in the final URL.
 *
 * Examples:
 *   "http://localhost:5000"              → "http://localhost:5000"
 *   "http://localhost:5000/api/goals"    → "http://localhost:5000"
 *   "http://localhost:5000/api/goals/"   → "http://localhost:5000"
 */
function normalizeBase(raw = '') {
  // Remove trailing slashes first
  const cleaned = raw.trim().replace(/\/+$/, '');
  try {
    const { origin } = new URL(cleaned);
    // origin is always "protocol://host:port" with no trailing slash
    return origin;
  } catch {
    // If URL parsing fails, return as-is so the error surfaces naturally
    return cleaned;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchGoals(base) {
  const url = `${normalizeBase(base)}/api/goals`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchReflections(base) {
  const url = `${normalizeBase(base)}/api/reflections`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchProgress(base) {
  const url = `${normalizeBase(base)}/api/progress`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchDailySummary(base, email, date, startDate, endDate) {
  const params = new URLSearchParams();
  params.set('email', email.trim());
  if (date)      params.set('date',      date);
  if (startDate) params.set('startDate', startDate);
  if (endDate)   params.set('endDate',   endDate);
  const url = `${normalizeBase(base)}/api/students/summary?${params}`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}
