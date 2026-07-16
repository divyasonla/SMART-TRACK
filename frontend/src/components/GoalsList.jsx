import { fmtDate, statusBadgeClass, normPct } from '../utils';

function ProgressBar({ pct }) {
  const n = normPct(pct);
  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label">Completion</span>
        <span className="progress-value">{n}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={n} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${n}%` }} />
      </div>
    </div>
  );
}

function GoalCard({ goal }) {
  const title       = goal.title       || goal.name    || 'Untitled Goal';
  const description = goal.description || goal.desc    || '—';
  const status      = goal.status      || 'unknown';
  const pct         = goal.completionPercentage ?? goal.completion ?? goal.progress ?? 0;
  const created     = goal.createdAt   || goal.created_at;

  return (
    <article className="card goal-card">
      <div className="card-top">
        <span className="card-title">{title}</span>
        <span className={`badge ${statusBadgeClass(status)}`}>{status}</span>
      </div>
      <p className="card-desc">{description}</p>
      <ProgressBar pct={pct} />
      {created && (
        <div className="card-field">
          <span className="card-field-label">Created</span>
          <span className="card-field-value">{fmtDate(created)}</span>
        </div>
      )}
    </article>
  );
}

export default function GoalsList({ items }) {
  return (
    <>
      <div className="results-meta">
        <p className="results-count">Showing <strong>{items.length}</strong> goal{items.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="card-grid">
        {items.map((g, i) => <GoalCard key={g._id || i} goal={g} />)}
      </div>
    </>
  );
}
