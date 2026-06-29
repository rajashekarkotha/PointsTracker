import PropTypes from 'prop-types';
import { sortByYearThenMonth, formatMonthYear } from '../../utils/dateUtils';
import '../../styles/Tables.css';

const MonthlyRewardsTable = ({ rows }) => {
  const sortedRows = sortByYearThenMonth(rows);

  return (
    <table className="rewards-table">
      <caption>User monthly rewards</caption>
      <thead>
        <tr>
          <th scope="col">Customer ID</th>
          <th scope="col">Name</th>
          <th scope="col">Month</th>
          <th scope="col">Year</th>
          <th scope="col" className="rewards-table__numeric">Reward points</th>
        </tr>
      </thead>
      <tbody>
        {sortedRows.length === 0 && (
          <tr>
            <td colSpan={5} className="rewards-table__empty">
              No monthly rewards to show yet.
            </td>
          </tr>
        )}
        {sortedRows.map((row) => (
          <tr key={`${row.customerId}-${row.year}-${row.month}`}>
            <td>{row.customerId}</td>
            <td>{row.name}</td>
            <td>{formatMonthYear(row.year, row.month)}</td>
            <td>{row.year}</td>
            <td className="rewards-table__numeric">{row.rewardPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MonthlyRewardsTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MonthlyRewardsTable;
