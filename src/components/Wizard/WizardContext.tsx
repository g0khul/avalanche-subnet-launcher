import { createContext, useContext, useState, type ReactNode } from "react";

// Extend FieldValue to include any object or array type needed
export type Validator = {
  nodeId: string;
  stakeAmount: string | number;
  stakeStart: string; // ISO string or date
  stakeEnd: string;
  rewardAddress: string;
};

export type PredeployedContract = {
  // define shape if needed, else use any
  name: string;
  file?: File;
};

export type FieldValue =
  | string
  | number
  | boolean
  | undefined
  | Validator[]
  | PredeployedContract[]
  | Record<string, any> // fallback for other complex objects
  | null;

interface FormData {
  [key: string]: FieldValue;
}

interface WizardContextType {
  data: FormData;
  setField: (field: string, value: FieldValue) => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FormData>({});

  const setField = (field: string, value: FieldValue) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => setData({});

  return (
    <WizardContext.Provider value={{ data, setField, reset }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error("useWizard must be used within WizardProvider");
  return context;
};
