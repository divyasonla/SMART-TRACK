const TABS = [
  { id: 'goals',        label: '🎯 Goals' },
  { id: 'reflections',  label: '💡 Reflections' },
  { id: 'progress',     label: '📈 Progress' },
  { id: 'daily-summary',label: '📋 Daily Summary' },
];

export default function Tabs({ active, onChange }) {
  return (
    <nav className="tabs" role="tablist" aria-label="Data sections">
      {TABS.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab-btn ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
