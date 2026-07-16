import { fmtDate } from '../utils';

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="card-field">
      <span className="card-field-label">{label}</span>
      <span className="card-field-value">{value}</span>
    </div>
  );
}

function ReflectionCard({ item: reflection }) {
  const goal      = reflection.goal?.title || reflection.goal || reflection.goalId || '—';
  const went_well = reflection.wentWell     || reflection.whatWentWell     || reflection.what_went_well;
  const difficult = reflection.difficult    || reflection.whatWasDifficult || reflection.what_was_difficult;
  const learned   = reflection.learned      || reflection.whatILearned     || reflection.what_i_learned;
  const plan      = reflection.tomorrowPlan || reflection.tomorrowsPlan    || reflection.tomorrow_plan;
  const date      = reflection.date         || reflection.createdAt        || reflection.created_at;

  return (
    <article className="card reflection-card">
      <div className="card-top">
        <div>
          <span className="card-title">💡 {goal}</span>
          {date && <p className="card-subtitle">{fmtDate(date)}</p>}
        </div>
      </div>
      <hr className="card-divider" />
      <Field label="✅ What Went Well"    value={went_well} />
      <Field label="🧱 What Was Difficult" value={difficult} />
      <Field label="📚 What I Learned"    value={learned} />
      <Field label="🗓️ Tomorrow's Plan"   value={plan} />
    </article>
  );
}

export default function ReflectionsList({ items }) {
  return (
    <>
      <div className="results-meta">
        <p className="results-count">Showing <strong>{items.length}</strong> reflection{items.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="card-grid">
        {items.map((r, i) => <ReflectionCard key={r._id || i} item={r} />)}
      </div>
    </>
  );
}
