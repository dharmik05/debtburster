import React, { useState, useRef, useEffect, MouseEvent } from "react";
import Progress from "./Progress";
import YourPlan from "./YourPlan";
import { DashboardData } from "@/types/interface";


const TabSlider: React.FC<DashboardData> = ({ userProfile, debts, dashboardOverview }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return <Progress {...dashboardOverview} />;
      case "debts":
        return (
          <ul>
            <li>💳 Credit Card — $1200 remaining</li>
            <li>🎓 Student Loan — $3000 remaining</li>
            <li>🚗 Car Loan — $1800 remaining</li>
          </ul>
        );
      case "plan":
        return (<YourPlan debts={debts} userProfile={userProfile}/>);
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
          {/* <span
            className={`tab ${activeTab === "debts" ? "active" : ""}`}
            onClick={() => setActiveTab("debts")}
          >
            Your Debts
          </span> */}
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
