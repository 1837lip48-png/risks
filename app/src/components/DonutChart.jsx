import { Typography } from '@nlmk/ds-2.0';

const RADIUS = 60;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let offset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <g transform="translate(80,80) rotate(-90)">
          <circle r={RADIUS} fill="none" stroke="var(--surface-2, #eceef1)" strokeWidth={STROKE} />
          {data.map((d) => {
            const fraction = d.value / total;
            const dash = fraction * CIRCUMFERENCE;
            const circle = (
              <circle
                key={d.label}
                r={RADIUS}
                fill="none"
                stroke={d.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return circle;
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="500" fill="var(--text-primary, #1c1f24)">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" fontSize="11" fill="var(--text-secondary, #71767d)">
          рисков
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: 'inline-block' }} />
            <Typography variant="Body2">{`${d.label} — ${d.value}`}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
