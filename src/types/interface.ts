export interface Debt {
  id: string;
  lenderName: string;
  type: string;
  originalDebt: number;
  remainingDebt: number;
  amountPaid: number;
  percentageCompleted: number;
  interestRate: number;
  minimumPayment: number;
  paymentHistory: Array<{ date: string; amount: number; }>;
  // expectedPaymentDates: string[];
  loanTermMonths?: number;
  creditLimit?: number;
  debtBalanceHistory?: Array<{
    date: string;
    remainingDebt: number;
  }>;
}

export interface DebtProps {
  debt: Debt;
}

export interface DashboardOverview {
  totalDebtLeft: number;
  totalDebtPaid: number;
  totalOriginalDebt: number;
  overallProgressPercentage: number;
  debtBalanceHistory: Array<{
    date: string;
    remainingDebt: number;
  }>;
}

export interface UserProfile {
  monthlyIncome: number;
  allocatedIncomePercentage: number;
  allocatedIncomeAmount: number;
}

export interface DashboardData {
  userProfile: UserProfile;
  debts: Debt[];
  dashboardOverview: DashboardOverview;
}

export interface AddDebtFormData {
    lenderName: string;
    type: string;
    originalDebt: string;
    interestRate: string;
    minimumPayment: string;
    loanTermMonths?: string;
    creditLimit?: string;
}