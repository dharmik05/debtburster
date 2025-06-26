import React, { useState, useRef, useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (paymentAmount: number, paymentDate: string) => void;
  debtType: string;
  lenderName: string;
  remainingDebt: number;
}

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,  
  onConfirmPayment,
  debtType,
  lenderName,
  remainingDebt,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(getTodayDateString());
  
  const amountInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Focus the amount input field when the modal opens
  useEffect(() => {
    if (isOpen && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset payment amount and date when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setPaymentAmount('');
      setPaymentDate(getTodayDateString());
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(value) || value === '') {
      setPaymentAmount(value);
    }
  };

  // For date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDate(e.target.value);
  };

  const handleConfirm = () => {
    const amount = parseFloat(paymentAmount);
    const selectedDate = new Date(paymentDate);
    const today = new Date(getTodayDateString());

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount greater than zero.');
      return;
    }
    
    // Check if payment amount exceeds remaining debt
    if (amount > remainingDebt) {
        alert(`Payment amount ($${amount.toFixed(2)}) cannot exceed remaining debt ($${remainingDebt.toFixed(2)}).`);
        return;
    }

    // Ensure date is not in the future
    if (selectedDate > today) {
      alert('Payment date cannot be in the future.');
      return;
    }

    // Call onConfirmPayment with both amount and date
    onConfirmPayment(amount, paymentDate); 
  };

  if (!isOpen) return null;

  // Handles closing modal on Escape key
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="modal-content">
        <h2>Make Payment</h2>
        <p>
          For: **{debtType}** from **{lenderName}**
        </p>
        <p className="modal-remaining-debt">Remaining: ${remainingDebt.toFixed(2)}</p>

        <div className="modal-input-group">
          <label htmlFor="paymentAmount">Payment Amount:</label>
          <input
            type="text"
            id="paymentAmount"
            ref={amountInputRef}
            value={paymentAmount}
            onChange={handleAmountChange}
            placeholder="e.g., 50.00"
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
          />
        </div>

        {/* For Payment Date */}
        <div className="modal-input-group">
          <label htmlFor="paymentDate">Payment Date:</label>
          <input
            type="date"
            id="paymentDate"
            ref={dateInputRef}
            value={paymentDate}
            onChange={handleDateChange}
            max={getTodayDateString()}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-button modal-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button modal-confirm-button" onClick={handleConfirm}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;