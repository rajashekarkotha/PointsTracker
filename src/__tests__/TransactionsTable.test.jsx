import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TransactionsTable from '../components/TransactionsTable/TransactionsTable';

const buildTransaction = (overrides) => ({
  transactionId: 'TXN-0000',
  customerId: 'CUST-00',
  customerName: 'Test Customer',
  purchaseDate: '2024-01-01',
  productPurchased: 'Widget',
  price: 100,
  rewardPoints: 50,
  ...overrides,
});

const sameNameDifferentIds = [
  buildTransaction({
    transactionId: 'TXN-0001',
    customerId: 'CUST-01',
    customerName: 'Jordan Lee',
    productPurchased: 'Keyboard',
  }),
  buildTransaction({
    transactionId: 'TXN-0002',
    customerId: 'CUST-02',
    customerName: 'Jordan Lee',
    productPurchased: 'Monitor',
  }),
];

describe('TransactionsTable', () => {
  it('filters by customerId so same-named customers are distinguishable', async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={sameNameDifferentIds} />);

    await user.selectOptions(
      screen.getByLabelText(/filter by customer/i),
      'CUST-01'
    );

    expect(screen.getByText('TXN-0001')).toBeInTheDocument();
    expect(screen.queryByText('TXN-0002')).not.toBeInTheDocument();
  });

  it('filters rows by the search term across product and transaction id', async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={sameNameDifferentIds} />);

    await user.type(
      screen.getByLabelText(/search/i),
      'Monitor'
    );

    expect(screen.getByText('TXN-0002')).toBeInTheDocument();
    expect(screen.queryByText('TXN-0001')).not.toBeInTheDocument();
  });

  it('paginates results and only shows rowsPerPage rows at a time', async () => {
    const user = userEvent.setup();
    const manyTransactions = Array.from({ length: 12 }, (_, index) =>
      buildTransaction({
        transactionId: `TXN-${1000 + index}`,
        customerId: 'CUST-01',
        purchaseDate: `2024-01-${String(index + 1).padStart(2, '0')}`,
      })
    );

    render(<TransactionsTable transactions={manyTransactions} />);

    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(11); // header + 10 rows
    expect(screen.getByText(/1–10 of 12/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/11–12 of 12/)).toBeInTheDocument();
  });
});
