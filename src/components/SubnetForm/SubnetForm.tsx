import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { SubnetFormData, Validator } from "../../types";

interface Props {
  walletAddress: string;
}

const SubnetForm: React.FC<Props> = ({ walletAddress }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SubnetFormData>({
    chain_name: "",
    chain_id: "",
    token_name: "",
    token_symbol: "",
    initial_token_supply: "",
    token_decimal_precision: "",
    block_time: "",
    gas_limit_per_block: "",
    validators: [],
    network_type: "",
    contract_names: [],
    contract_files: [],
    constructor_args: "",
    special_transaction_fees: "low",
  });

  function updateForm(newData: Partial<SubnetFormData>) {
    setFormData((prev) => ({ ...prev, ...newData }));
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, 3));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  switch (step) {
    case 1:
      return (
        <Step1 data={formData} updateForm={updateForm} nextStep={nextStep} />
      );
    case 2:
      return (
        <Step2
          data={formData}
          updateForm={updateForm}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      );
    case 3:
      return (
        <Step3
          data={formData}
          updateForm={updateForm}
          prevStep={prevStep}
          walletAddress={walletAddress}
        />
      );
    default:
      return null;
  }
};

export default SubnetForm;
