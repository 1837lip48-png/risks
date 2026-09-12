// Упрощённая классификация уровня риска по сетке 3x3 (P x I).
// Это иллюстративная сетка для прототипа, а не расчёт EL/RRA по методике.
const GRADE_GRID = {
  1: { 1: 'L', 2: 'L', 3: 'M' },
  2: { 1: 'L', 2: 'M', 3: 'H' },
  3: { 1: 'M', 2: 'H', 3: 'H' },
};

export function getRiskGrade(p, i) {
  return GRADE_GRID[p]?.[i] || 'M';
}

export const GRADE_COLORS = {
  L: { bg: 'var(--bg-success, #e4f6ea)', text: 'var(--text-success, #1a8a4a)' },
  M: { bg: 'var(--bg-warning, #fdf1d8)', text: 'var(--text-warning, #b3720a)' },
  H: { bg: 'var(--bg-danger, #fbe4e4)', text: 'var(--text-danger, #c4302b)' },
};

export function buildMatrix(risks) {
  const cells = [];
  for (let p = 3; p >= 1; p -= 1) {
    for (let i = 1; i <= 3; i += 1) {
      const grade = getRiskGrade(p, i);
      const count = risks.filter((r) => r.p === p && r.i === i).length;
      cells.push({ p, i, grade, count });
    }
  }
  return cells;
}
