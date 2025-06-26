import React, { useState, MouseEvent, ChangeEvent, FormEvent } from 'react';

// Define the interface for the new debt data structure
interface NewDebtData {
    lenderName: string;
    type: string;
    debtId: string; // This might be auto-generated in a real app, but for input, we'll allow it
    interestRate: number;
    minimumPayment: number;
    originalDebt: number; // Original loan amount
    loanTermMonths: number; // Loan term in months
    // We won't ask for Remaining Debt or Amount Paid here as it's a new debt
}

interface AddDebtModalProps {
    onClose: () => void; // Function to call when the modal needs to be closed
    onSave: (debtData: NewDebtData) => void; // Function to call when debt data is saved
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ onClose, onSave }) => {
    // State to manage form input values
    const [formData, setFormData] = useState<NewDebtData>({
        lenderName: '',
        type: '',
        debtId: '',
        interestRate: 0,
        minimumPayment: 0,
        originalDebt: 0,
        loanTermMonths: 0,
    });

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type: inputType } = e.target;
        setFormData(prev => ({
            ...prev,
            // Convert numeric inputs to numbers, otherwise keep as string
            [name]: inputType === 'number' ? value || 0 : e.target.value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        onSave(formData); // Call the onSave prop with the form data
    };

    // Prevent modal from closing when clicking inside it
    const handleContentClick = (e: MouseEvent<HTMLDivElement>): void => {
        e.stopPropagation();
    };

    return (
        // The modal backdrop (semi-transparent background)
        <div className="modal-backdrop" onClick={onClose}>
            {/* The modal content area */}
            <div className="modal-content" onClick={handleContentClick}>
                <div className="modal-header">
                    <h2>Add New Debt</h2>
                    <button className="modal-close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="lenderName">Lender Name:</label>
                        <input
                            type="text"
                            id="lenderName"
                            name="lenderName"
                            value={formData.lenderName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Loan Name:</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="interestRate">Interest Rate (%):</label>
                        <input
                            type="number"
                            id="interestRate"
                            name="interestRate"
                            value={formData.interestRate}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="minimumPayment">Minimum Payment ($):</label>
                        <input
                            type="number"
                            id="minimumPayment"
                            name="minimumPayment"
                            value={formData.minimumPayment}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="originalDebt">Original Loan Amount ($):</label>
                        <input
                            type="number"
                            id="originalDebt"
                            name="originalDebt"
                            value={formData.originalDebt}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="loanTermMonths">Loan Term (months):</label>
                        <input
                            type="number"
                            id="loanTermMonths"
                            name="loanTermMonths"
                            value={formData.loanTermMonths}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-button">
                            Save Debt
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDebtModal;