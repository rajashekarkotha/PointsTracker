import { Component } from 'react';
import PropTypes from 'prop-types';
import logger from '../../utils/logger';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('ErrorBoundary caught a render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="error-boundary" role="alert">
          <p className="error-boundary__message">
            Something went wrong while displaying this page.
          </p>
          <button
            type="button"
            className="error-boundary__retry"
            onClick={this.handleReset}
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
