import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  sortByPurchaseDate,
  formatLocalizedDate,
  isWithinDateRange,
} from '../../utils/dateUtils';
import '../../styles/Tables.css';
import './TransactionsTable.css';

const ALL_CUSTOMERS = 'all';
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 10;

const TransactionsTable = ({ transactions }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(ALL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const filterKey = [selectedCustomerId, startDate, endDate, searchTerm, rowsPerPage].join('|');
  const [previousFilterKey, setPreviousFilterKey] = useState(filterKey);
  if (filterKey !== previousFilterKey) {
    setPreviousFilterKey(filterKey);
    setPage(0);
  }

  const customerOptions = useMemo(() => {
    const uniqueCustomers = new Map();
    transactions.forEach((transaction) => {
      if (!uniqueCustomers.has(transaction.customerId)) {
        uniqueCustomers.set(transaction.customerId, {
          customerId: transaction.customerId,
          name: transaction.customerName,
        });
      }
    });
    return [...uniqueCustomers.values()];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      if (
        selectedCustomerId !== ALL_CUSTOMERS &&
        transaction.customerId !== selectedCustomerId
      ) {
        return false;
      }

      if (!isWithinDateRange(transaction.purchaseDate, startDate, endDate)) {
        return false;
      }

      if (normalizedSearch) {
        const haystack = [
          transaction.customerName,
          transaction.productPurchased,
          transaction.transactionId,
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(normalizedSearch)) return false;
      }

      return true;
    });

    return sortByPurchaseDate(filtered);
  }, [transactions, selectedCustomerId, startDate, endDate, searchTerm]);

  const totalRows = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const currentPage = Math.min(page, totalPages - 1);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const visibleTransactions = filteredTransactions.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      <div className="rewards-table__toolbar transactions-table__toolbar">
        <div className="transactions-table__field">
          <label htmlFor="customer-filter">Filter by customer</label>
          <select
            id="customer-filter"
            value={selectedCustomerId}
            onChange={(event) => setSelectedCustomerId(event.target.value)}
          >
            <option value={ALL_CUSTOMERS}>All customers</option>
            {customerOptions.map((customer) => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="transactions-table__field">
          <label htmlFor="transaction-search">Search</label>
          <input
            id="transaction-search"
            type="search"
            placeholder="Customer, product, or transaction ID"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="transactions-table__field">
          <label htmlFor="start-date">From</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>

        <div className="transactions-table__field">
          <label htmlFor="end-date">To</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
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

      <div className="transactions-table__pagination">
        <div className="transactions-table__field transactions-table__field--inline">
          <label htmlFor="rows-per-page">Rows per page</label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(event) => setRowsPerPage(Number(event.target.value))}
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <span className="transactions-table__range">
          {totalRows === 0
            ? '0 of 0'
            : `${startIndex + 1}–${endIndex} of ${totalRows}`}
        </span>

        <div className="transactions-table__pagination-buttons">
          <button
            type="button"
            onClick={() => setPage((previous) => Math.max(previous - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="transactions-table__page-indicator">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((previous) => Math.min(previous + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      purchaseDate: PropTypes.string.isRequired,
      productPurchased: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TransactionsTable;
