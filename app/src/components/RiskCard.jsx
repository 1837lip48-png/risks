import { Card, Badge, Status, Accordion, Divider, Avatar, Typography } from '@nlmk/ds-2.0';
import { getRiskTrafficLight, TRAFFIC_LIGHT_META, isMeasureOverdue } from '../utils/trafficLight';
import { getRiskGrade, GRADE_COLORS } from '../utils/riskMatrix';
import { RISK_STATUSES, MEASURE_STATUSES } from '../data/mockData';

const RISK_STATUS_META = {
  identification: { color: 'default', icon: 'IconCircleOutlined24' },
  analysis: { color: 'default', icon: 'IconAnalyticsOutlined24' },
  management: { color: 'warning', icon: 'IconScheduleTimeWatchOutlined24' },
  monitoring: { color: 'success', icon: 'IconAllDoneDoubleCheckOutlined24' },
  closed: { color: 'grey', icon: 'IconBlockCloseOutlined24' },
};

const MEASURE_STATUS_META = {
  planned: { color: 'default', icon: 'IconScheduleTimeWatchOutlined24' },
  in_progress: { color: 'warning', icon: 'IconAutoRenewReloadOutlined24' },
  done: { color: 'success', icon: 'IconAllDoneDoubleCheckOutlined24' },
  rejected: { color: 'error', icon: 'IconBlockCloseOutlined24' },
};

function statusLabel(list, value) {
  return list.find((s) => s.value === value)?.label || value;
}

function MeasuresTable({ measures }) {
  if (measures.length === 0) {
    return (
      <Typography variant="Body2" color="var(--text-secondary)">
        Мероприятия ещё не запланированы.
      </Typography>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {measures.map((m) => {
        const overdue = isMeasureOverdue(m);
        const meta = MEASURE_STATUS_META[m.status];
        return (
          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Typography variant="Body2" style={{ flex: 1 }}>
              {m.title}
            </Typography>
            <Typography variant="Caption" color={overdue ? 'var(--text-danger, #c4302b)' : 'var(--text-secondary)'}>
              {overdue ? `просрочено · ${m.dueDate}` : m.dueDate}
            </Typography>
            <Status icon={overdue ? 'IconAttentionWarningAlertOutlined24' : meta.icon} color={overdue ? 'error' : meta.color} size="s">
              {statusLabel(MEASURE_STATUSES, m.status)}
            </Status>
          </div>
        );
      })}
    </div>
  );
}

export default function RiskCard({ risk }) {
  const light = getRiskTrafficLight(risk);
  const lightMeta = TRAFFIC_LIGHT_META[light];
  const grade = getRiskGrade(risk.p, risk.i);
  const statusMeta = RISK_STATUS_META[risk.status];

  const accordionItems = [
    {
      id: risk.id,
      title: `Мероприятия (${risk.measures.length})`,
      content: <MeasuresTable measures={risk.measures} />,
    },
  ];

  return (
    <Card orientation="horizontal" indicatorSize="m" indicatorStatus={lightMeta.indicatorStatus} className="card-hover">
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Typography variant="Caption" color="var(--text-secondary)">
                {risk.id} · {risk.category}
              </Typography>
              {risk.isNew && <Badge color="brand" size="s">Новый</Badge>}
              <span
                title={lightMeta.label}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: lightMeta.dotColor,
                  display: 'inline-block',
                }}
              />
            </div>
            <Typography variant="Body1-Medium" style={{ display: 'block', marginTop: 4 }}>
              {risk.title}
            </Typography>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span
              style={{
                display: 'inline-block',
                background: GRADE_COLORS[grade].bg,
                color: GRADE_COLORS[grade].text,
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              {grade}
            </span>
            <div>
              <Status icon={statusMeta.icon} color={statusMeta.color} size="s">
                {statusLabel(RISK_STATUSES, risk.status)}
              </Status>
            </div>
          </div>
        </div>

        <Divider />

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Typography variant="Caption" color="var(--text-secondary)" style={{ display: 'block' }}>
              Риск-событие
            </Typography>
            <Typography variant="Body2">{risk.event}</Typography>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Typography variant="Caption" color="var(--text-secondary)" style={{ display: 'block' }}>
              Прямое следствие
            </Typography>
            <Typography variant="Body2">{risk.consequence}</Typography>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {risk.owner ? (
            <>
              <Avatar
                size="s"
                userName={risk.owner.split(' ')[1] || risk.owner}
                userSurname={risk.owner.split(' ')[0]}
              />
              <Typography variant="Caption">{risk.owner}</Typography>
            </>
          ) : (
            <Typography variant="Caption" color="var(--text-secondary)">
              Владелец не назначен
            </Typography>
          )}
        </div>

        <Accordion
          items={accordionItems}
          size="s"
          variant="paper"
          multipleExpanded={false}
        />
      </div>
    </Card>
  );
}
