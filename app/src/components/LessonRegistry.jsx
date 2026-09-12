import { useMemo, useState } from 'react';
import { Input, IconSearchOutlined24, Typography } from '@nlmk/ds-2.0';
import { useApp } from '../context/AppContext.jsx';
import LessonCard from './LessonCard.jsx';

export default function LessonRegistry() {
  const { lessons } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [lessons, query]);

  return (
    <div>
      <div style={{ marginBottom: 16, maxWidth: 360 }}>
        <Input
          placeholder="Введите ключевое слово или тег"
          startIcon={<IconSearchOutlined24 />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Typography variant="Body2" color="var(--text-secondary)">
          Уроки не найдены.
        </Typography>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </div>
      )}
    </div>
  );
}
