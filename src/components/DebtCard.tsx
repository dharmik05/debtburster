import React, { useState, useRef, useEffect } from 'react';
import PaymentModal from './PaymentModal';
import DebtDetails from '@/components/DebtDetails'; // MODIFIED: Import DebtDetails component

// Define the structure of a single debt item
interface Debt {
  id: string;
  lenderName: string;
  type: string; // Debt name (e.g., "Car Loan")
  originalDebt: number;
  remainingDebt: number;
  amountPaid: number;
  percentageCompleted: number;
  interestRate: number;
  minimumPayment: number;
  nextPaymentDate: string | null;
  paymentHistory: Array<{
    date: string; // ISO string format "YYYY-MM-DD"
    amount: number;
  }>;
  expectedPaymentDates: string[];
  loanTermMonths?: number;
  creditLimit?: number;
}

// Define the props that DebtCard expects to receive
interface DebtCardProps {
  debt: Debt;
  onUpdateDebt: (updatedDebt: Debt) => void;
  // MODIFIED: onShowDetails prop removed, as modal is now handled internally
}

const DebtCard: React.FC<DebtCardProps> = ({ debt, onUpdateDebt }) => { // MODIFIED: onShowDetails removed from destructuring
  // State to control if the card is in editing mode
  const [isEditing, setIsEditing] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // MODIFIED: Local state to control the DebtDetails modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // States to hold the current values as the user types (strings for contentEditable)
  const [currentDebtType, setCurrentDebtType] = useState(debt.type);
  const [currentLenderName, setCurrentLenderName] = useState(debt.lenderName);
  const [currentOriginalDebt, setCurrentOriginalDebt] = useState(debt.originalDebt.toFixed(2));
  const [currentInterestRate, setCurrentInterestRate] = useState(debt.interestRate.toFixed(2));

  // Refs to directly access the DOM elements for editing
  const debtTypeRef = useRef<HTMLHeadingElement>(null);
  const lenderNameRef = useRef<HTMLParagraphElement>(null);
  const originalDebtRef = useRef<HTMLSpanElement>(null);
  const interestRateRef = useRef<HTMLSpanElement>(null);

  // Calculate values that depend on the original debt amount
  const calculatedRemainingDebt = debt.remainingDebt;
  const calculatedPercentageCompleted = debt.percentageCompleted;

  // Function to ensure numbers are correctly formatted
  const validateAndFormatNumber = (value: string): string => {
    // Remove all characters except digits and the first decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let result = parts[0];
    if (parts.length > 1) {
      result += '.' + parts.slice(1).join('').substring(0, 2); // Limit to 2 decimal places
    }
    const parsed = parseFloat(result);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2); // Default to "0.00" if invalid
  };

  // Effect to focus the debt name when editing starts
  useEffect(() => {
    if (isEditing && debtTypeRef.current) {
      debtTypeRef.current.focus();
      // Place cursor at the end of the text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(debtTypeRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]); // Run this effect when isEditing changes

  // Function to save all changes and tell the parent component
  const saveChanges = () => {
    // Get values from editable fields, clean and validate numbers
    const newType = debtTypeRef.current?.innerText || debt.type;
    const newLenderName = lenderNameRef.current?.innerText || debt.lenderName;
    const newOriginalDebt = parseFloat(validateAndFormatNumber(originalDebtRef.current?.innerText || '0'));
    const newInterestRate = parseFloat(validateAndFormatNumber(interestRateRef.current?.innerText || '0'));

    // Create a new debt object with updated values
    const updatedDebt: Debt = {
      ...debt, // Copy all original debt properties
      type: newType,
      lenderName: newLenderName,
      originalDebt: newOriginalDebt,
      interestRate: newInterestRate,
      // Recalculate derived fields based on the new originalDebt
      remainingDebt: newOriginalDebt - debt.amountPaid,
      percentageCompleted: newOriginalDebt > 0 ? (debt.amountPaid / newOriginalDebt) * 100 : 0,
    };

    // Send the updated debt object back to the parent
    onUpdateDebt(updatedDebt);
    setIsEditing(false); // Exit editing mode
  };

  // Handles when an editable field loses focus
  const handleBlur = (event: React.FocusEvent<HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement>) => {
    const value = event.currentTarget.innerText;
    if (event.currentTarget === debtTypeRef.current) {
      setCurrentDebtType(value);
    } else if (event.currentTarget === lenderNameRef.current) {
      setCurrentLenderName(value);
    } else if (event.currentTarget === originalDebtRef.current) {
      setCurrentOriginalDebt(validateAndFormatNumber(value));
    } else if (event.currentTarget === interestRateRef.current) {
      setCurrentInterestRate(validateAndFormatNumber(value));
    }
  };

  // Handles key presses like Enter (to save) or Escape (to cancel)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement>) => {
    // Allow only numeric input for Original Debt and Interest
    if (event.currentTarget === originalDebtRef.current || event.currentTarget === interestRateRef.current) {
      const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
        event.preventDefault(); // Stop invalid characters from being typed
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent new line
      event.currentTarget.blur(); // Remove focus, triggering handleBlur
      saveChanges(); // Save changes
    } else if (event.key === 'Escape') {
      // Revert to original values from props
      setCurrentDebtType(debt.type);
      setCurrentLenderName(debt.lenderName);
      setCurrentOriginalDebt(debt.originalDebt.toFixed(2));
      setCurrentInterestRate(debt.interestRate.toFixed(2));
      setIsEditing(false); // Exit editing mode
      event.currentTarget.blur();
    }
  };

  // Handles clicking the "Edit" / "Done" button
  const handleEditButtonClick = () => {
    const newIsEditing = !isEditing;
    setIsEditing(newIsEditing);
    if (!newIsEditing) { // If done editing
      saveChanges(); // Save changes
    }
  };

  const handleMakePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (paymentAmount: number, paymentDate: string) => {
    const newAmountPaid = debt.amountPaid + paymentAmount;
    const newRemainingDebt = debt.originalDebt - newAmountPaid;
    const newPercentageCompleted = debt.originalDebt > 0
      ? (newAmountPaid / debt.originalDebt) * 100
      : 0;

    const updatedPaymentHistory = [
      ...debt.paymentHistory,
      { date: paymentDate, amount: paymentAmount }
    ];

    const updatedExpectedPaymentDates = debt.expectedPaymentDates; // Keep as is for now

    const updatedDebt: Debt = {
      ...debt,
      amountPaid: parseFloat(newAmountPaid.toFixed(2)),
      remainingDebt: parseFloat(newRemainingDebt.toFixed(2)),
      percentageCompleted: parseFloat(newPercentageCompleted.toFixed(2)),
      paymentHistory: updatedPaymentHistory, // Assign the updated history
      expectedPaymentDates: updatedExpectedPaymentDates, // Assign potentially updated expected dates
    };

    onUpdateDebt(updatedDebt);
    setShowPaymentModal(false);
  };

  // MODIFIED: Functions to handle showing and hiding DebtDetails modal locally
  const handleShowDetailsClick = () => {
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
  };


  return (
    <>
      <div className="car-section">
        <div className="car-header">
          <div className="car-header-left">
            {/* Debt Name (e.g., Car) */}
            {isEditing ? (
              <h2
                className="editable-field"
                contentEditable={true}
                ref={debtTypeRef}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
              >
                {currentDebtType}
              </h2>
            ) : (
              <h2 className="clickable-field" onClick={handleEditButtonClick}>
                {currentDebtType}
              </h2>
            )}

            {/* Lender Name (e.g., VehicleMotions.Inc) */}
            {isEditing ? (
              <p
                className="editable-field"
                contentEditable={true}
                ref={lenderNameRef}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
              >
                {currentLenderName}
              </p>
            ) : (
              <p className="clickable-field" onClick={handleEditButtonClick}>
                {currentLenderName}
              </p>
            )}
          </div>
          <div className="car-edit" onClick={handleEditButtonClick}>
            {isEditing ? 'Done' : 'Edit'}
          </div>
        </div>

        {/* Original Amount */}
        <div className="label-value">
          <span className="car-finances-label">Total Loan Cost</span>
          {isEditing ? (
            <span
              className="car-finances-value value editable-field"
              contentEditable={true}
              ref={originalDebtRef}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              inputMode="decimal"
              suppressContentEditableWarning={true}
            >
              {currentOriginalDebt}
            </span>
          ) : (
            <span className="car-finances-value value clickable-field" onClick={handleEditButtonClick}>
              ${currentOriginalDebt}
            </span>
          )}
        </div>

        {/* Interest Rate */}
        <div className="label-value">
          <span className="car-finances-label">Interest</span>
          {isEditing ? (
            <span
              className="car-finances-value value editable-field"
              contentEditable={true}
              ref={interestRateRef}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              inputMode="decimal"
              suppressContentEditableWarning={true}
            >
              {currentInterestRate}
            </span>
          ) : (
            <span className="car-finances-value value clickable-field" onClick={handleEditButtonClick}>
              {currentInterestRate}%
            </span>
          )}
        </div>

        <div className="car-progress-bar-container">
          <div
            className="car-progress-bar-fill"
            style={{ width: `${calculatedPercentageCompleted}%` }}
          ></div>
        </div>

        <div className="car-paid-off-text">
          <p>${debt.amountPaid.toFixed(2)} paid off</p>
          <p>${calculatedRemainingDebt.toFixed(2)} Remaining</p>
        </div>

        <div className="car-actions">
          <span className="car-action-link" onClick={handleShowDetailsClick}>
            Details
          </span>
          <span className="car-action-link" onClick={handleMakePaymentClick}>
            Make Payment
          </span>
        </div>


      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirmPayment={handleConfirmPayment}
        debtType={debt.type}
        lenderName={debt.lenderName}
        remainingDebt={debt.remainingDebt}
      />

      {showDetailsModal && (
        <div className="debt-details-overlay">
          <div className="debt-details-modal-content">
            <button
              onClick={handleCloseDetails}
              className="debt-details-modal-close-button"
            >
              &times;
            </button>
            <DebtDetails debt={debt} /> {/* Pass the current debt to DebtDetails */}
          </div>
        </div>
      )}
    </>
  );
};

export default DebtCard;