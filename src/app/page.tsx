"use client";
import { useState } from "react";
import initialDashboardData from "../dashboardData.json";
import ChatIcon from "../components/ChatIcon";
import TabSlider from "../components/TabSlider";
import DebtCard from "../components/DebtCard";
import Header from "../components/Header";
import Summary from "../components/Summary";
import AddDebtModal from "@/components/AddDebtModal";

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
  // expectedPaymentDates: string[];
  loanTermMonths?: number;
  creditLimit?: number;
  debtBalanceHistory?: Array<{
    date: string;
    remainingDebt: number;
  }>;
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
  // nextOverallPaymentDate: string | null;
  debtBalanceHistory: Array<{
    date: string;
    remainingDebt: number;
  }>;
}

interface DashboardData {
  userProfile: UserProfile;
  debts: Debt[];
  dashboardOverview: DashboardOverview;
}


const calculateDashboardOverview = (debts: Debt[], monthlyIncome: number, updatedDebtId?: string): DashboardOverview => {
  let totalDebtLeft = 0;
  let totalDebtPaid = 0;
  let totalOriginalDebt = 0;
  let debtBalanceHistory1 = initialDashboardData.dashboardOverview.debtBalanceHistory || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  

  debts.forEach(debt => {
    totalDebtLeft += debt.remainingDebt;
    totalDebtPaid += debt.amountPaid;
    totalOriginalDebt += debt.originalDebt;

    // Collect all expected future payment dates for this debt
    // debt.expectedPaymentDates.forEach(dateStr => {
    //   const date = new Date(dateStr);
    //   if (date >= today) { // Only consider future dates
    //     allExpectedPaymentDates.push(date);
    //   }
    // });
  });

  // if(updatedDebtId) {
  //   debts.forEach(debt => {
  //     if (debt.id === updatedDebtId) {
  //       let { date, amount: amountPaid } = debt.paymentHistory[debt.paymentHistory.length - 1];
  //       debtBalanceHistory1.push({date, remainingDebt: totalDebtLeft});
  //     }
  //   })
  // }

  if (updatedDebtId) {
  debts.forEach(debt => {
    if (debt.id === updatedDebtId) {
      let { date } = debt.paymentHistory[debt.paymentHistory.length - 1];
      debtBalanceHistory1.push({ date, remainingDebt: totalDebtLeft });
    }
  });
  // Deduplicate: keep only the last entry for each date
  debtBalanceHistory1 = debtBalanceHistory1.reduce((acc: { date: string; remainingDebt: number }[], curr) => {
    const idx = acc.findIndex(item => item.date === curr.date);
    if (idx === -1) {
      acc.push(curr);
    } else {
      acc[idx] = curr; // Replace with the latest
    }
    return acc;
  }, []);
}


  const overallProgressPercentage = totalOriginalDebt > 0
    ? (totalDebtPaid / totalOriginalDebt) * 100
    : 0;

  // Find the earliest next payment date across all debts
  // let nextOverallPaymentDate: string | null = null;
  // if (allExpectedPaymentDates.length > 0) {
  //   const earliestDate = new Date(Math.min(...allExpectedPaymentDates.map(date => date.getTime())));
  //   nextOverallPaymentDate = earliestDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
  // }

  console.log("Dashboard Overview Calculated:", {
    totalDebtLeft: parseFloat(totalDebtLeft.toFixed(2)),
    totalDebtPaid: parseFloat(totalDebtPaid.toFixed(2)),
    totalOriginalDebt: parseFloat(totalOriginalDebt.toFixed(2)),
    overallProgressPercentage: parseFloat(overallProgressPercentage.toFixed(2)),
    // nextOverallPaymentDate: nextOverallPaymentDate,
    debtBalanceHistory: debtBalanceHistory1
  });

  return {
    totalDebtLeft: parseFloat(totalDebtLeft.toFixed(2)),
    totalDebtPaid: parseFloat(totalDebtPaid.toFixed(2)),
    totalOriginalDebt: parseFloat(totalOriginalDebt.toFixed(2)),
    overallProgressPercentage: parseFloat(overallProgressPercentage.toFixed(2)),
    // nextOverallPaymentDate: nextOverallPaymentDate,
    debtBalanceHistory: debtBalanceHistory1
  };
};

