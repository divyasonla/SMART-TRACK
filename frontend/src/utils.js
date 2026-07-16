/** Tiny utility functions used across components */

/** Format ISO date string → "Jul 14, 2026" */
export function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Status string → badge CSS class */
export function statusBadgeClass(status = '') {
  const s = status.toLowerCase();
  if (['completed', 'done', 'success'].some(k => s.includes(k))) return 'badge-success';
  if (['in progress', 'active', 'ongoing'].some(k => s.includes(k))) return 'badge-warning';
  if (['pending', 'not started', 'todo'].some(k => s.includes(k))) return 'badge-primary';
  if (['failed', 'cancelled', 'blocked'].some(k => s.includes(k))) return 'badge-danger';
  return 'badge-neutral';
}

/** Normalise percentage values  (could be 0-1 or 0-100) */
export function normPct(val) {
  if (val === undefined || val === null) return 0;
  const n = Number(val);
  return n > 1 ? n : Math.round(n * 100);
}

/** Safely extract array from various API shapes */
export function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.goals) return data.goals;
  if (data?.reflections) return data.reflections;
  if (data?.progress) return data.progress;
  return [];
}
