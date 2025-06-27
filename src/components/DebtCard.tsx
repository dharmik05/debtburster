import React, { useState, useRef, useEffect } from 'react';
import PaymentModal from './PaymentModal';
import DebtDetails from '@/components/DebtDetails';

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
  nextPaymentDate?: string | null;
  paymentHistory: Array<{
    date: string;
    amount: number;
  }>;
  expectedPaymentDates?: string[];
  loanTermMonths?: number;
  creditLimit?: number;
}

interface DebtCardProps {
  debt: Debt;
  onUpdateDebt: (updatedDebt: Debt) => void;
}

const DebtCard: React.FC<DebtCardProps> = ({ debt, onUpdateDebt }) => {
 
  const [isEditing, setIsEditing] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  
  const [currentDebtType, setCurrentDebtType] = useState(debt.type);
  const [currentLenderName, setCurrentLenderName] = useState(debt.lenderName);
  const [currentOriginalDebt, setCurrentOriginalDebt] = useState(debt.originalDebt.toFixed(2));
  const [currentInterestRate, setCurrentInterestRate] = useState(debt.interestRate.toFixed(2));

  
  const debtTypeRef = useRef<HTMLHeadingElement>(null);
  const lenderNameRef = useRef<HTMLParagraphElement>(null);
  const originalDebtRef = useRef<HTMLSpanElement>(null);
  const interestRateRef = useRef<HTMLSpanElement>(null);

  
  const calculatedRemainingDebt = debt.remainingDebt;
  const calculatedPercentageCompleted = debt.percentageCompleted;

  
  const validateAndFormatNumber = (value: string): string => {
    
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let result = parts[0];
    if (parts.length > 1) {
      result += '.' + parts.slice(1).join('').substring(0, 2);
    }
    const parsed = parseFloat(result);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
  };

  
  useEffect(() => {
    if (isEditing && debtTypeRef.current) {
      debtTypeRef.current.focus();
      
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(debtTypeRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  
  const saveChanges = () => {
    const newType = debtTypeRef.current?.innerText || debt.type;
    const newLenderName = lenderNameRef.current?.innerText || debt.lenderName;
    const newOriginalDebt = parseFloat(validateAndFormatNumber(originalDebtRef.current?.innerText || '0'));
    const newInterestRate = parseFloat(validateAndFormatNumber(interestRateRef.current?.innerText || '0'));

    
    const updatedDebt: Debt = {
      ...debt,
      type: newType,
      lenderName: newLenderName,
      originalDebt: newOriginalDebt,
      interestRate: newInterestRate,
      remainingDebt: newOriginalDebt - debt.amountPaid,
      percentageCompleted: newOriginalDebt > 0 ? (debt.amountPaid / newOriginalDebt) * 100 : 0,
    };


    onUpdateDebt(updatedDebt);
    setIsEditing(false);
  };

  
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

 
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement | HTMLHeadingElement | HTMLParagraphElement>) => {
    
    if (event.currentTarget === originalDebtRef.current || event.currentTarget === interestRateRef.current) {
      const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
        event.preventDefault(); 
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
      saveChanges();
    } else if (event.key === 'Escape') {
      
      setCurrentDebtType(debt.type);
      setCurrentLenderName(debt.lenderName);
      setCurrentOriginalDebt(debt.originalDebt.toFixed(2));
      setCurrentInterestRate(debt.interestRate.toFixed(2));
      setIsEditing(false);
      event.currentTarget.blur();
    }
  };

  
  const handleEditButtonClick = () => {
    const newIsEditing = !isEditing;
    setIsEditing(newIsEditing);
    if (!newIsEditing) {
      saveChanges();
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

    // const updatedExpectedPaymentDates = debt.expectedPaymentDates;

    const updatedDebt: Debt = {
      ...debt,
      amountPaid: parseFloat(newAmountPaid.toFixed(2)),
      remainingDebt: parseFloat(newRemainingDebt.toFixed(2)),
      percentageCompleted: parseFloat(newPercentageCompleted.toFixed(2)),
      paymentHistory: updatedPaymentHistory,
      // expectedPaymentDates: updatedExpectedPaymentDates,
    };

    onUpdateDebt(updatedDebt);
    setShowPaymentModal(false);
  };

  
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
            <DebtDetails debt={debt} />
          </div>
        </div>
      )}
    </>
  );
};

export default DebtCard;