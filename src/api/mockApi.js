import mockTransactions from '../data/mockTransactions';
import logger from '../utils/logger';

const SIMULATED_MIN_LATENCY_MS = 400;
const SIMULATED_MAX_LATENCY_MS = 1100;

const randomDelay = () =>
  Math.floor(
    SIMULATED_MIN_LATENCY_MS +
      Math.random() * (SIMULATED_MAX_LATENCY_MS - SIMULATED_MIN_LATENCY_MS)
  );

export const fetchTransactions = ({ simulateFailure = false } = {}) =>
  new Promise((resolve, reject) => {
    const delay = randomDelay();
    logger.info(`fetchTransactions: simulating network latency of ${delay}ms`);

    setTimeout(() => {
      if (simulateFailure) {
        reject(new Error('Unable to reach the transactions service. Please try again.'));
        return;
      }
      resolve(mockTransactions);
    }, delay);
  });
