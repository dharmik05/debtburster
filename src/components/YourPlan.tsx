import { Debt, UserProfile } from "@/types/interface";
import { useState, useContext } from "react";
import DataContext from "@/context/DataContext";
import { send } from "process";

interface YourPlanProps {
  debts: Debt[];
  userProfile: UserProfile;
}

const YourPlan: React.FC<YourPlanProps> = ({ debts, userProfile }) => {

  const context = useContext(DataContext);
  if (!context) throw new Error("YourPlan must be used within DataContext.Provider");
  const { setAiPlan } = context;

  console.log("YourPlan component props:", debts, userProfile);
  const [plan, setPlan] = useState("");

  const userProfileUpdated = {
    monthlyIncome: userProfile.monthlyIncome,
    allocatedIncomePercentage: userProfile.allocatedIncomePercentage
  }

  const fetchPlan = async () => {
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debts: debts, userProfile: userProfileUpdated })
      });

      console.log("Request sent to /api/plan with body:", {
        debts: debts,
        userProfile: userProfileUpdated
      });

      const data = await res.json();
      console.log("Response from /api/plan:", data);
      setPlan(data.plan || "No plan generated");

      console.log("Plan fetched successfully:", data.plan);
      setAiPlan(data.plan || "No plan generated");

    } catch (error) {
      console.error("Error fetching plan:", error);
    }

  };


  return (
    <>
        <div>
          <button onClick={fetchPlan}>fetch</button>
          <pre id="ai-res">{plan}</pre>
        </div>
    </>
    
  );
};

export default YourPlan;
