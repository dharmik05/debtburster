import { Debt, UserProfile } from "@/types/interface";
import { useState } from "react";

interface YourPlanProps {
  debts: Debt[];
  userProfile: UserProfile;
}

const YourPlan: React.FC<YourPlanProps> = ({ debts, userProfile }) => {
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

    } catch (error) {
      console.error("Error fetching plan:", error);
    }

  };


  return (
    <>
        <div>
          <button onClick={fetchPlan}>fetch</button>
          <pre id="ai-plan">{plan}</pre>
          {/* <pre id="ai-plan">
            {text}
          </pre> */}
        </div>
    </>
    
  );
};

export default YourPlan;
