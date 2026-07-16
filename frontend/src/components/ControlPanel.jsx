/** Control panel: API URL, tab selector, and dynamic extra params */
export default function ControlPanel({
  activeTab,
  baseUrl, setBaseUrl,
  email, setEmail,
  date, setDate,
  startDate, setStartDate,
  endDate, setEndDate,
  loading,
  onLoad,
}) {
  const isDailySummary = activeTab === 'daily-summary';

  return (
    <section className="control-panel" aria-label="API Configuration">
      <div className="panel-row">
        {/* Base URL */}
        <div className="field-group">
          <label className="field-label" htmlFor="api-base-url">API Base URL</label>
          <input
            id="api-base-url"
            type="url"
            className="field-input"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value.trim())}
            placeholder="http://localhost:5000"
            spellCheck={false}
          />
          <span style={{ fontSize: '.7rem', color: 'var(--clr-muted)', marginTop: '2px' }}>
            ⚠️ Host &amp; port only — no path (e.g. <code style={{ color: 'var(--clr-primary-lt)' }}>http://localhost:5000</code>)
          </span>
        </div>
      </div>

      {/* Extra fields for Daily Summary */}
      {isDailySummary && (
        <div className="extra-params">
          <div className="field-group">
            <label className="field-label" htmlFor="student-email">
              Student Email <span style={{ color: 'var(--clr-danger)' }}>*</span>
            </label>
            <input
              id="student-email"
              type="email"
              className="field-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. student@example.com"
              autoComplete="email"
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="date">
              Date <span style={{ color: 'var(--clr-muted)' }}>(optional)</span>
            </label>
            <input
              id="date"
              type="date"
              className="field-input"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="start-date">
              Start Date <span style={{ color: 'var(--clr-muted)' }}>(optional)</span>
            </label>
            <input
              id="start-date"
              type="date"
              className="field-input"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="end-date">
              End Date <span style={{ color: 'var(--clr-muted)' }}>(optional)</span>
            </label>
            <input
              id="end-date"
              type="date"
              className="field-input"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <button
        id="btn-load-data"
        className="btn-load"
        onClick={onLoad}
        disabled={loading || (isDailySummary && !email.trim())}
        aria-busy={loading}
      >
        {loading
          ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2.5 }} /> Loading…</>
          : '⚡ Load Data'
        }
      </button>
    </section>
  );
}
