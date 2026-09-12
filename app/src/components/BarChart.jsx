import { Typography } from '@nlmk/ds-2.0';

export default function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d) => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 110, flexShrink: 0 }}>
            <Typography variant="Caption">{d.label}</Typography>
          </div>
          <div style={{ flex: 1, background: 'var(--surface-2, #eceef1)', borderRadius: 4, height: 14, position: 'relative' }}>
            <div
              style={{
                width: `${(d.value / max) * 100}%`,
                background: 'var(--brand-sapphire-60, #2f6feb)',
                height: '100%',
                borderRadius: 4,
                minWidth: d.value > 0 ? 4 : 0,
              }}
            />
          </div>
          <div style={{ width: 20, textAlign: 'right' }}>
            <Typography variant="Caption-Medium">{d.value}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
