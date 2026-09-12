// Упрощённая функция светофора риска (не является методикой из инструкции):
// красный — есть просроченное мероприятие; синий — все мероприятия выполнены;
// жёлтый — мероприятий ещё нет ИЛИ есть мероприятия в работе без просрочки.
export function getRiskTrafficLight(risk) {
  const measures = risk.measures || [];
  if (measures.length === 0) {
    return 'yellow';
  }
  const today = new Date();
  const isOverdue = (m) => m.status !== 'done' && m.status !== 'rejected' && new Date(m.dueDate) < today;
  if (measures.some(isOverdue)) {
    return 'red';
  }
  if (measures.every((m) => m.status === 'done')) {
    return 'blue';
  }
  return 'yellow';
}

export const TRAFFIC_LIGHT_META = {
  red: { indicatorStatus: 'error', dotColor: 'var(--spectrum-red-60)', label: 'Есть просрочка' },
  blue: { indicatorStatus: 'info', dotColor: 'var(--brand-sapphire-60)', label: 'Все мероприятия выполнены' },
  yellow: { indicatorStatus: 'warning', dotColor: 'var(--spectrum-yellow-60)', label: 'В работе' },
};

export function isMeasureOverdue(measure) {
  return measure.status !== 'done' && measure.status !== 'rejected' && new Date(measure.dueDate) < new Date();
}
