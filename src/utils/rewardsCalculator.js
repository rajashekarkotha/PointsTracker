const TIER_TWO_THRESHOLD = 50;
const TIER_THREE_THRESHOLD = 100;
const TIER_TWO_RATE = 1;
const TIER_THREE_RATE = 2;

export const calculateTransactionPoints = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return 0;
  }

  const dollarsInTierThree = Math.max(amount - TIER_THREE_THRESHOLD, 0);
  const dollarsInTierTwo =
    Math.min(amount, TIER_THREE_THRESHOLD) - TIER_TWO_THRESHOLD;

  const tierTwoPoints = Math.max(dollarsInTierTwo, 0) * TIER_TWO_RATE;
  const tierThreePoints = dollarsInTierThree * TIER_THREE_RATE;

  return Math.floor(tierTwoPoints + tierThreePoints);
};

export const attachRewardPoints = (transactions = []) =>
  transactions.map((transaction) => ({
    ...transaction,
    rewardPoints: calculateTransactionPoints(transaction.price),
  }));

export const buildMonthKey = (year, month) =>
  `${year}-${String(month).padStart(2, '0')}`;

export const aggregateMonthlyRewards = (transactions = []) => {
  const withPoints = attachRewardPoints(transactions);

  const monthlyTotals = withPoints.reduce((accumulator, transaction) => {
    const purchaseDate = new Date(transaction.purchaseDate);
    const year = purchaseDate.getFullYear();
    const month = purchaseDate.getMonth() + 1; // JS months are 0-indexed
    const key = `${transaction.customerId}-${buildMonthKey(year, month)}`;

    const existing = accumulator[key];
    const pointsSoFar = existing ? existing.rewardPoints : 0;

    return {
      ...accumulator,
      [key]: {
        customerId: transaction.customerId,
        name: transaction.customerName,
        month,
        year,
        rewardPoints: pointsSoFar + transaction.rewardPoints,
      },
    };
  }, {});

  return Object.values(monthlyTotals);
};

export const aggregateTotalRewards = (transactions = []) => {
  const withPoints = attachRewardPoints(transactions);

  const totalsByCustomer = withPoints.reduce((accumulator, transaction) => {
    const existing = accumulator[transaction.customerId];
    const pointsSoFar = existing ? existing.rewardPoints : 0;

    return {
      ...accumulator,
      [transaction.customerId]: {
        customerId: transaction.customerId,
        name: transaction.customerName,
        rewardPoints: pointsSoFar + transaction.rewardPoints,
      },
    };
  }, {});

  return Object.values(totalsByCustomer);
};
