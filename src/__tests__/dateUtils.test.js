import { vi } from 'vitest';
import {
  getMonthName,
  sortByYearThenMonth,
  sortByPurchaseDate,
  formatLocalizedDate,
  isWithinDateRange,
} from '../utils/dateUtils';
import logger from '../utils/logger';

describe('getMonthName', () => {
  it('maps 1-indexed month numbers to names', () => {
    expect(getMonthName(1)).toBe('January');
    expect(getMonthName(12)).toBe('December');
  });

  it('falls back gracefully for an invalid month', () => {
    expect(getMonthName(13)).toBe('Unknown');
  });
});

describe('sortByYearThenMonth', () => {
  it('orders rows chronologically across a year boundary', () => {
    const rows = [
      { year: 2024, month: 2, label: 'Feb 2024' },
      { year: 2023, month: 12, label: 'Dec 2023' },
      { year: 2024, month: 1, label: 'Jan 2024' },
    ];

    const sorted = sortByYearThenMonth(rows);

    expect(sorted.map((row) => row.label)).toEqual([
      'Dec 2023',
      'Jan 2024',
      'Feb 2024',
    ]);
  });

  it('does not mutate the original array', () => {
    const rows = [{ year: 2024, month: 2 }, { year: 2023, month: 12 }];
    const original = [...rows];
    sortByYearThenMonth(rows);
    expect(rows).toEqual(original);
  });
});

describe('sortByPurchaseDate', () => {
  it('orders transactions from earliest to latest', () => {
    const transactions = [
      { purchaseDate: '2024-02-01', id: 'b' },
      { purchaseDate: '2023-12-01', id: 'a' },
    ];
    const sorted = sortByPurchaseDate(transactions);
    expect(sorted.map((transaction) => transaction.id)).toEqual(['a', 'b']);
  });

  it('does not mutate the original array', () => {
    const transactions = [
      { purchaseDate: '2024-02-01' },
      { purchaseDate: '2023-12-01' },
    ];
    const original = [...transactions];
    sortByPurchaseDate(transactions);
    expect(transactions).toEqual(original);
  });
});

describe('formatLocalizedDate', () => {
  it('formats a valid ISO date', () => {
    expect(formatLocalizedDate('2024-02-14')).toBe('02/14/2024');
  });

  it('logs a warning and returns a fallback for an invalid date instead of swallowing the error', () => {
    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    expect(formatLocalizedDate('not-a-date')).toBe('—');
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('isWithinDateRange', () => {
  it('returns true when no bounds are provided', () => {
    expect(isWithinDateRange('2024-02-14', '', '')).toBe(true);
  });

  it('respects a start-date lower bound', () => {
    expect(isWithinDateRange('2024-02-14', '2024-02-15', '')).toBe(false);
    expect(isWithinDateRange('2024-02-14', '2024-02-14', '')).toBe(true);
  });

  it('respects an end-date upper bound', () => {
    expect(isWithinDateRange('2024-02-14', '', '2024-02-13')).toBe(false);
    expect(isWithinDateRange('2024-02-14', '', '2024-02-14')).toBe(true);
  });

  it('returns false for an invalid date', () => {
    expect(isWithinDateRange('not-a-date', '', '')).toBe(false);
  });
});
