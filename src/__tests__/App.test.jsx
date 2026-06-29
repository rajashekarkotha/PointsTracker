import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import App from '../App';
import { fetchTransactions } from '../api/mockApi';

vi.mock('../api/mockApi');

describe('App', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows a loading indicator while transactions are being fetched', () => {
    fetchTransactions.mockReturnValue(new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByText(/fetching transactions/i)).toBeInTheDocument();
  });

  it('shows an error banner with a retry option when the fetch fails', async () => {
    fetchTransactions.mockRejectedValue(new Error('Network unavailable'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /network unavailable/i
    );
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });
});
