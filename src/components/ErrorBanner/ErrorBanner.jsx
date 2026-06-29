import PropTypes from 'prop-types';
import './ErrorBanner.css';

const ErrorBanner = ({ message, onRetry }) => (
  <div className="error-banner" role="alert">
    <p className="error-banner__message">{message}</p>
    {onRetry && (
      <button type="button" className="error-banner__retry" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

ErrorBanner.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

ErrorBanner.defaultProps = {
  onRetry: undefined,
};

export default ErrorBanner;
