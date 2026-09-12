import { Header, Tabs } from '@nlmk/ds-2.0';
import { useApp } from '../context/AppContext.jsx';
import Dashboard from './Dashboard.jsx';
import RiskRegistry from './RiskRegistry.jsx';
import LessonRegistry from './LessonRegistry.jsx';

export default function AppShell() {
  const { user, logout, activeTab, setActiveTab, risks } = useApp();
  const openRisksCount = risks.filter((r) => r.status !== 'closed').length;

  const roleLabel = user.role === 'risk_manager' ? 'Риск-менеджер' : 'Инициатор';

  return (
    <div>
      <Header
        title={`RiskLesson · СПП ${user.ppNumber}`}
        showBack={false}
        breadcrumbs={
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {user.firstName} {user.lastName} · {roleLabel}
          </span>
        }
      />
      <div className="app-shell">
        <div className="app-page" style={{ marginBottom: 16 }}>
          <Tabs>
            <Tabs.Tab
              key="dashboard"
              label="Дашборд"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <Tabs.Tab
              key="risks"
              label="Реестр рисков"
              active={activeTab === 'risks'}
              hasBadge
              badgeChildren={openRisksCount}
              onClick={() => setActiveTab('risks')}
            />
            <Tabs.Tab
              key="lessons"
              label="Реестр уроков"
              active={activeTab === 'lessons'}
              onClick={() => setActiveTab('lessons')}
            />
          </Tabs>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'risks' && <RiskRegistry />}
        {activeTab === 'lessons' && <LessonRegistry />}

        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