export default function Home() {
 
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);
  const [isAddDebtModalOpen, setIsAddDebtModalOpen] = useState(false);

  const monthlyIncome = dashboardData.userProfile.monthlyIncome.toFixed(2);
  const allocatedIncome = dashboardData.userProfile.allocatedIncomePercentage.toFixed(1);

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
    let updatedDebtId = updatedDebt.id;
    setDashboardData(prevData => {
      const updatedDebts = prevData.debts.map(debt =>
        debt.id === updatedDebt.id ? updatedDebt : debt
      );

      const newOverview = calculateDashboardOverview(updatedDebts, prevData.userProfile.monthlyIncome, updatedDebtId);

      const a = {
        ...prevData,
        debts: updatedDebts,
        dashboardOverview: newOverview
      }

      console.log("Debt Updated:", JSON.stringify(a));

      return {
        ...prevData,
        debts: updatedDebts,
        dashboardOverview: newOverview
      };
    });
  };

  const handleOpenAddDebtModal = () => {
      setIsAddDebtModalOpen(true);
  };

  const handleCloseAddDebtModal = () => {
      setIsAddDebtModalOpen(false);
  };

   const handleSaveNewDebt = (debtData: any) => {
    console.log('New Debt Data to Save:', debtData);

   
    const newDebt: Debt = {
      id: crypto.randomUUID(),
      lenderName: debtData.lenderName,
      type: debtData.type,
      originalDebt: parseFloat(debtData.originalDebt),
      remainingDebt: parseFloat(debtData.originalDebt),
      amountPaid: 0,
      percentageCompleted: 0,
      interestRate: parseFloat(debtData.interestRate),
      minimumPayment: parseFloat(debtData.minimumPayment),
      paymentHistory: [],
      ...(debtData.loanTermMonths && !isNaN(parseFloat(debtData.loanTermMonths))) && { loanTermMonths: parseInt(debtData.loanTermMonths) },
      ...(debtData.creditLimit && !isNaN(parseFloat(debtData.creditLimit))) && { creditLimit: parseFloat(debtData.creditLimit) }
    };

    setDashboardData(prevData => {
        const updatedDebts = [...prevData.debts, newDebt];
        const newOverview = calculateDashboardOverview(updatedDebts, prevData.userProfile.monthlyIncome);

        // console.log("Updated Dashboard Data:", {
        //     ...prevData,
        //     debts: updatedDebts,
        //     dashboardOverview: newOverview,
        // });

        return {
            ...prevData,
            debts: updatedDebts,
            dashboardOverview: newOverview,
        };
    });
    handleCloseAddDebtModal();
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
              
              dashboardOverview={dashboardData.dashboardOverview}
            />
            <TabSlider 
              userProfile={dashboardData.userProfile}
              debts={dashboardData.debts}
              dashboardOverview={dashboardData.dashboardOverview}
            />
          </div>

          <div id="right-div">
            {/* <Achievements /> */}
            <button onClick={handleOpenAddDebtModal}>Add Debt</button>
            {isAddDebtModalOpen && (
                <AddDebtModal
                    onClose={handleCloseAddDebtModal}
                    onSave={handleSaveNewDebt}
                />
            )}
            {/* Map over the debts array to render DebtCard for each one */}
            <div className="scrollable-debt-list">
              {dashboardData.debts.map((debtItem: Debt) => {
                return (
                  <DebtCard
                    key={debtItem.id}
                    debt={debtItem}
                    onUpdateDebt={handleUpdateDebt}
                  />
                );
              })}
            </div>
            
          </div>
        </div>
      </div>
      <ChatIcon />
    </>
  );
}