import {
  getMonthName,
  sortByYearThenMonth,
  sortByPurchaseDate,
} from '../utils/dateUtils';

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
