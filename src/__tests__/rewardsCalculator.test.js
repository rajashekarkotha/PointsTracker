import {
  calculateTransactionPoints,
  attachRewardPoints,
  aggregateMonthlyRewards,
  aggregateTotalRewards,
  buildMonthKey,
} from '../utils/rewardsCalculator';

describe('calculateTransactionPoints', () => {
  it('awards 0 points for purchases of $50 or less', () => {
    expect(calculateTransactionPoints(0)).toBe(0);
    expect(calculateTransactionPoints(25)).toBe(0);
    expect(calculateTransactionPoints(50)).toBe(0);
  });

  it('awards 1 point per dollar between $50 and $100', () => {
    expect(calculateTransactionPoints(75)).toBe(25);
    expect(calculateTransactionPoints(100)).toBe(50);
  });

  it('awards 2 points per dollar over $100, plus the tier-2 points', () => {
    // The example given in the assignment: $120 = (2x20) + (1x50) = 90
    expect(calculateTransactionPoints(120)).toBe(90);
    expect(calculateTransactionPoints(220)).toBe(290); // (2*120)+(1*50)
  });

  it('handles fractional dollar amounts by flooring the final point total', () => {
    expect(calculateTransactionPoints(100.2)).toBe(50);
    expect(calculateTransactionPoints(100.4)).toBe(50);
  });

  it('treats negative, NaN, or non-numeric input as 0 points', () => {
    expect(calculateTransactionPoints(-50)).toBe(0);
    expect(calculateTransactionPoints(NaN)).toBe(0);
    expect(calculateTransactionPoints(undefined)).toBe(0);
    expect(calculateTransactionPoints('120')).toBe(0);
  });

  it('does not mutate its input', () => {
    const amount = 120;
    calculateTransactionPoints(amount);
    expect(amount).toBe(120);
  });
});

describe('buildMonthKey', () => {
  it('pads single-digit months and distinguishes different years', () => {
    expect(buildMonthKey(2023, 12)).toBe('2023-12');
    expect(buildMonthKey(2024, 1)).toBe('2024-01');
    expect(buildMonthKey(2023, 12)).not.toBe(buildMonthKey(2024, 12));
  });
});

describe('attachRewardPoints', () => {
  it('returns a new array and does not mutate the original transactions', () => {
    const transactions = [{ price: 120 }];
    const result = attachRewardPoints(transactions);

    expect(result).not.toBe(transactions);
    expect(transactions[0].rewardPoints).toBeUndefined();
    expect(result[0].rewardPoints).toBe(90);
  });

  it('returns an empty array when given no transactions', () => {
    expect(attachRewardPoints()).toEqual([]);
    expect(attachRewardPoints([])).toEqual([]);
  });
});

describe('aggregateMonthlyRewards', () => {
  const transactions = [
    { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2023-12-05', price: 120 },
    { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2023-12-20', price: 80 },
    { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2024-01-10', price: 60 },
    { customerId: 'C2', customerName: 'Grace Hopper', purchaseDate: '2024-01-15', price: 200 },
  ];

  it('sums points per customer, per month AND year (not just month)', () => {
    const result = aggregateMonthlyRewards(transactions);

    const adaDecember2023 = result.find(
      (row) => row.customerId === 'C1' && row.year === 2023 && row.month === 12
    );
    const adaJanuary2024 = result.find(
      (row) => row.customerId === 'C1' && row.year === 2024 && row.month === 1
    );

    // Dec: 90 (from $120) + 30 (from $80) = 120
    expect(adaDecember2023.rewardPoints).toBe(120);
    // Jan: 10 points from $60
    expect(adaJanuary2024.rewardPoints).toBe(10);
  });

  it('keeps December of one year separate from December of another year', () => {
    const crossYear = [
      { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2022-12-05', price: 100 },
      { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2023-12-05', price: 200 },
    ];
    const result = aggregateMonthlyRewards(crossYear);
    expect(result).toHaveLength(2);
  });

  it('does not depend on exactly three months being present', () => {
    const oneMonth = [transactions[0]];
    const result = aggregateMonthlyRewards(oneMonth);
    expect(result).toHaveLength(1);
  });

  it('returns an empty array for no transactions', () => {
    expect(aggregateMonthlyRewards([])).toEqual([]);
  });
});

describe('aggregateTotalRewards', () => {
  const transactions = [
    { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2023-12-05', price: 120 },
    { customerId: 'C1', customerName: 'Ada Lovelace', purchaseDate: '2024-01-10', price: 60 },
    { customerId: 'C2', customerName: 'Grace Hopper', purchaseDate: '2024-01-15', price: 200 },
  ];

  it('sums every transaction for a customer across all months/years', () => {
    const result = aggregateTotalRewards(transactions);
    const ada = result.find((row) => row.customerId === 'C1');
    // 90 (from $120) + 10 (from $60) = 100
    expect(ada.rewardPoints).toBe(100);
  });

  it('produces one row per unique customer', () => {
    const result = aggregateTotalRewards(transactions);
    expect(result).toHaveLength(2);
  });
});
