import { useState, useEffect, useCallback } from 'react';
import { fetchTransactions } from '../api/mockApi';
import logger from '../utils/logger';

const useTransactions = () => {
  const [state, setState] = useState({
    status: 'loading',
    transactions: [],
    error: null,
  });

  const loadTransactions = useCallback(() => {
    let isCancelled = false;

    setState((previous) => ({ ...previous, status: 'loading', error: null }));

    fetchTransactions()
      .then((data) => {
        if (isCancelled) return;
        setState({ status: 'success', transactions: data, error: null });
      })
      .catch((fetchError) => {
        if (isCancelled) return;
        logger.error('Failed to load transactions:', fetchError.message);
        setState({ status: 'error', transactions: [], error: fetchError.message });
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = loadTransactions();
    return cancel;
  }, [loadTransactions]);

  return {
    status: state.status,
    transactions: state.transactions,
    error: state.error,
    retry: loadTransactions,
  };
};

export default useTransactions;
