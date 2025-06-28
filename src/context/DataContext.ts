import { createContext } from 'react';

export interface AiPlanContextType {
  aiPlan: string;
  setAiPlan: (val: string) => void;
}

const DataContext = createContext<AiPlanContextType | undefined>(undefined);

export default DataContext;