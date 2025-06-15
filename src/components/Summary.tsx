import { useState, useEffect, useRef } from "react";
import CircularBar from "./CircularBar";
import dashboardData from "../dashboardData.json";

interface DashboardOverview {
  totalDebtLeft: number;
  totalDebtPaid: number;
  totalOriginalDebt: number;
  overallProgressPercentage: number;
  nextOverallPaymentDate: string; // ISO string format "YYYY-MM-DD"
}

interface SummaryProps {
  monthlyIncome: string;
  setMonthlyIncome: (newValue: string) => void;
  allocatedIncome: string;
  setAllocatedIncome: (newValue: string) => void;
 
  dashboardOverview: DashboardOverview;
}

// interface SummaryProps {
//   monthlyIncome: string;
//   setMonthlyIncome: React.Dispatch<React.SetStateAction<string>>;
//   allocatedIncome: string;
//   setAllocatedIncome: React.Dispatch<React.SetStateAction<string>>;
// }

const Summary: React.FC<SummaryProps> = ({
  // These props will now be passed from a parent (e.g., App.tsx)
  // and initialized there from dashboardData.
  // For Summary.tsx itself, we remove the direct useState initializations if using props.
  // If Summary is the top-level component that reads data initially, keep the useState here.
  // Assuming App.tsx handles initialization based on our previous "lifting state up" discussion:
  monthlyIncome, // Received as prop
  setMonthlyIncome, // Received as prop
  allocatedIncome, // Received as prop
  setAllocatedIncome, // Received as prop
  dashboardOverview
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [currentMonthlyIncome, setCurrentMonthlyIncome] = useState(monthlyIncome);
  const [currentAllocatedIncome, setCurrentAllocatedIncome] = useState(allocatedIncome);

  const [contentEditable, setContentEditable] = useState(false);

  const monthlyIncomeSpanRef = useRef<HTMLSpanElement>(null);
  const allocatedIncomeSpanRef = useRef<HTMLSpanElement>(null);

  const tips = [
    "💡Don’t get Tim Hortons today, save 5 bucks!",
    "💡Cook at home twice a week, save $20.",
    "💡Walk instead of Uber once a week!",
    "💡Cut one streaming service = save $15/month.",
    "💡Use a shopping list to avoid impulse buys.",
  ];
  const [tip, setTip] = useState(tips[0]);
  const [isRotating, setIsRotating] = useState(false);
  
  const getRandomTip = () => {
    let newTip;
    do {
      newTip = tips[Math.floor(Math.random() * tips.length)];
    } while (newTip === tip); // Prevent same tip repeating
    setTip(newTip);

    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  
  
  const validateAndFormatNumber = (value: string): string => {
    // Remove all non-numeric characters except for the first decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let result = parts[0];
    if (parts.length > 1) {
      result += '.' + parts.slice(1).join('').substring(0, 2); // Allow only two decimal places
    }
    const parsed = parseFloat(result);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2); // Always return a string with two decimal places
  };
  
  useEffect(() => {
    // Focus the first editable field when entering edit mode
    if (isEditing && monthlyIncomeSpanRef.current) {
      monthlyIncomeSpanRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(monthlyIncomeSpanRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) { // Only update if not currently editing to avoid input override
      setCurrentMonthlyIncome(monthlyIncome);
      setCurrentAllocatedIncome(allocatedIncome);
    }
  }, [monthlyIncome, allocatedIncome, isEditing]);

  const saveChanges = () => {
    if (monthlyIncomeSpanRef.current) {
      const validatedMonthlyIncome = validateAndFormatNumber(monthlyIncomeSpanRef.current.innerText);
      setMonthlyIncome(validatedMonthlyIncome); // Update parent state
    }
    if (allocatedIncomeSpanRef.current) {
      const validatedAllocatedIncome = validateAndFormatNumber(allocatedIncomeSpanRef.current.innerText);
      setAllocatedIncome(validatedAllocatedIncome); // Update parent state
    }
    setIsEditing(false); // Exit editing mode
  };

  const handleEditClick = () => {
    if (isEditing) { // Was in "Done" mode, now saving
      saveChanges();
    } else { // Was in "Edit" mode, now entering edit
      setIsEditing(true);
    }
  };

  const handleEditableBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    // Update local state and the DOM display with validated value
    const validatedValue = validateAndFormatNumber(event.currentTarget.innerText);
    event.currentTarget.innerText = validatedValue; // Update DOM immediately

    if (event.currentTarget === monthlyIncomeSpanRef.current) {
      setCurrentMonthlyIncome(validatedValue);
    } else if (event.currentTarget === allocatedIncomeSpanRef.current) {
      setCurrentAllocatedIncome(validatedValue);
    }
    // Note: Actual saving to parent happens on "Done" click or Enter key
  };

  const handleEditableKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    // Only allow digits, decimal point, and control keys
    const allowedKeys = [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".",
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"
    ];

    if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault(); // Prevent disallowed characters
    }

    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line
      event.currentTarget.blur(); // Trigger blur to update local state
      saveChanges(); // Explicitly save changes to parent
    } else if (event.key === "Escape") {
      // Revert to original prop values and exit editing mode
      setCurrentMonthlyIncome(monthlyIncome);
      setCurrentAllocatedIncome(allocatedIncome);
      setIsEditing(false);
      event.currentTarget.blur(); // Remove focus
    }
  };

  // Format the next payment date for display
  const nextPaymentDateFormatted = dashboardOverview.nextOverallPaymentDate
    ? new Date(dashboardOverview.nextOverallPaymentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'; 

  // const isCurrentlyEditable = editBtnValue === "Done";

  return (
    <>
      <div className="summary">
        <CircularBar />
        <div className="summary-right-section">
          <div id="info">
            <div className="info-top-div">
              <div className="debt-box top-box">
                <p className="amount">${dashboardOverview.totalDebtLeft.toFixed(2)}</p>
                <p className="label">debt left</p>
              </div>
              <div className="debt-box top-box">
                <p className="amount">{nextPaymentDateFormatted}</p>
                <p className="label">next date</p>
              </div>
              <div className="debt-box top-box">
                <p className="amount">${dashboardOverview.totalDebtPaid.toFixed(2)}</p>
                <p className="label">debt paid</p>
              </div>
            </div>

            <div className="info-div" id="inc-alloc">
              <div className="debt-box">
                <div className="label-value" id="inc-header">
                  <p>Income & Allocation</p>
                  <button className="value" onClick={handleEditClick}>
                    {isEditing ? "Done" : "Edit"}
                  </button>
                </div>

                <div className="label-value">
                  <p>Monthly Income</p>
                  <div className="value">
                    <span>$</span>
                    <span
                      className={isEditing ? "editable-field" : "clickable-field"}
                      contentEditable={isEditing}
                      ref={monthlyIncomeSpanRef}
                      onBlur={handleEditableBlur}
                      onKeyDown={handleEditableKeyDown}
                      inputMode="decimal"
                      suppressContentEditableWarning={true}
                      onClick={isEditing ? undefined : handleEditClick} // Allow click to edit if not already editing
                    >
                      {currentMonthlyIncome}
                    </span>
                  </div>
                </div>

                <div className="label-value">
                  <p>Allocated Income</p>
                  <p className="value">
                    <span
                      className={isEditing ? "editable-field" : "clickable-field"}
                      contentEditable={isEditing}
                      ref={allocatedIncomeSpanRef}
                      onBlur={handleEditableBlur}
                      onKeyDown={handleEditableKeyDown}
                      inputMode="decimal"
                      suppressContentEditableWarning={true}
                      onClick={isEditing ? undefined : handleEditClick} // Allow click to edit if not already editing
                    >
                      {currentAllocatedIncome}
                    </span>
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="info-div" id="daily-task">
              <img
                src="/reload.svg"
                id="reload-img"
                onClick={getRandomTip}
                className={isRotating ? "rotate" : ""}
                style={{ cursor: "pointer" }}
              />
              <div className="debt-box bottom-box">
                <p className="amount">{tip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
