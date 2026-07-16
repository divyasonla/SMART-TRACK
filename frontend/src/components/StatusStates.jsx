/** Reusable loading / error / empty state UI */

export function LoadingState() {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-title">Loading data…</p>
      <p className="state-sub">Fetching from the API, please wait.</p>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="state-box" role="alert">
      <div className="error-box">
        <span className="error-icon">⚠️</span>
        <div className="error-body">
          <h3>Something went wrong</h3>
          <p>{message || 'An unexpected error occurred. Check the API URL and try again.'}</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ label = 'data' }) {
  return (
    <div className="state-box">
      <span className="state-icon">🗂️</span>
      <p className="state-title">No {label} found</p>
      <p className="state-sub">The API returned an empty response. Try adjusting your filters or adding records first.</p>
    </div>
  );
}

export function IdleState() {
  return (
    <div className="state-box">
      <span className="state-icon">🚀</span>
      <p className="state-title">Ready to load</p>
      <p className="state-sub">Select a tab, fill in the fields above and click <strong>Load Data</strong>.</p>
    </div>
  );
}
