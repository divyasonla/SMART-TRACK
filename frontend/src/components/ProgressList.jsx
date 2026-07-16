import { normPct } from '../utils';

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

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="card-field">
      <span className="card-field-label">{label}</span>
      <span className="card-field-value">{value}</span>
    </div>
  );
}

function ProgressCard({ item }) {
  const morning   = item.morningUpdate   || item.morning_update   || item.morning;
  const afternoon = item.afternoonUpdate || item.afternoon_update || item.afternoon;
  const evening   = item.eveningUpdate   || item.evening_update   || item.evening;
  const blockers  = item.blockers;
  const timeSpent = item.timeSpent       || item.time_spent;
  const pct       = item.completionPercentage ?? item.completion ?? item.progress ?? 0;

  return (
    <article className="card progress-card">
      <div className="card-top">
        <div>
          <span className="card-title">📈 Progress Entry</span>
          {timeSpent && (
            <p className="card-subtitle" style={{ marginTop: '4px' }}>
              <span className="time-chip">⏱ {timeSpent} hrs</span>
            </p>
          )}
        </div>
      </div>
      <hr className="card-divider" />
      <Field label="🌅 Morning Update"   value={morning} />
      <Field label="☀️ Afternoon Update" value={afternoon} />
      <Field label="🌙 Evening Update"   value={evening} />
      <Field label="🚧 Blockers"         value={blockers} />
      <ProgressBar pct={pct} />
    </article>
  );
}

export default function ProgressList({ items }) {
  return (
    <>
      <div className="results-meta">
        <p className="results-count">Showing <strong>{items.length}</strong> progress record{items.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="card-grid">
        {items.map((p, i) => <ProgressCard key={p._id || i} item={p} />)}
      </div>
    </>
  );
}
