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
  paymentHistory: Array<{
    date: string;
    amount: number;
  }>;
  expectedPaymentDates: string[];
  loanTermMonths?: number;
  creditLimit?: number;
}

interface UserProfile {
  monthlyIncome: number;
  allocatedIncomePercentage: number;
  allocatedIncomeAmount: number;
}

interface DashboardOverview {
  totalDebtLeft: number;
  totalDebtPaid: number;
  totalOriginalDebt: number;
  overallProgressPercentage: number;
  nextOverallPaymentDate: string | null;
}

interface DashboardData {
  userProfile: UserProfile;
  debts: Debt[];
  dashboardOverview: DashboardOverview;
}

const getNextDebtPaymentDate = (dates: string[]): string | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const futureDates = dates
    .map(dateStr => new Date(dateStr))
    .filter(date => date >= today); // Filter out past dates

  if (futureDates.length === 0) {
    return null; // No future payments
  }

  // Find the earliest future date
  const nextDate = new Date(Math.min(...futureDates.map(date => date.getTime())));
  return nextDate.toISOString().split('T')[0]; // Return as "YYYY-MM-DD"
};

// Helper function to recalculate the dashboard overview whenever debts change
const calculateDashboardOverview = (debts: Debt[], monthlyIncome: number): DashboardOverview => {
  let totalDebtLeft = 0;
  let totalDebtPaid = 0;
  let totalOriginalDebt = 0;
  let allExpectedPaymentDates: Date[] = []; // Collect all future dates

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  debts.forEach(debt => {
    totalDebtLeft += debt.remainingDebt;
    totalDebtPaid += debt.amountPaid;
    totalOriginalDebt += debt.originalDebt;

    // Collect all expected future payment dates for this debt
    debt.expectedPaymentDates.forEach(dateStr => {
      const date = new Date(dateStr);
      if (date >= today) { // Only consider future dates
        allExpectedPaymentDates.push(date);
      }
    });
  });

  const overallProgressPercentage = totalOriginalDebt > 0
    ? (totalDebtPaid / totalOriginalDebt) * 100
    : 0;

  // Find the earliest next payment date across all debts
  let nextOverallPaymentDate: string | null = null;
  if (allExpectedPaymentDates.length > 0) {
    const earliestDate = new Date(Math.min(...allExpectedPaymentDates.map(date => date.getTime())));
    nextOverallPaymentDate = earliestDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
  }

  return {
    totalDebtLeft: parseFloat(totalDebtLeft.toFixed(2)),
    totalDebtPaid: parseFloat(totalDebtPaid.toFixed(2)),
    totalOriginalDebt: parseFloat(totalOriginalDebt.toFixed(2)),
    overallProgressPercentage: parseFloat(overallProgressPercentage.toFixed(2)),
    nextOverallPaymentDate: nextOverallPaymentDate,
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