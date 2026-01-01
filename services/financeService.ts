import { FinancialMetric } from '../types';

const MOCK_FINANCE_DATA: FinancialMetric[] = [
    { month: 'Jan', revenue: 4000, expenses: 8000, cashBalance: 50000 },
    { month: 'Feb', revenue: 6500, expenses: 8200, cashBalance: 48300 },
    { month: 'Mar', revenue: 9000, expenses: 8500, cashBalance: 48800 },
    { month: 'Apr', revenue: 12000, expenses: 9000, cashBalance: 51800 },
    { month: 'May', revenue: 15500, expenses: 9500, cashBalance: 57800 },
    { month: 'Jun', revenue: 21000, expenses: 10000, cashBalance: 68800 },
];

export const getFinancialMetrics = async (): Promise<FinancialMetric[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...MOCK_FINANCE_DATA];
};

export const getRunwayData = async () => {
    return {
        burnRate: 9500,
        runwayMonths: 18,
        cashOnHand: 175000
    };
};
