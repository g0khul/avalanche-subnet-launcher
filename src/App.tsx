import { WizardProvider } from "./components/Wizard/WizardContext";
import { Wizard } from "./components/Wizard/Wizard";

import { createSubnet } from "./api/subnet";
import { wizardSteps } from "./constants/wizardSteps";

const App = () => {
  const handleSubmit = async (data: any) => {
    try {
      const result = await createSubnet(data);
      console.log("Subnet created successfully!");
      console.log("Subnet creation result:", result);
    } catch (err) {
      console.log("Subnet creation failed: " + (err as Error).message);
    }
  };

  return (
    <WizardProvider>
      <Wizard steps={wizardSteps} onSubmit={handleSubmit} />
    </WizardProvider>
  );
};

export default App;
