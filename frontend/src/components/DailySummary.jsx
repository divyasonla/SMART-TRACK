import GoalsList       from './GoalsList';
import ReflectionsList from './ReflectionsList';
import ProgressList    from './ProgressList';
import { EmptyState }  from './StatusStates';
import { extractArray } from '../utils';

function SectionHeader({ tag, tagClass, title, count }) {
  return (
    <div className="section-heading">
      <span className={`summary-tag ${tagClass}`}>{tag}</span>
      {title}
      {count !== undefined && (
        <span style={{ fontSize: '.75rem', color: 'var(--clr-muted)', marginLeft: 6 }}>
          ({count})
        </span>
      )}
    </div>
  );
}

export default function DailySummary({ data }) {
  // Support both flat and nested response shapes
  const goals       = extractArray(data?.goals)       || [];
  const reflections = extractArray(data?.reflections) || [];
  const progress    = extractArray(data?.progress)    || [];

  const hasGoals       = goals.length > 0;
  const hasReflections = reflections.length > 0;
  const hasProgress    = progress.length > 0;

  if (!hasGoals && !hasReflections && !hasProgress) {
    return <EmptyState label="summary data" />;
  }

  return (
    <div className="summary-sections">
      {/* Goals */}
      <div className="summary-section">
        <SectionHeader
          tag="Goals"
          tagClass="summary-tag-goals"
          title="Goals"
          count={goals.length}
        />
        {hasGoals
          ? <GoalsList items={goals} />
          : <EmptyState label="goals" />
        }
      </div>

      {/* Reflections */}
      <div className="summary-section">
        <SectionHeader
          tag="Reflections"
          tagClass="summary-tag-reflections"
          title="Reflections"
          count={reflections.length}
        />
        {hasReflections
          ? <ReflectionsList items={reflections} />
          : <EmptyState label="reflections" />
        }
      </div>

      {/* Progress */}
      <div className="summary-section">
        <SectionHeader
          tag="Progress"
          tagClass="summary-tag-progress"
          title="Progress"
          count={progress.length}
        />
        {hasProgress
          ? <ProgressList items={progress} />
          : <EmptyState label="progress records" />
        }
      </div>
    </div>
  );
}
