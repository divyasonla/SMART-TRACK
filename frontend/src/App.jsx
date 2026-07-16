import { useState, useCallback, useEffect } from 'react';

import Header          from './components/Header';
import Tabs            from './components/Tabs';
import ControlPanel    from './components/ControlPanel';
import GoalsList       from './components/GoalsList';
import ReflectionsList from './components/ReflectionsList';
import ProgressList    from './components/ProgressList';
import DailySummary    from './components/DailySummary';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  IdleState,
} from './components/StatusStates';

import {
  fetchGoals,
  fetchReflections,
  fetchProgress,
  fetchDailySummary,
} from './api';
import { extractArray } from './utils';

const DEFAULT_BASE = 'http://localhost:5000';

export default function App() {
  /* -- Tab state -- */
  const [activeTab, setActiveTab] = useState('goals');

  /* -- Config state -- */
  const [baseUrl,    setBaseUrl]    = useState(() => localStorage.getItem('baseUrl') || DEFAULT_BASE);
  const [email,      setEmail]      = useState(() => localStorage.getItem('email') || '');
  const [date,       setDate]       = useState('');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');

  /* -- Synchronise config state to localStorage -- */
  useEffect(() => {
    localStorage.setItem('baseUrl', baseUrl);
  }, [baseUrl]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  /* -- Fetch state -- */
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [data,    setData]    = useState(null);
  const [errMsg,  setErrMsg]  = useState('');

  /* -- Switch tab (reset results) -- */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setStatus('idle');
    setData(null);
    setErrMsg('');
  }, []);

  /* -- Load Data -- */
  const handleLoad = useCallback(async () => {
    const base = baseUrl.replace(/\/+$/, ''); // strip trailing slash
    setStatus('loading');
    setData(null);
    setErrMsg('');

    try {
      let result;
      switch (activeTab) {
        case 'goals':
          result = await fetchGoals(base);
          break;
        case 'reflections':
          result = await fetchReflections(base);
          break;
        case 'progress':
          result = await fetchProgress(base);
          break;
        case 'daily-summary':
          result = await fetchDailySummary(base, email, date, startDate, endDate);
          break;
        default:
          throw new Error('Unknown tab');
      }
      setData(result);
      setStatus('success');
    } catch (err) {
      console.error('[SMART-TRACK]', err);
      setErrMsg(err.message || 'Network error. Is the backend running?');
      setStatus('error');
    }
  }, [activeTab, baseUrl, email, date, startDate, endDate]);

  /* -- Render data section -- */
  function renderContent() {
    if (status === 'idle')    return <IdleState />;
    if (status === 'loading') return <LoadingState />;
    if (status === 'error')   return <ErrorState message={errMsg} />;

    // success
    if (activeTab === 'daily-summary') {
      return <DailySummary data={data} />;
    }

    const items = extractArray(data);
    if (!items.length) return <EmptyState label={activeTab} />;

    switch (activeTab) {
      case 'goals':        return <GoalsList       items={items} />;
      case 'reflections':  return <ReflectionsList items={items} />;
      case 'progress':     return <ProgressList    items={items} />;
      default:             return null;
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="main-content">
        <Tabs active={activeTab} onChange={handleTabChange} />

        <ControlPanel
          activeTab={activeTab}
          baseUrl={baseUrl}         setBaseUrl={setBaseUrl}
          email={email}             setEmail={setEmail}
          date={date}               setDate={setDate}
          startDate={startDate}     setStartDate={setStartDate}
          endDate={endDate}         setEndDate={setEndDate}
          loading={status === 'loading'}
          onLoad={handleLoad}
        />

        <section aria-label="Results" aria-live="polite">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
