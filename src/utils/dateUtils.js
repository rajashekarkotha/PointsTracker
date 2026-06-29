const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const getMonthName = (month) => MONTH_NAMES[month - 1] ?? 'Unknown';

export const formatMonthYear = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

export const formatLocalizedDate = (isoDate) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};

export const sortByYearThenMonth = (rows = []) =>
  [...rows].sort((a, b) => a.year - b.year || a.month - b.month);

export const sortByPurchaseDate = (transactions = []) =>
  [...transactions].sort(
    (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
  );
