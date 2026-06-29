import PropTypes from 'prop-types';
import './PageHeader.css';

const PageHeader = ({ title, subtitle }) => (
  <header className="page-header">
    <p className="page-header__eyebrow">Rewards Dashboard</p>
    <h1 className="page-header__title">{title}</h1>
    <p className="page-header__subtitle">{subtitle}</p>
  </header>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

PageHeader.defaultProps = {
  subtitle: '',
};

export default PageHeader;
