import React, { useState, useEffect } from "react";
import { SubnetFormData, Validator } from "../../types";

interface Props {
  data: SubnetFormData;
  updateForm: (data: Partial<SubnetFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Props> = ({ data, updateForm, nextStep, prevStep }) => {
  const [validatorCount, setValidatorCount] = useState(
    data.validators.length || 1
  );
  const [validators, setValidators] = useState<Validator[]>(
    data.validators.length
      ? data.validators
      : Array(validatorCount).fill({
          node_id: "",
          stake_amount: "",
          stake_start_time: "",
          stake_end_time: "",
          reward_address: "",
        })
  );

  useEffect(() => {
    // Resize validators array based on validatorCount
    if (validatorCount > validators.length) {
      const diff = validatorCount - validators.length;
      setValidators((prev) => [
        ...prev,
        ...Array(diff).fill({
          node_id: "",
          stake_amount: "",
          stake_start_time: "",
          stake_end_time: "",
          reward_address: "",
        }),
      ]);
    } else if (validatorCount < validators.length) {
      setValidators((prev) => prev.slice(0, validatorCount));
    }
  }, [validatorCount]);

  function updateValidator(
    index: number,
    field: keyof Validator,
    value: string
  ) {
    const newValidators = [...validators];
    newValidators[index] = { ...newValidators[index], [field]: value };
    setValidators(newValidators);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    // Filter files by extension
    const validFiles = files.filter((f) =>
      [".json", ".bin", ".wasm"].some((ext) => f.name.endsWith(ext))
    );
    updateForm({
      contract_files: validFiles,
      contract_names: validFiles.map((f) => f.name),
    });
  }

  function validate(): boolean {
    // Validate validators fields, network_type and contract_files
    for (let i = 0; i < validators.length; i++) {
      const v = validators[i];
      if (!v.node_id) return false;
      if (!v.stake_amount || isNaN(Number(v.stake_amount))) return false;
      if (!v.stake_start_time || isNaN(Date.parse(v.stake_start_time)))
        return false;
      if (!v.stake_end_time || isNaN(Date.parse(v.stake_end_time)))
        return false;
      if (!v.reward_address) return false;
    }
    // if (!data.network_type) return false;
    // if (!data.contract_files || data.contract_files.length === 0) return false;
    return true;
  }

  function handleNext() {
    if (validate()) {
      updateForm({ validators });
      nextStep();
    } else {
      alert(
        "Please fill all validator fields correctly, select network type and upload contract files."
      );
    }
  }

  return (
    <div className="form-step">
      <h2 className="form-title">Step 2: Validators & Network</h2>

      <label className="form-label">Number of Validators</label>
      <input
        className="form-input"
        type="number"
        min={1}
        value={validatorCount}
        onChange={(e) => setValidatorCount(Number(e.target.value))}
      />

      {validators.map((val, i) => (
        <div key={i} className="validator-card">
          <h4 className="validator-title">Validator {i + 1}</h4>

          <input
            className="form-input"
            placeholder="Node ID"
            value={val.node_id}
            onChange={(e) => updateValidator(i, "node_id", e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Stake Amount"
            type="number"
            value={val.stake_amount}
            onChange={(e) => updateValidator(i, "stake_amount", e.target.value)}
          />
          <input
            className="form-input"
            type="date"
            placeholder="Stake Start Time (YYYY-MM-DD)"
            value={val.stake_start_time}
            onChange={(e) =>
              updateValidator(i, "stake_start_time", e.target.value)
            }
          />
          <input
            className="form-input"
            type="date"
            placeholder="Stake End Time (YYYY-MM-DD)"
            value={val.stake_end_time}
            onChange={(e) =>
              updateValidator(i, "stake_end_time", e.target.value)
            }
          />
          <input
            className="form-input"
            placeholder="Reward Address"
            value={val.reward_address}
            onChange={(e) =>
              updateValidator(i, "reward_address", e.target.value)
            }
          />
        </div>
      ))}

      <label className="form-label">Network Type</label>
      <select
        className="form-input"
        value={data.network_type || "subnet-evm"}
        onChange={(e) =>
          updateForm({
            network_type: e.target.value ? e.target.value : "subnet-evm",
          })
        }
      >
        <option className="form-input-option" value="ethereum-evm">
          Custom EVM
        </option>
        <option className="form-input-option" value="subnet-evm">
          Subnet EVM
        </option>
      </select>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
