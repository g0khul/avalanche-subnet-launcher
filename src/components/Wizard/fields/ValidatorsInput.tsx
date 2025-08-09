import React, { useEffect } from "react";

interface Validator {
  nodeId: string;
  stakeAmount: number | "";
  stakeStart: string; // ISO date string
  stakeEnd: string;
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
          stakeStart: "",
          stakeEnd: "",
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
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 4,
            }}
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
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 4,
            }}
          />

          <label>Stake Start Time</label>
          <input
            type="date"
            value={value[i]?.stakeStart ?? ""}
            onChange={(e) => updateValidator(i, "stakeStart", e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 4,
            }}
          />

          <label>Stake End Time</label>
          <input
            type="date"
            value={value[i]?.stakeEnd ?? ""}
            onChange={(e) => updateValidator(i, "stakeEnd", e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 4,
            }}
          />

          <label>Reward Address</label>
          <input
            type="text"
            value={value[i]?.rewardAddress ?? ""}
            onChange={(e) =>
              updateValidator(i, "rewardAddress", e.target.value)
            }
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 8,
              borderRadius: 4,
            }}
          />
        </div>
      ))}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};
