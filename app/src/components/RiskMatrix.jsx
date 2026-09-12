import { Legend, Typography } from '@nlmk/ds-2.0';
import { buildMatrix, GRADE_COLORS } from '../utils/riskMatrix';

const LEGEND_ITEMS = [
  { grade: 'L', label: 'L — низкий', color: { default: 'var(--spectrum-green-60, #2fa860)' } },
  { grade: 'M', label: 'M — средний', color: { default: 'var(--spectrum-yellow-60, #e0a712)' } },
  { grade: 'H', label: 'H — высокий', color: { default: 'var(--spectrum-red-60, #d64444)' } },
];

export default function RiskMatrix({ risks }) {
  const cells = buildMatrix(risks);

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        <div style={{ width: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, maxWidth: 260, flex: 1 }}>
          {[1, 2, 3].map((i) => (
            <Typography key={i} variant="Caption" style={{ textAlign: 'center', display: 'block' }}>
              I={i}
            </Typography>
          ))}
        </div>
      </div>
      {[3, 2, 1].map((p) => (
        <div key={p} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
          <div style={{ width: 20 }}>
            <Typography variant="Caption">{`P=${p}`}</Typography>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, maxWidth: 260, flex: 1 }}>
            {cells
              .filter((c) => c.p === p)
              .map((c) => (
                <div
                  key={`${c.p}-${c.i}`}
                  style={{
                    background: GRADE_COLORS[c.grade].bg,
                    color: GRADE_COLORS[c.grade].text,
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '10px 4px',
                    textAlign: 'center',
                    borderRadius: 4,
                  }}
                >
                  {c.grade} · {c.count}
                </div>
              ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
        {LEGEND_ITEMS.map((item) => (
          <Legend key={item.grade} type="VIEW" color={item.color} label={item.label} isDisabled />
        ))}
      </div>
    </div>
  );
}
