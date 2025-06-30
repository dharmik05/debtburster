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


      const data = await res.json();
      setPlan(data.plan || "No plan generated");

      setAiPlan(data.plan || "No plan generated");

    } catch (error) {
      console.error("Error fetching plan:", error);
    }

  };

  const [isRotating, setIsRotating] = useState(false);
  
  const getPlan = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };  

  return (
    <>
        <div>
          <div>

          </div>
          <div className="fetch-div" onClick={()=> {
            fetchPlan();
            getPlan();
          }}>
            <p>Generate Plan</p>
            <img
              src="/reload.svg" 
              id="reload-img"
              className={`generate-plan-img ${isRotating ? "rotate" : ""}`}
              style={{ cursor: "pointer" }}
            />
          </div>          
          
          <pre id="ai-res">{plan}</pre>
        </div>
    </>
    
  );
};

export default YourPlan;
