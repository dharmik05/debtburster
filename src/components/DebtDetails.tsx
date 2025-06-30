import React from 'react';

interface Debt {
  id: string;
  lenderName: string;
  type: string;
  originalDebt: number;
  remainingDebt: number;
  amountPaid: number;
  percentageCompleted: number;
  interestRate: number;
  minimumPayment: number;
  paymentHistory: Array<{ date: string; amount: number; }>;
  loanTermMonths?: number;
  creditLimit?: number;
  debtBalanceHistory?: Array<{
    date: string;
    remainingDebt: number;
  }>;
}

interface DebtDetailsProps {
  debt: Debt;
}

const DebtDetails: React.FC<DebtDetailsProps> = ({ debt }) => {
  return (
    <div id="debt-details-container">
      <h2>Debt Details</h2>
      
      <div className="details-grid">
        <div className="detail-item">
          <p className="label">Lender Name</p>
          <p className="value">{debt.lenderName}</p>
        </div>
        <div className="detail-item">
          <p className="label">Loan Name</p>
          <p className="value">{debt.type}</p>
        </div>
        <div className="detail-item">
          <p className="label">Debt ID</p>
          <p className="value">{debt.id}</p>
        </div>
        <div className="detail-item">
          <p className="label">Interest Rate</p>
          <p className="value">{debt.interestRate}%</p>
        </div>
        <div className="detail-item">
          <p className="label">Minimum Payment</p>
          <p className="value">${debt.minimumPayment.toFixed(2)}</p>
        </div>
        <div className="detail-item">
          <p className="label">Total Loan Cost</p>
          <p className="value">${debt.originalDebt.toFixed(2)}</p>
        </div>
        <div className="detail-item">
          <p className="label">Remaining Debt</p>
          <p className="value">${debt.remainingDebt.toFixed(2)}</p>
        </div>
        <div className="detail-item">
          <p className="label">Amount Paid</p>
          <p className="value">${debt.amountPaid.toFixed(2)}</p>
        </div>
        <div className="detail-item">
          <p className="label">Progress</p>
          <p className="value">{debt.percentageCompleted.toFixed(2)}%</p>
        </div>
        {debt.loanTermMonths && (
          <div className="detail-item">
            <p className="label">Loan Term</p>
            <p className="value">{debt.loanTermMonths} months</p>
          </div>
        )}
        {debt.creditLimit && (
          <div className="detail-item">
            <p className="label">Credit Limit</p>
            <p className="value">${debt.creditLimit.toFixed(2)}</p>
          </div>
        )}
      </div>

      <h3>Payment History</h3>
      {debt.paymentHistory.length > 0 ? (
        <div className="payment-history-table-wrapper">
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {debt.paymentHistory.map((payment, index) => (
                <tr key={index}>
                  <td>
                    {new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td>
                    ${payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-history-message">No payment history recorded for this debt.</p>
      )}
    </div>
  );
};

export default DebtDetails;