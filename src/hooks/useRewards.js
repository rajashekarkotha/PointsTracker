import { useMemo } from 'react';
import {
  attachRewardPoints,
  aggregateMonthlyRewards,
  aggregateTotalRewards,
} from '../utils/rewardsCalculator';

const useRewards = (transactions) => {
  const transactionsWithPoints = useMemo(
    () => attachRewardPoints(transactions),
    [transactions]
  );

  const monthlyRewards = useMemo(
    () => aggregateMonthlyRewards(transactionsWithPoints),
    [transactionsWithPoints]
  );

  const totalRewards = useMemo(
    () => aggregateTotalRewards(transactionsWithPoints),
    [transactionsWithPoints]
  );

  return { transactionsWithPoints, monthlyRewards, totalRewards };
};

export default useRewards;
