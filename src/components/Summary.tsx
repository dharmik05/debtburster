import { useState, useEffect, useRef } from "react";
import CircularBar from "./CircularBar";

interface DashboardOverview {
  totalDebtLeft: number;
  totalDebtPaid: number;
  totalOriginalDebt: number;
  overallProgressPercentage: number;
}

interface SummaryProps {
  monthlyIncome: string;
  setMonthlyIncome: (newValue: string) => void;
  allocatedIncome: string;
  setAllocatedIncome: (newValue: string) => void;
 
  dashboardOverview: DashboardOverview;
}

const Summary: React.FC<SummaryProps> = ({
  monthlyIncome,
  setMonthlyIncome,
  allocatedIncome,
  setAllocatedIncome,
  dashboardOverview
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [currentMonthlyIncome, setCurrentMonthlyIncome] = useState(monthlyIncome);
  const [currentAllocatedIncome, setCurrentAllocatedIncome] = useState(allocatedIncome);

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
    } while (newTip === tip);
    setTip(newTip);

    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  
  
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
    if (!isEditing) {
      setCurrentMonthlyIncome(monthlyIncome);
      setCurrentAllocatedIncome(allocatedIncome);
    }
  }, [monthlyIncome, allocatedIncome, isEditing]);

  const saveChanges = () => {
    if (monthlyIncomeSpanRef.current) {
      const validatedMonthlyIncome = validateAndFormatNumber(monthlyIncomeSpanRef.current.innerText);
      setMonthlyIncome(validatedMonthlyIncome);
    }
    if (allocatedIncomeSpanRef.current) {
      const validatedAllocatedIncome = validateAndFormatNumber(allocatedIncomeSpanRef.current.innerText);
      setAllocatedIncome(validatedAllocatedIncome);
    }
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (isEditing) {
      saveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const handleEditableBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    const validatedValue = validateAndFormatNumber(event.currentTarget.innerText);
    event.currentTarget.innerText = validatedValue;

    if (event.currentTarget === monthlyIncomeSpanRef.current) {
      setCurrentMonthlyIncome(validatedValue);
    } else if (event.currentTarget === allocatedIncomeSpanRef.current) {
      setCurrentAllocatedIncome(validatedValue);
    }
  };

  const handleEditableKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const allowedKeys = [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".",
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"
    ];

    if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      saveChanges();
    } else if (event.key === "Escape") {
      setCurrentMonthlyIncome(monthlyIncome);
      setCurrentAllocatedIncome(allocatedIncome);
      setIsEditing(false);
      event.currentTarget.blur();
    }
  };

  const paid = dashboardOverview.totalDebtPaid;
  const left = dashboardOverview.totalDebtLeft;
  const total = paid + left;

  const percentage = total === 0 ? 0 : (paid / total)*100;

  return (
    <>
      <div className="summary">
        <CircularBar percentage={Math.round(percentage)} />
        <div className="summary-right-section">
          <div id="info">
            <div className="info-top-div">
              <div className="debt-box top-box">
                <p className="amount">${dashboardOverview.totalDebtLeft.toFixed(2)}</p>
                <p className="label">debt left</p>
              </div>
              <div className="debt-box top-box">
                <p className="amount">July 1st, 2025</p>
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
                      onClick={isEditing ? undefined : handleEditClick}
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
                      onClick={isEditing ? undefined : handleEditClick}
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
