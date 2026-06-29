import PropTypes from 'prop-types';
import './Loading.css';

const Loading = ({ label }) => (
  <div className="loading" role="status" aria-live="polite">
    <span className="loading__spinner" />
    <span className="loading__label">{label}</span>
  </div>
);

Loading.propTypes = {
  label: PropTypes.string,
};

Loading.defaultProps = {
  label: 'Loading…',
};

export default Loading;
