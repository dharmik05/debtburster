import React, { useState } from "react";
import Progress from "./Progress";
import YourPlan from "./YourPlan";
import { DashboardData } from "@/types/interface";


const TabSlider: React.FC<DashboardData> = ({ userProfile, debts, dashboardOverview }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return <Progress {...dashboardOverview} />;
      case "plan":
        return (<YourPlan debts={debts} userProfile={userProfile} />);
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
