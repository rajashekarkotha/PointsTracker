import dayjs from 'dayjs';
import logger from './logger';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const getMonthName = (month) => MONTH_NAMES[month - 1] ?? 'Unknown';

export const formatMonthYear = (year, month) =>
  dayjs(`${year}-${String(month).padStart(2, '0')}-01`).format('MMMM YYYY');

export const formatLocalizedDate = (isoDate) => {
  const date = dayjs(isoDate);

  if (!date.isValid()) {
    logger.warn(`formatLocalizedDate: received an invalid date value "${isoDate}"`);
    return '—';
  }

  return date.format('MM/DD/YYYY');
};

export const isWithinDateRange = (isoDate, startDate, endDate) => {
  const date = dayjs(isoDate);
  if (!date.isValid()) return false;

  if (startDate && date.isBefore(dayjs(startDate), 'day')) return false;
  if (endDate && date.isAfter(dayjs(endDate), 'day')) return false;

  return true;
};

export const sortByYearThenMonth = (rows = []) =>
  [...rows].sort((a, b) => a.year - b.year || a.month - b.month);

export const sortByPurchaseDate = (transactions = []) =>
  [...transactions].sort(
    (a, b) => dayjs(a.purchaseDate).valueOf() - dayjs(b.purchaseDate).valueOf()
  );
