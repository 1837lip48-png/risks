import { Typography } from '@nlmk/ds-2.0';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES, RISK_STATUSES } from '../data/mockData';
import { getRiskGrade } from '../utils/riskMatrix';
import { isMeasureOverdue } from '../utils/trafficLight';
import DonutChart from './DonutChart.jsx';
import BarChart from './BarChart.jsx';
import RiskMatrix from './RiskMatrix.jsx';

const STATUS_COLORS = {
  identification: 'var(--brand-sapphire-40, #7fa8f0)',
  analysis: 'var(--brand-sapphire-60, #2f6feb)',
  management: 'var(--spectrum-yellow-60, #e0a712)',
  monitoring: 'var(--spectrum-green-60, #2fa860)',
  closed: 'var(--steel-50, #a7adb4)',
};

function MetricCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius, 8px)', padding: '0.9rem' }}>
      <Typography variant="Caption" color="var(--text-secondary)" style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </Typography>
      <Typography variant="Heading3" color={color} style={{ display: 'block' }}>
        {value}
      </Typography>
    </div>
  );
}

export default function Dashboard() {
  const { risks } = useApp();
  const openRisks = risks.filter((r) => r.status !== 'closed');

  const outOfTolerance = openRisks.filter((r) => getRiskGrade(r.p, r.i) === 'H').length;
  const totalEl = openRisks.reduce((sum, r) => sum + (r.el || 0), 0);
  const overdueMeasures = risks.reduce((sum, r) => sum + r.measures.filter(isMeasureOverdue).length, 0);
  const newRisks = risks.filter((r) => r.isNew).length;

  const donutData = RISK_STATUSES.map((s) => ({
    label: s.label,
    value: risks.filter((r) => r.status === s.value).length,
    color: STATUS_COLORS[s.value],
  })).filter((d) => d.value > 0);

  const barData = CATEGORIES.map((c) => ({
    label: c,
    value: risks.filter((r) => r.category === c).length,
  }));

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
          marginBottom: 24,
        }}
      >
        <MetricCard label="Открытых рисков" value={openRisks.length} />
        <MetricCard label="Вне толеранса" value={outOfTolerance} color="var(--text-danger, #c4302b)" />
        <MetricCard label="Совокупный EL" value={`${totalEl} млн ₽`} />
        <MetricCard label="Просрочено мероприятий" value={overdueMeasures} color="var(--text-danger, #c4302b)" />
        <MetricCard label="Новые риски" value={newRisks} color="var(--brand-sapphire-60, #2f6feb)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div>
          <Typography variant="Body1-Medium" style={{ display: 'block', marginBottom: 12 }}>
            Структура рисков по статусам
          </Typography>
          <DonutChart data={donutData} />
        </div>
        <div>
          <Typography variant="Body1-Medium" style={{ display: 'block', marginBottom: 12 }}>
            Риски по категориям
          </Typography>
          <BarChart data={barData} />
        </div>
      </div>

      <div>
        <Typography variant="Body1-Medium" style={{ display: 'block', marginBottom: 12 }}>
          Матрица рисков P × I (упрощённая)
        </Typography>
        <RiskMatrix risks={openRisks} />
      </div>
    </div>
  );
}
