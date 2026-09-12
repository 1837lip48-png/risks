import { useState } from 'react';
import { Input, SimpleSelect, OptionItem, Button, Typography } from '@nlmk/ds-2.0';
import { CATEGORIES } from '../data/mockData';

const emptyDraft = { category: '', title: '', event: '', consequence: '', owner: '' };

export default function InitiatorForm({ authorName, onSubmit }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState('');

  const setField = (field) => (value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleInputChange = (field) => (e) => setField(field)(e.target.value);

  const handleSubmit = () => {
    if (!draft.category || !draft.title.trim() || !draft.event.trim() || !draft.consequence.trim()) {
      setError('Заполните категорию, наименование, риск-событие и следствие.');
      return;
    }
    onSubmit(draft);
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', background: 'var(--surface-1)', borderRadius: 12, padding: '1.5rem' }}>
      <Typography variant="Heading4" style={{ display: 'block', marginBottom: 4 }}>
        Подать риск
      </Typography>
      <Typography variant="Body2" color="var(--text-secondary)" style={{ display: 'block', marginBottom: 20 }}>
        Инициатор: {authorName}
      </Typography>

      <div style={{ marginBottom: 12 }}>
        <SimpleSelect
          label="Категория риска"
          value={draft.category}
          onChange={setField('category')}
        >
          {CATEGORIES.map((c) => (
            <OptionItem key={c} value={c} label={c}>
              {c}
            </OptionItem>
          ))}
        </SimpleSelect>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Input label="Наименование риска" placeholder="Короткий самодостаточный заголовок" value={draft.title} onChange={handleInputChange('title')} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Input label="Риск-событие" placeholder="Что именно может произойти" value={draft.event} onChange={handleInputChange('event')} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Input label="Прямое следствие" placeholder="К чему это приведёт для проекта" value={draft.consequence} onChange={handleInputChange('consequence')} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input label="Предполагаемый владелец (необязательно)" placeholder="ФИО" value={draft.owner} onChange={handleInputChange('owner')} />
      </div>

      {error && (
        <Typography variant="Body2" color="var(--text-danger, #d64444)" style={{ display: 'block', marginBottom: 12 }}>
          {error}
        </Typography>
      )}

      <Button variant="primary" color="brand" style={{ width: '100%' }} onClick={handleSubmit}>
        Отправить риск
      </Button>
    </div>
  );
}
