import { useState } from 'react';
import { SlideToggle, Status, Chip, Divider, Typography } from '@nlmk/ds-2.0';

const LESSON_STATUS_META = {
  draft: { color: 'default', icon: 'IconScheduleTimeWatchOutlined24', label: 'Черновик' },
  published: { color: 'success', icon: 'IconAllDoneDoubleCheckOutlined24', label: 'Опубликован' },
  archived: { color: 'grey', icon: 'IconBlockCloseOutlined24', label: 'Архив' },
};

function Field({ label, value }) {
  return (
    <div>
      <Typography variant="Caption" color="var(--text-secondary)" style={{ display: 'block', marginBottom: 2 }}>
        {label}
      </Typography>
      <Typography variant="Body2">{value}</Typography>
    </div>
  );
}

export default function LessonCard({ lesson }) {
  const [open, setOpen] = useState(false);
  const statusMeta = LESSON_STATUS_META[lesson.status];

  const header = (
    <div>
      <Typography variant="Caption" color="var(--text-secondary)">
        {lesson.id} · {lesson.category}
      </Typography>
      <Typography variant="Body1-Medium" style={{ display: 'block', marginTop: 2 }}>
        {lesson.title}
      </Typography>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {lesson.tags.map((t) => (
          <Chip key={t} color="brand" variant="outline" size="s">
            {t}
          </Chip>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius, 8px)', padding: '1rem' }}>
      <SlideToggle
        title={header}
        isShow={open}
        onToggle={() => setOpen((v) => !v)}
        after={
          <Status icon={statusMeta.icon} color={statusMeta.color} size="s">
            {statusMeta.label}
          </Status>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12 }}>
          <Field label="Проблема" value={lesson.problem} />
          <Divider />
          <Field label="Описание ситуации" value={lesson.description} />
          <Divider />
          <Field label="Корневая причина" value={lesson.rootCause} />
          <Divider />
          <Field label="Извлечённый урок" value={lesson.lessonLearned} />
          <Divider />
          <Field label="Рекомендация" value={lesson.recommendation} />
          <Typography variant="Caption" color="var(--text-secondary)">
            Автор: {lesson.author}
          </Typography>
        </div>
      </SlideToggle>
    </div>
  );
}
