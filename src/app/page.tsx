"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import initialDashboardData from "../dashboardData.json"; // It's better to rename this to initialDashboardData
import ChatIcon from "../components/ChatIcon";
import TabSlider from "../components/TabSlider";
import Achievements from "../components/Achievements";
import DebtCard from "../components/DebtCard";
import Header from "../components/Header";
import Summary from "../components/Summary";

// --- Define Interfaces (Recommended for type safety) ---
// You might put these in a separate 'types.ts' file if your project grows
interface Debt {
  id: string;
  lenderName: string;
  type: string;
  originalDebt: number;
  remainingDebt: number;
  amountPaid: number;
  percentageCompleted: number;
  interestRate: number;
  minimumPayment: number;
  nextPaymentDate: string | null;
}

interface DashboardOverview {
  totalDebtLeft: number;
  totalDebtPaid: number;
  totalOriginalDebt: number;
  overallProgressPercentage: number;
  nextOverallPaymentDate: string;
}

interface UserProfile {
  objective: string;
  monthlyIncome: number;
  allocatedIncomePercentage: number;
  allocatedIncomeAmount: number;
  nextOverallPaymentDate: string;
}

interface DashboardData {
  userProfile: UserProfile;
  debts: Debt[];
  dashboardOverview: DashboardOverview;
}

// Helper function to recalculate the dashboard overview whenever debts change
const calculateDashboardOverview = (debts: Debt[], monthlyIncome: number): DashboardOverview => {
  let totalDebtLeft = 0;
  let totalDebtPaid = 0;
  let totalOriginalDebt = 0;
  let nextOverallPaymentDate: Date | null = null;

  debts.forEach(debt => {
    totalDebtLeft += debt.remainingDebt;
    totalDebtPaid += debt.amountPaid;
    totalOriginalDebt += debt.originalDebt;

    if (debt.nextPaymentDate) {
      const debtPaymentDate = new Date(debt.nextPaymentDate);
      if (!nextOverallPaymentDate || debtPaymentDate < nextOverallPaymentDate) {
        nextOverallPaymentDate = debtPaymentDate;
      }
    }
  });

  const overallProgressPercentage = totalOriginalDebt > 0
    ? (totalDebtPaid / totalOriginalDebt) * 100
    : 0;

  return {
    totalDebtLeft: parseFloat(totalDebtLeft.toFixed(2)),
    totalDebtPaid: parseFloat(totalDebtPaid.toFixed(2)),
    totalOriginalDebt: parseFloat(totalOriginalDebt.toFixed(2)),
    overallProgressPercentage: parseFloat(overallProgressPercentage.toFixed(2)),
    nextOverallPaymentDate: nextOverallPaymentDate !== null
      ? (nextOverallPaymentDate as Date).toISOString().split('T')[0]
      : "" // Format date to string
  };
};

export default function Home() {
  // Use useState for the entire dashboardData so it can be updated
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);

  // monthlyIncome and allocatedIncome can still be derived or managed separately if needed,
  // but it's often cleaner if they are part of the main dashboardData state updates.
  // For now, let's keep them as derived states from dashboardData.
  const monthlyIncome = dashboardData.userProfile.monthlyIncome.toFixed(2);
  const allocatedIncome = dashboardData.userProfile.allocatedIncomePercentage.toFixed(1);

  // --- Handlers for Summary Component updates ---
  const handleSetMonthlyIncome = (newValue: string) => {
    const newMonthlyIncome = parseFloat(newValue);
    setDashboardData(prevData => {
      const updatedUserProfile = {
        ...prevData.userProfile,
        monthlyIncome: newMonthlyIncome,
        // Recalculate allocatedIncomeAmount if it depends on monthlyIncome
        allocatedIncomeAmount: newMonthlyIncome * (prevData.userProfile.allocatedIncomePercentage / 100)
      };
      // Recalculate overview if monthly income affects it directly, or if other parts are derived
      const newOverview = calculateDashboardOverview(prevData.debts, newMonthlyIncome);
      return {
        ...prevData,
        userProfile: updatedUserProfile,
        dashboardOverview: newOverview
      };
    });
  };

  const handleSetAllocatedIncome = (newValue: string) => {
    const newAllocatedPercentage = parseFloat(newValue);
    setDashboardData(prevData => {
      const updatedUserProfile = {
        ...prevData.userProfile,
        allocatedIncomePercentage: newAllocatedPercentage,
        // Recalculate allocatedIncomeAmount
        allocatedIncomeAmount: prevData.userProfile.monthlyIncome * (newAllocatedPercentage / 100)
      };

      const newState ={
        ...prevData,
        userProfile: updatedUserProfile
      };

      console.log("Allocated Income Updated:", newState);

      return newState;
    });
  };

  // --- Handler for DebtCard updates ---
  const handleUpdateDebt = (updatedDebt: Debt) => {
    setDashboardData(prevData => {
      // Find the specific debt by ID and replace it with the updated version
      const updatedDebts = prevData.debts.map(debt =>
        debt.id === updatedDebt.id ? updatedDebt : debt
      );

      // Recalculate the entire dashboard overview since a debt has changed
      const newOverview = calculateDashboardOverview(updatedDebts, prevData.userProfile.monthlyIncome);

      return {
        ...prevData,
        debts: updatedDebts,
        dashboardOverview: newOverview
      };
    });
  };

  return (
    <>
      <Header />
      <div className="main-container">
        <div id="parent">
          <div id="left-div">
            <Summary
              monthlyIncome={monthlyIncome}
              setMonthlyIncome={handleSetMonthlyIncome}
              allocatedIncome={allocatedIncome}
              setAllocatedIncome={handleSetAllocatedIncome}
              // Pass the dashboardOverview from the state
              dashboardOverview={dashboardData.dashboardOverview}
            />
            <TabSlider />
          </div>

          <div id="right-div">
            <Achievements />
            {/* Map over the debts array to render DebtCard for each one */}
            {dashboardData.debts.map((debtItem: Debt) => (
              <DebtCard
                key={debtItem.id} // Essential for React lists
                debt={debtItem} // Pass the individual debt object
                onUpdateDebt={handleUpdateDebt} // Pass the update handler
              />
            ))}
          </div>
        </div>
      </div>
      <ChatIcon />
    </>
  );
}