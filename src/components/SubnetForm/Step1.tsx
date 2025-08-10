import React, { useState } from "react";
import { SubnetFormData } from "../../types";

interface Props {
  data: SubnetFormData;
  updateForm: (data: Partial<SubnetFormData>) => void;
  nextStep: () => void;
}

const Step1: React.FC<Props> = ({ data, updateForm, nextStep }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!data.chain_name) newErrors.chain_name = "Chain name required";
    if (!data.chain_id) newErrors.chain_id = "Chain ID required";
    if (!data.token_name) newErrors.token_name = "Token name required";
    if (!data.token_symbol || data.token_symbol.length !== 2)
      newErrors.token_symbol = "2-char token symbol required";
    if (!data.initial_token_supply || isNaN(Number(data.initial_token_supply)))
      newErrors.initial_token_supply = "Initial token supply must be a number";
    if (
      !data.token_decimal_precision ||
      isNaN(Number(data.token_decimal_precision))
    )
      newErrors.token_decimal_precision = "Decimal precision must be a number";
    if (!data.block_time || isNaN(Number(data.block_time)))
      newErrors.block_time = "Block time must be a number";
    if (!data.gas_limit_per_block || isNaN(Number(data.gas_limit_per_block)))
      newErrors.gas_limit_per_block = "Gas limit per block must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) nextStep();
  }

  return (
    <div className="form-step">
      <h2 className="form-title">Step 1: Subnet Basics</h2>

      <label className="form-label" htmlFor="chain_name">
        Chain Name
      </label>
      <input
        id="chain_name"
        className="form-input"
        placeholder="e.g., Avalanche"
        value={data.chain_name}
        onChange={(e) => updateForm({ chain_name: e.target.value })}
      />
      {errors.chain_name && <p className="form-error">{errors.chain_name}</p>}

      <label className="form-label" htmlFor="chain_id">
        Chain ID
      </label>
      <input
        id="chain_id"
        className="form-input"
        placeholder="e.g., 43114"
        value={data.chain_id}
        onChange={(e) => updateForm({ chain_id: e.target.value })}
      />
      {errors.chain_id && <p className="form-error">{errors.chain_id}</p>}

      <label className="form-label" htmlFor="token_name">
        Token Name
      </label>
      <input
        id="token_name"
        className="form-input"
        placeholder="e.g., Avalanche Token"
        value={data.token_name}
        onChange={(e) => updateForm({ token_name: e.target.value })}
      />
      {errors.token_name && <p className="form-error">{errors.token_name}</p>}

      <label className="form-label" htmlFor="token_symbol">
        Token Symbol (2 chars)
      </label>
      <input
        id="token_symbol"
        className="form-input"
        placeholder="e.g., AV"
        maxLength={2}
        value={data.token_symbol}
        onChange={(e) =>
          updateForm({ token_symbol: e.target.value.toUpperCase() })
        }
      />
      {errors.token_symbol && (
        <p className="form-error">{errors.token_symbol}</p>
      )}

      <label className="form-label" htmlFor="initial_token_supply">
        Initial Token Supply
      </label>
      <input
        id="initial_token_supply"
        className="form-input"
        placeholder="e.g., 1000000"
        type="number"
        value={data.initial_token_supply}
        onChange={(e) => updateForm({ initial_token_supply: e.target.value })}
      />
      {errors.initial_token_supply && (
        <p className="form-error">{errors.initial_token_supply}</p>
      )}

      <label className="form-label" htmlFor="token_decimal_precision">
        Token Decimal Precision
      </label>
      <input
        id="token_decimal_precision"
        className="form-input"
        placeholder="e.g., 18"
        type="number"
        value={data.token_decimal_precision}
        onChange={(e) =>
          updateForm({ token_decimal_precision: e.target.value })
        }
      />
      {errors.token_decimal_precision && (
        <p className="form-error">{errors.token_decimal_precision}</p>
      )}

      <label className="form-label" htmlFor="block_time">
        Block Time (seconds)
      </label>
      <input
        id="block_time"
        className="form-input"
        placeholder="e.g., 2"
        type="number"
        value={data.block_time}
        onChange={(e) => updateForm({ block_time: e.target.value })}
      />
      {errors.block_time && <p className="form-error">{errors.block_time}</p>}

      <label className="form-label" htmlFor="gas_limit_per_block">
        Gas Limit per Block
      </label>
      <input
        id="gas_limit_per_block"
        className="form-input"
        placeholder="e.g., 10000000"
        type="number"
        value={data.gas_limit_per_block}
        onChange={(e) => updateForm({ gas_limit_per_block: e.target.value })}
      />
      {errors.gas_limit_per_block && (
        <p className="form-error">{errors.gas_limit_per_block}</p>
      )}

      <button className="btn btn-primary" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default Step1;
