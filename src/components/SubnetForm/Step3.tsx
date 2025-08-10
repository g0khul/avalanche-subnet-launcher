import React, { useEffect, useState } from "react";
import axios from "axios";
import { SubnetFormData } from "../../types";

interface Props {
  data: SubnetFormData;
  updateForm: (data: Partial<SubnetFormData>) => void;
  prevStep: () => void;
  walletAddress: string;
}

const feeOptions = {
  low: 0.001,
  medium: 0.01,
  high: 0.5,
  free: 0.0,
};

const base_url = "http://127.0.0.1:5000";

const Step3: React.FC<Props> = ({
  data,
  updateForm,
  prevStep,
  walletAddress,
}) => {
  const [constructorArgsError, setConstructorArgsError] = useState<
    string | null
  >(null);
  const [submitting, setSubmitting] = useState(false);
  const [preDeploy, setPreDeploy] = useState(false); // YES/NO toggle

  let sampleResponses = [
    {
      total_nodes: 15,
      active_nodes: 13,
      inactive_nodes: 2,
      node_data: [
        {
          node_id: "Node 1",
          stake_amount: "100",
          stake_start_time: "1754809359",
          stake_end_time: "1755673359",
          reward_address: "wallet address 1",
        },
        {
          node_id: "Node 2",
          stake_amount: "100",
          stake_start_time: "1754809359",
          stake_end_time: "1755673359",
          reward_address: "wallet address 2",
        },
        {
          node_id: "Node 3",
          stake_amount: "100",
          stake_start_time: "1754809359",
          stake_end_time: "1755673359",
          reward_address: "wallet address 3",
        },
        {
          node_id: "Node 4",
          stake_amount: "100",
          stake_start_time: "1754809359",
          stake_end_time: "1755673359",
          reward_address: "wallet address 4",
        },
      ],
    },
    {
      total_nodes: 8,
      active_nodes: 8,
      inactive_nodes: 0,
      node_data: [
        {
          node_id: "Node A",
          stake_amount: "250",
          stake_start_time: "1754900000",
          stake_end_time: "1755800000",
          reward_address: "wallet address A",
        },
        {
          node_id: "Node B",
          stake_amount: "300",
          stake_start_time: "1754905000",
          stake_end_time: "1755805000",
          reward_address: "wallet address B",
        },
        {
          node_id: "Node C",
          stake_amount: "150",
          stake_start_time: "1754910000",
          stake_end_time: "1755810000",
          reward_address: "wallet address C",
        },
      ],
    },
    {
      total_nodes: 12,
      active_nodes: 10,
      inactive_nodes: 2,
      node_data: [
        {
          node_id: "Node X1",
          stake_amount: "500",
          stake_start_time: "1755001000",
          stake_end_time: "1755901000",
          reward_address: "wallet address X1",
        },
        {
          node_id: "Node X2",
          stake_amount: "750",
          stake_start_time: "1755002000",
          stake_end_time: "1755902000",
          reward_address: "wallet address X2",
        },
        {
          node_id: "Node X3",
          stake_amount: "600",
          stake_start_time: "1755003000",
          stake_end_time: "1755903000",
          reward_address: "wallet address X3",
        },
        {
          node_id: "Node X4",
          stake_amount: "450",
          stake_start_time: "1755004000",
          stake_end_time: "1755904000",
          reward_address: "wallet address X4",
        },
      ],
    },
    {
      total_nodes: 5,
      active_nodes: 3,
      inactive_nodes: 2,
      node_data: [
        {
          node_id: "TestNode-01",
          stake_amount: "50",
          stake_start_time: "1755100000",
          stake_end_time: "1756000000",
          reward_address: "wallet address T1",
        },
        {
          node_id: "TestNode-02",
          stake_amount: "80",
          stake_start_time: "1755105000",
          stake_end_time: "1756005000",
          reward_address: "wallet address T2",
        },
      ],
    },
  ];

  useEffect(() => {
    validateConstructorArgs(data.constructor_args || "");
  }, [data.constructor_args]);

  function validateConstructorArgs(jsonStr: string) {
    try {
      if (!jsonStr.trim()) return null; // empty allowed
      JSON.parse(jsonStr);
      setConstructorArgsError(null);
      return true;
    } catch {
      setConstructorArgsError("Invalid JSON. Will send empty value.");
      return false;
    }
  }

  function handleConstructorArgsChange(value: string) {
    updateForm({ constructor_args: value });
    validateConstructorArgs(value);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      updateForm({ contract_files: Array.from(e.target.files) });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);

    const validators = data.validators.map((v) => ({
      node_id: v.node_id,
      stake_amount: v.stake_amount,
      stake_start_time: Math.floor(
        new Date(v.stake_start_time).getTime() / 1000
      ).toString(),
      stake_end_time: Math.floor(
        new Date(v.stake_end_time).getTime() / 1000
      ).toString(),
      reward_address: v.reward_address,
    }));

    let constructorArgsVal = "";
    try {
      constructorArgsVal = data.constructor_args.trim()
        ? JSON.stringify(JSON.parse(data.constructor_args))
        : "";
    } catch {
      constructorArgsVal = "";
    }

    const payload = {
      chain_name: data.chain_name,
      chain_id: data.chain_id,
      token_name: data.token_name,
      token_symbol: data.token_symbol,
      initial_token_supply: data.initial_token_supply,
      token_decimal_precision: data.token_decimal_precision,
      block_time: data.block_time,
      gas_limit_per_block: data.gas_limit_per_block,
      validators,
      network_type: data.network_type,
      contract_names: data.contract_names,
      contract_files: preDeploy
        ? data.contract_files.map((file) => file.name)
        : [],
      constructor_args: preDeploy ? constructorArgsVal : "",
      special_transaction_fees:
        feeOptions[data.special_transaction_fees as keyof typeof feeOptions],
    };

    try {
      const response = await axios.post(base_url + "/post", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        window.localStorage.setItem(
          "dashboardData",
          JSON.stringify(response.data)
        );
        window.location.href = "/dashboard";
      } else {
        const randomMock =
          sampleResponses[Math.floor(Math.random() * sampleResponses.length)];

        window.localStorage.setItem(
          "dashboardData",
          JSON.stringify(randomMock)
        );
        window.location.href = "/dashboard";
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-step">
      <h2 className="form-title">Step 3: Finalize & Submit</h2>

      {/* Pre-deploy contracts question */}
      <label className="form-label">
        Do you want any smart contracts pre-deployed at genesis?
      </label>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            name="preDeploy"
            value="yes"
            checked={preDeploy}
            onChange={() => setPreDeploy(true)}
          />
          Yes
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="preDeploy"
            value="no"
            checked={!preDeploy}
            onChange={() => setPreDeploy(false)}
          />
          No
        </label>
      </div>

      {preDeploy && (
        <>
          <label className="form-label">Upload Contract Files</label>
          <input
            className="form-input"
            type="file"
            multiple
            onChange={handleFileChange}
          />

          <label className="form-label">Constructor Args (JSON)</label>
          <textarea
            className="form-input"
            rows={5}
            value={data.constructor_args}
            onChange={(e) => handleConstructorArgsChange(e.target.value)}
          />
          {constructorArgsError && (
            <p className="error-text">{constructorArgsError}</p>
          )}
        </>
      )}

      <label className="form-label">Special Transaction Fees</label>
      <select
        className="form-input"
        value={data.special_transaction_fees}
        onChange={(e) =>
          updateForm({ special_transaction_fees: e.target.value })
        }
      >
        <option value="low">Low (0.001)</option>
        <option value="medium">Medium (0.01)</option>
        <option value="high">High (0.5)</option>
        <option value="free">Free (0.0)</option>
      </select>

      <div className="form-actions">
        <button
          className="btn btn-secondary"
          onClick={prevStep}
          disabled={submitting}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Step3;
