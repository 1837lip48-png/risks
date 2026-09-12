import { useState } from 'react';
import { Modal, Input, Button, Typography } from '@nlmk/ds-2.0';

const SPP_PATTERN = /^\d{2}-\d{4}$/;

function formatSpp(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

export default function SppModal({ isOpen, onClose, onConfirm }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setValue(formatSpp(e.target.value));
    setError(false);
  };

  const handleSubmit = () => {
    if (!SPP_PATTERN.test(value)) {
      setError(true);
      return;
    }
    onConfirm(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} disableBackdropClick>
      <div style={{ padding: '24px', width: 320 }}>
        <Typography variant="Heading4" style={{ display: 'block', marginBottom: 4 }}>
          Введите СПП проекта
        </Typography>
        <Typography variant="Body2" color="var(--text-secondary)" style={{ display: 'block', marginBottom: 16 }}>
          Формат: XX-XXXX, например 19-1991
        </Typography>
        <Input
          label="Номер СПП"
          placeholder="19-1991"
          value={value}
          onChange={handleChange}
          helperText={error ? 'Нужно 6 цифр в формате XX-XXXX' : undefined}
          color={error ? 'error' : undefined}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Button variant="secondary" color="grey" style={{ flex: 1 }} onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" color="brand" style={{ flex: 1 }} onClick={handleSubmit}>
            Войти в систему
          </Button>
        </div>
      </div>
    </Modal>
  );
}
