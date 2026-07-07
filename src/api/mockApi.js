import logger from '../utils/logger';

const SIMULATED_MIN_LATENCY_MS = 400;
const SIMULATED_MAX_LATENCY_MS = 1100;
const MOCK_DATA_URL = '/mockData.json';

const randomDelay = () =>
  Math.floor(
    SIMULATED_MIN_LATENCY_MS +
      Math.random() * (SIMULATED_MAX_LATENCY_MS - SIMULATED_MIN_LATENCY_MS)
  );

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTransactions = async ({ simulateFailure = false } = {}) => {
  const delay = randomDelay();
  logger.info(`fetchTransactions: simulating network latency of ${delay}ms`);

  await wait(delay);

  if (simulateFailure) {
    throw new Error('Unable to reach the transactions service. Please try again.');
  }

  const response = await fetch(MOCK_DATA_URL);

  if (!response.ok) {
    throw new Error('Unable to reach the transactions service. Please try again.');
  }

  return response.json();
};
