import { useMemo, useState } from 'react';
import { Input, SimpleSelect, OptionItem, IconSearchOutlined24, Typography } from '@nlmk/ds-2.0';
import { useApp } from '../context/AppContext.jsx';
import { CATEGORIES } from '../data/mockData';
import RiskCard from './RiskCard.jsx';

const ALL_CATEGORIES = 'Все категории';

export default function RiskRegistry() {
  const { risks } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const filtered = useMemo(() => {
    return risks.filter((r) => {
      const matchesCategory = category === ALL_CATEGORIES || r.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.event.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [risks, query, category]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            placeholder="Поиск риска"
            startIcon={<IconSearchOutlined24 />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ minWidth: 200 }}>
          <SimpleSelect value={category} onChange={setCategory}>
            <OptionItem value={ALL_CATEGORIES} label={ALL_CATEGORIES}>
              {ALL_CATEGORIES}
            </OptionItem>
            {CATEGORIES.map((c) => (
              <OptionItem key={c} value={c} label={c}>
                {c}
              </OptionItem>
            ))}
          </SimpleSelect>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Typography variant="Body2" color="var(--text-secondary)">
          Риски не найдены.
        </Typography>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((r) => (
            <RiskCard key={r.id} risk={r} />
          ))}
        </div>
      )}
    </div>
  );
}
