import React, { useEffect } from "react";

interface Validator {
  nodeId: string;
  stakeAmount: number | "";
  stakeStartTime: string; // ISO date string
  stakeEndTime: string;
  rewardAddress: string;
}

interface ValidatorsInputProps {
  count: number;
  value: Validator[];
  onChange: (val: Validator[]) => void;
  error?: string;
}

export const ValidatorsInput: React.FC<ValidatorsInputProps> = ({
  count,
  value,
  onChange,
  error,
}) => {
  // Sync value length with count, only if count changes or value length mismatches
  useEffect(() => {
    if (!value || value.length !== count) {
      const newVals: Validator[] = [];
      for (let i = 0; i < count; i++) {
        newVals.push({
          nodeId: "",
          stakeAmount: "",
          stakeStartTime: "",
          stakeEndTime: "",
          rewardAddress: "",
        });
      }
      onChange(newVals);
    }
  }, [count, value, onChange]);

  const updateValidator = (index: number, field: keyof Validator, val: any) => {
    // Defensive copy of current array
    const updated = [...value];
    // Defensive fallback if undefined index
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div style={{ marginTop: 16 }}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--color-primary-red)",
            padding: 16,
            marginBottom: 20,
            borderRadius: "var(--border-radius)",
          }}
        >
          <h4 style={{ marginBottom: 12 }}>Validator #{i + 1}</h4>

          <label>Node ID</label>
          <input
            type="text"
            placeholder={`NodeID-${i + 1}`}
            value={value[i]?.nodeId ?? ""}
            onChange={(e) => updateValidator(i, "nodeId", e.target.value)}
          />

          <label>Stake Amount</label>
          <input
            type="number"
            min={0}
            value={value[i]?.stakeAmount ?? ""}
            onChange={(e) =>
              updateValidator(
                i,
                "stakeAmount",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />

          <label>Stake Start Time</label>
          <input
            type="date"
            value={value[i]?.stakeStartTime ?? ""}
            onChange={(e) =>
              updateValidator(i, "stakeStartTime", e.target.value)
            }
          />

          <label>Stake End Time</label>
          <input
            type="date"
            value={value[i]?.stakeEndTime ?? ""}
            onChange={(e) => updateValidator(i, "stakeEndTime", e.target.value)}
          />

          <label>Reward Address</label>
          <input
            type="text"
            value={value[i]?.rewardAddress ?? ""}
            onChange={(e) =>
              updateValidator(i, "rewardAddress", e.target.value)
            }
          />
        </div>
      ))}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};
