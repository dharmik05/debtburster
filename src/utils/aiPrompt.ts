interface DebtInfo {
    id: string;
    lenderName: string;
    type: string;
    remainingDebt: number;
    interestRate?: number;
    loanTermMonths?: string;
}

interface UserProfile {
  monthlyIncome: number;
  allocatedIncomePercentage: number;
}

export function generateDebtPlanPrompt(debt: DebtInfo[], userProfile: UserProfile): string {
    const allocatedAmount = userProfile.monthlyIncome * (userProfile.allocatedIncomePercentage / 100);

    const debtDescriptions = debt.map(d => {
        return `${d.lenderName} (${d.type}): $${d.remainingDebt} @ ${d.interestRate ?? ''}% interest, term: ${d.loanTermMonths}`;
    }).join('\n');

    return `
    You are a financial planning assistant.

    The user wants to pay off their debts in the most effective way based on their financial situation.

    Monthly Income: $${userProfile.monthlyIncome}
    Amount Allocated Towards Debt: $${allocatedAmount} (${userProfile.allocatedIncomePercentage}% of monthly income)

    Debts:
    ${debtDescriptions}

    Analyze the user's situation and choose the most suitable repayment method (e.g., avalanche, snowball, or a hybrid). Explain **why** you chose that method. Then provide a step-by-step repayment plan showing which debts to pay, in what order, and an estimated payoff timeline. Offer any suggestions that might help them become debt-free faster.
    `.trim();

}          