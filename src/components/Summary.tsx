import { useState, useEffect, useRef } from "react";
import CircularBar from "./CircularBar";
import dashboardData from "../dashboardData.json";

interface SummaryProps {
  monthlyIncome: string;
  setMonthlyIncome: React.Dispatch<React.SetStateAction<string>>;
  allocatedIncome: string;
  setAllocatedIncome: React.Dispatch<React.SetStateAction<string>>;
}

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
}) => {
  let [editBtnValue, setEditBtnValue] = useState("Edit");
  // const [monthlyIncome, setMonthlyIncome] = useState("3000");
  // const [allocatedIncome, setAllocatedIncome] = useState("23");
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

  useEffect(() => {
    // Only focus if we just entered "Done" (edit) mode
    if (editBtnValue === "Done" && monthlyIncomeSpanRef.current) {
      monthlyIncomeSpanRef.current.focus();
      // Place cursor at the end for better UX
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(monthlyIncomeSpanRef.current);
      range.collapse(false); // Collapse to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editBtnValue]);

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
    const cleanedValue = value.replace(/[^\d.]/g, ""); // Remove all non-digits except '.'
    const parts = cleanedValue.split(".");
    let finalValue = parts[0];
    if (parts.length > 1) {
      finalValue += "." + parts.slice(1).join("");
    }

    const parsed = parseFloat(finalValue);
    if (isNaN(parsed)) {
      return "0"; // Return "0" for truly invalid numeric input
    }
    return String(parsed); // Convert back to string
  };

  const handelEdit = () => {
    const newEditBtnValue = editBtnValue === "Edit" ? "Done" : "Edit";
    setEditBtnValue(newEditBtnValue);

    const enteringEditMode = newEditBtnValue === "Done";

    if (!enteringEditMode) {
      if (monthlyIncomeSpanRef.current) {
        const validatedValue = validateAndFormatNumber(
          monthlyIncomeSpanRef.current.innerText
        );
        setMonthlyIncome(validatedValue);
        monthlyIncomeSpanRef.current.innerText = validatedValue;
      }
      if (allocatedIncomeSpanRef.current) {
        const validatedValue = validateAndFormatNumber(
          allocatedIncomeSpanRef.current.innerText
        );
        setAllocatedIncome(validatedValue);
        allocatedIncomeSpanRef.current.innerText = validatedValue;
      }
    }
  };

  const handleEditableBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    // Only process blur if we are still in "Done" (edit) mode
    if (editBtnValue === "Done") {
      const targetSpan = event.currentTarget;
      const validatedValue = validateAndFormatNumber(targetSpan.innerText);
      // Immediately update the DOM with the validated value for visual feedback
      targetSpan.innerText = validatedValue;

      // Also update the corresponding state value (this is the live update)
      if (targetSpan === monthlyIncomeSpanRef.current) {
        setMonthlyIncome(validatedValue);
      } else if (targetSpan === allocatedIncomeSpanRef.current) {
        setAllocatedIncome(validatedValue);
      }
    }
  };

  // Handler for key presses (e.g., Enter to save, Escape to cancel)
  const handleEditableKeyDown = (
    event: React.KeyboardEvent<HTMLSpanElement>
  ) => {
    // Only allow digits, decimal point, and control keys like Backspace, Delete, Arrow keys, Tab
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];

    // Prevent input of disallowed characters. Allow Ctrl/Meta key combinations (e.g., Ctrl+C, Ctrl+V).
    if (!allowedKeys.includes(event.key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }

    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line in contenteditable
      event.currentTarget.blur(); // Blur the span to trigger handleEditableBlur and subsequent save logic
      // Optionally, you could also set editBtnValue to "Edit" here to exit edit mode on Enter
      // setEditBtnValue("Edit");
    } else if (event.key === "Escape") {
      // Revert to original values and exit edit mode
      if (monthlyIncomeSpanRef.current) {
        monthlyIncomeSpanRef.current.innerText = monthlyIncome; // Revert to last saved state
      }
      if (allocatedIncomeSpanRef.current) {
        allocatedIncomeSpanRef.current.innerText = allocatedIncome; // Revert to last saved state
      }
      setEditBtnValue("Edit"); // Exit edit mode
      event.currentTarget.blur();
    }
  };

  const isCurrentlyEditable = editBtnValue === "Done";

  return (
    <>
      <div className="summary">
        <CircularBar />
        <div className="summary-right-section">
          <div id="info">
            <div className="info-top-div">
              <div className="debt-box top-box">
                <p className="amount">$2000</p>
                <p className="label">debt left</p>
              </div>
              <div className="debt-box top-box">
                <p className="amount">June 1</p>
                <p className="label">next date</p>
              </div>
              <div className="debt-box top-box">
                <p className="amount">$6000</p>
                <p className="label">debt paid</p>
              </div>
            </div>

            <div className="info-div" id="inc-alloc">
              <div className="debt-box">
                <div className="label-value" id="inc-header">
                  <p>Income & Allocation</p>
                  <button className="value" onClick={handelEdit}>
                    {editBtnValue}
                  </button>
                </div>

                <div className="label-value">
                  <p>Monthly Income</p>
                  <div className="value">
                    <span>$</span>
                    <span
                      className="editable"
                      contentEditable={isCurrentlyEditable} // Dynamically set contentEditable
                      ref={monthlyIncomeSpanRef} // Assign ref
                      onBlur={handleEditableBlur} // Handle blur for validation and saving
                      onKeyDown={handleEditableKeyDown} // Handle key presses (Enter/Escape/numeric)
                      inputMode="decimal" // Hint for mobile keyboards
                      pattern="[0-9]*\.?[0-9]*" // Regex hint for validation (not enforced by contentEditable itself)
                      suppressContentEditableWarning={true} // Suppress React warning
                    >
                      {monthlyIncome} {/* Display value from state */}
                    </span>
                  </div>
                </div>

                <div className="label-value">
                  <p>Allocated Income</p>
                  <p className="value">
                    <span
                      className="editable"
                      contentEditable={isCurrentlyEditable} // Dynamically set contentEditable
                      ref={allocatedIncomeSpanRef} // Assign ref
                      onBlur={handleEditableBlur} // Handle blur for validation and saving
                      onKeyDown={handleEditableKeyDown} // Handle key presses (Enter/Escape/numeric)
                      inputMode="decimal" // Hint for mobile keyboards
                      pattern="[0-9]*\.?[0-9]*" // Regex hint for validation
                      suppressContentEditableWarning={true} // Suppress React warning
                    >
                      {allocatedIncome} {/* Display value from state */}
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
