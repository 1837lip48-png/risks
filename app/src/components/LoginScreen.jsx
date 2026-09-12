import { useState } from 'react';
import { Input, Button, Typography } from '@nlmk/ds-2.0';
import SppModal from './SppModal.jsx';
import InitiatorForm from './InitiatorForm.jsx';
import { useApp } from '../context/AppContext.jsx';

const ROLES = [
  { value: 'risk_manager', title: 'Риск-менеджер', description: 'Владелец реестра рисков проекта' },
  { value: 'initiator', title: 'Инициатор', description: 'Предлагает риски по проекту' },
];

function RoleCard({ role, selected, onSelect }) {
  return (
    <div
      className="clickable"
      onClick={() => onSelect(role.value)}
      style={{
        border: selected ? '1.5px solid var(--border-accent, #2f6feb)' : '0.5px solid var(--border, #d7dbe0)',
        background: selected ? 'var(--surface-accent-subtle, #eef4ff)' : 'var(--surface-1, #fff)',
        borderRadius: 'var(--radius, 8px)',
        padding: '10px 12px',
      }}
    >
      <Typography variant="Body1-Medium" style={{ display: 'block' }}>
        {role.title}
      </Typography>
      <Typography variant="Body2" color="var(--text-secondary)" style={{ display: 'block' }}>
        {role.description}
      </Typography>
    </div>
  );
}

export default function LoginScreen() {
  const { setUser, addRisk } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [sppOpen, setSppOpen] = useState(false);
  const [step, setStep] = useState('login'); // login | initiator-form

  const fullName = `${firstName} ${lastName}`.trim();

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim() || !role) {
      setError('Заполните имя, фамилию и выберите роль.');
      return;
    }
    setError('');
    setSppOpen(true);
  };

  const handleSppConfirm = (ppNumber) => {
    setSppOpen(false);
    if (role === 'initiator') {
      setStep('initiator-form');
      return;
    }
    setUser({ firstName, lastName, role, ppNumber });
  };

  const handleInitiatorSubmit = (draft) => {
    setUser({ firstName, lastName, role, ppNumber: 'без изменений' });
    addRisk({ ...draft, owner: draft.owner || fullName });
  };

  if (step === 'initiator-form') {
    return (
      <div className="app-page">
        <InitiatorForm authorName={fullName} onSubmit={handleInitiatorSubmit} />
      </div>
    );
  }

  return (
    <div className="app-page" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 360, width: '100%', background: 'var(--surface-1)', borderRadius: 12, padding: '1.5rem' }}>
        <Typography variant="Heading4" style={{ display: 'block', marginBottom: 4 }}>
          RiskLesson
        </Typography>
        <Typography variant="Body2" color="var(--text-secondary)" style={{ display: 'block', marginBottom: 20 }}>
          Идентификация пользователя
        </Typography>

        <div style={{ marginBottom: 12 }}>
          <Input label="Имя" placeholder="Иван" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Input label="Фамилия" placeholder="Петров" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <Typography variant="Body2" color="var(--text-secondary)" style={{ display: 'block', marginBottom: 8 }}>
          Роль
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {ROLES.map((r) => (
            <RoleCard key={r.value} role={r} selected={role === r.value} onSelect={setRole} />
          ))}
        </div>

        {error && (
          <Typography variant="Body2" color="var(--text-danger, #d64444)" style={{ display: 'block', marginBottom: 12 }}>
            {error}
          </Typography>
        )}

        <Button variant="primary" color="brand" style={{ width: '100%' }} onClick={handleContinue}>
          Продолжить
        </Button>
      </div>

      <SppModal isOpen={sppOpen} onClose={() => setSppOpen(false)} onConfirm={handleSppConfirm} />
    </div>
  );
}
