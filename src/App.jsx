import { useMemo } from 'react';
import useTransactions from './hooks/useTransactions';
import {
  attachRewardPoints,
  aggregateMonthlyRewards,
  aggregateTotalRewards,
} from './utils/rewardsCalculator';
import PageHeader from './components/Layout/PageHeader';
import Section from './components/Layout/Section';
import TransactionsTable from './components/TransactionsTable/TransactionsTable';
import MonthlyRewardsTable from './components/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable/TotalRewardsTable';
import Loading from './components/Loading/Loading';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import './App.css';

function App() {
  const { status, transactions, error, retry } = useTransactions();

  const transactionsWithPoints = useMemo(
    () => attachRewardPoints(transactions),
    [transactions]
  );

  const monthlyRewards = useMemo(
    () => aggregateMonthlyRewards(transactions),
    [transactions]
  );

  const totalRewards = useMemo(
    () => aggregateTotalRewards(transactions),
    [transactions]
  );

  return (
    <main className="app">
      <PageHeader
        title="Customer Reward Points"
        subtitle="Reward points are earned at 2 points per dollar spent over $100, plus 1 point per dollar spent between $50 and $100, on every transaction."
      />

      {status === 'error' && <ErrorBanner message={error} onRetry={retry} />}

      {status === 'loading' ? (
        <Loading label="Fetching transactions…" />
      ) : (
        <>
          <Section title="Total rewards">
            <TotalRewardsTable rows={totalRewards} />
          </Section>

          <Section title="User monthly rewards">
            <MonthlyRewardsTable rows={monthlyRewards} />
          </Section>

          <Section title="Transactions">
            <TransactionsTable transactions={transactionsWithPoints} />
          </Section>
        </>
      )}
    </main>
  );
}

export default App;
