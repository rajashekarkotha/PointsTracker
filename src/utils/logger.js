
const isProduction = import.meta.env.MODE === 'production';

const logger = {
  info: (...args) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    // eslint-disable-next-line no-console
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.error('[ERROR]', ...args);
  },
};

export default logger;
