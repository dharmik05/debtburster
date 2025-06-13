import React, { useState, useRef, useEffect, MouseEvent } from "react";

const TabSlider = () => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return <p>Your current repayment progress is on track. Keep going!</p>;
      case "debts":
        return (
          <ul>
            <li>💳 Credit Card — $1200 remaining</li>
            <li>🎓 Student Loan — $3000 remaining</li>
            <li>🚗 Car Loan — $1800 remaining</li>
          </ul>
        );
      case "plan":
        return (
          <ol>
            <li>June 15 — Pay $500</li>
            <li>July 15 — Pay $500</li>
            <li>Aug 15 — Pay $500</li>
          </ol>
        );
      default:
        return null;
    }
  };

  const [activeTab, setActiveTab] = useState("progress");
  return (
    <>
      <div className="debt-tab-section">
        <div className="tab-headers">
          <span
            className={`tab ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </span>
          <span
            className={`tab ${activeTab === "debts" ? "active" : ""}`}
            onClick={() => setActiveTab("debts")}
          >
            Your Debts
          </span>
          <span
            className={`tab ${activeTab === "plan" ? "active" : ""}`}
            onClick={() => setActiveTab("plan")}
          >
            Your Plan
          </span>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default TabSlider;
