import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { sortByPurchaseDate, formatLocalizedDate } from '../../utils/dateUtils';
import '../../styles/Tables.css';

const ALL_CUSTOMERS = 'all';

const TransactionsTable = ({ transactions }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(ALL_CUSTOMERS);

  const customerOptions = useMemo(() => {
    const uniqueNames = transactions.reduce((names, transaction) => {
      if (names.includes(transaction.customerName)) return names;
      return [...names, transaction.customerName];
    }, []);
    return uniqueNames;
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    const filtered =
      selectedCustomer === ALL_CUSTOMERS
        ? transactions
        : transactions.filter(
            (transaction) => transaction.customerName === selectedCustomer
          );
    return sortByPurchaseDate(filtered);
  }, [transactions, selectedCustomer]);

  return (
    <div>
      <div className="rewards-table__toolbar">
        <label htmlFor="customer-filter">Filter by customer</label>
        <select
          id="customer-filter"
          value={selectedCustomer}
          onChange={(event) => setSelectedCustomer(event.target.value)}
        >
          <option value={ALL_CUSTOMERS}>All customers</option>
          {customerOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <table className="rewards-table">
        <caption>Transactions</caption>
        <thead>
          <tr>
            <th scope="col">Transaction ID</th>
            <th scope="col">Customer name</th>
            <th scope="col">Purchase date</th>
            <th scope="col">Product purchased</th>
            <th scope="col" className="rewards-table__numeric">Price</th>
            <th scope="col" className="rewards-table__numeric">Reward points</th>
          </tr>
        </thead>
        <tbody>
          {visibleTransactions.length === 0 && (
            <tr>
              <td colSpan={6} className="rewards-table__empty">
                No transactions match this filter.
              </td>
            </tr>
          )}
          {visibleTransactions.map((transaction) => (
            <tr key={transaction.transactionId}>
              <td>{transaction.transactionId}</td>
              <td>{transaction.customerName}</td>
              <td>{formatLocalizedDate(transaction.purchaseDate)}</td>
              <td>{transaction.productPurchased}</td>
              <td className="rewards-table__numeric">
                ${transaction.price.toFixed(2)}
              </td>
              <td className="rewards-table__numeric">{transaction.rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      productPurchased: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TransactionsTable;
