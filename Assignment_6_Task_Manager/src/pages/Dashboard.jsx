import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Layers, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { StatCard } from '../components/StatCard';
import { TaskCard } from '../components/TaskCard';

export const Dashboard = () => {
  const { tasks, deleteTask } = useTasks();

  const total = tasks.length;
  const raised = tasks.filter(t => t.status === 'Raised').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const closed = tasks.filter(t => t.status === 'Closed').length;
  const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Closed').length;

  const academic = tasks.filter(t => t.category === 'Academic').length;
  const personal = tasks.filter(t => t.category === 'Personal').length;

  const completionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  // Recent 4 active tasks
  const recentTasks = tasks.slice(0, 4);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <span>Task Analytics Dashboard</span>
          </h1>
          <p>Real-time telemetry, routing status, and workload breakdown.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/tasks" className="btn btn-secondary">
            <span>View All Tasks</span>
          </Link>
          <Link to="/add-task" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Total Tasks" 
          value={total} 
          subtext="All tracked work items"
          icon={Layers}
          color="99, 102, 241"
          percentage={100}
        />
        <StatCard 
          title="Raised" 
          value={raised} 
          subtext="Freshly logged & awaiting action"
          icon={AlertCircle}
          color="168, 85, 247"
          percentage={total ? (raised / total) * 100 : 0}
        />
        <StatCard 
          title="In Progress (Pending)" 
          value={pending} 
          subtext="Currently undergoing execution"
          icon={Clock}
          color="245, 158, 11"
          percentage={total ? (pending / total) * 100 : 0}
        />
        <StatCard 
          title="Completed (Closed)" 
          value={closed} 
          subtext={`${completionRate}% overall completion velocity`}
          icon={CheckCircle2}
          color="16, 185, 129"
          percentage={completionRate}
        />
      </div>

      {/* Category Breakdown & High Priority Banner */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2.5rem' 
        }}
      >
        {/* Category distribution card */}
        <div 
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.5rem' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Category Distribution</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Task Allocation</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#c7d2fe', fontWeight: 600 }}>Academic</span>
                <span style={{ color: 'var(--text-secondary)' }}>{academic} tasks ({total ? Math.round((academic / total) * 100) : 0}%)</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.06)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (academic / total) * 100 : 0}%`, height: '100%', background: '#6366f1' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#f5d0fe', fontWeight: 600 }}>Personal</span>
                <span style={{ color: 'var(--text-secondary)' }}>{personal} tasks ({total ? Math.round((personal / total) * 100) : 0}%)</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.06)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (personal / total) * 100 : 0}%`, height: '100%', background: '#d946ef' }} />
              </div>
            </div>
          </div>
        </div>

        {/* High priority reminder card */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(19, 27, 46, 0.8))', 
            border: '1px solid rgba(244, 63, 94, 0.3)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fda4af', marginBottom: '0.5rem' }}>
              <Flame size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Urgent Attention
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              {highPriority} High Priority Task{highPriority !== 1 ? 's' : ''} Open
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Active tasks marked as High Priority requiring resolution before their scheduled deadlines.
            </p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Link to="/tasks?priority=High" className="btn btn-secondary btn-sm" style={{ border: '1px solid rgba(244, 63, 94, 0.4)' }}>
              <span>Filter High Priority Tasks</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Recent Tasks</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Latest tasks recorded in the system</p>
          </div>
          <Link to="/tasks" className="btn btn-secondary btn-sm">
            <span>Explore All ({total})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <div className="tasks-grid">
            {recentTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDeleteClick={(t) => deleteTask(t.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
            <h3 className="empty-title">No tasks recorded yet</h3>
            <p className="empty-desc">Your task list is clean and empty. Create your first task to begin tracking.</p>
            <Link to="/add-task" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              <span>Create Your First Task</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
