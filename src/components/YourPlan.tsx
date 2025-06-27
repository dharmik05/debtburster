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

  const text = `Plan fetched successfully: Based on the user's financial situation and debts, the most suitable repayment method would be the avalanche method. This method involves paying off debts with the highest interest rates first, as this will ultimately save the user money in the long run by minimizing the amount paid in interest.

Here is a step-by-step repayment plan for the user:

1. Visa BrightBank (Credit Card): $450 @ 21.5% interest
   - Pay off this debt first as it has the highest interest rate, making minimum payments on the other debts.

2. EduPlus Loan Services (Student Loan): $3200 @ 5.2% interest, term: 60
   - After paying off the credit card debt, focus on paying off the student loan with the next highest interest rate.

3. Quick Auto Finance (Car Loan): $5300 @ 4.5% interest, term: 60
   - Lastly, focus on paying off the car loan as it has the lowest interest rate of the three debts.

Estimated payoff timeline:
- Credit Card: 1 month
- Student Loan: 8 months
- Car Loan: 12 months

Suggestions to help the user become debt-free faster:
- Consider increasing the amount allocated towards debt repayment if possible, as this will help pay off debts more quickly.
- Look into any potential opportunities for increasing income or reducing expenses to allocate more funds towards debt repayment.
- Consider refinancing any of the debts to potentially lower interest rates and save money in the long run.`


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
