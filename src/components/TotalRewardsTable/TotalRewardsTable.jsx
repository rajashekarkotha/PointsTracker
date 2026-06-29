import PropTypes from 'prop-types';
import '../../styles/Tables.css';

const TotalRewardsTable = ({ rows }) => {
  const sortedRows = [...rows].sort((a, b) => b.rewardPoints - a.rewardPoints);

  return (
    <table className="rewards-table">
      <caption>Total rewards</caption>
      <thead>
        <tr>
          <th scope="col">Customer name</th>
          <th scope="col" className="rewards-table__numeric">Reward points</th>
        </tr>
      </thead>
      <tbody>
        {sortedRows.length === 0 && (
          <tr>
            <td colSpan={2} className="rewards-table__empty">
              No totals to show yet.
            </td>
          </tr>
        )}
        {sortedRows.map((row) => (
          <tr key={row.customerId}>
            <td>{row.name}</td>
            <td className="rewards-table__numeric">{row.rewardPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

TotalRewardsTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TotalRewardsTable;
