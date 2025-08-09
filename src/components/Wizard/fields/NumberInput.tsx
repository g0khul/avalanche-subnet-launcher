import React from "react";

interface NumberInputProps {
  value: number | "";
  onChange: (val: number | "") => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  disabled,
}) => {
  return (
    <input
      type="number"
      value={value}
      disabled={disabled}
      min={min}
      max={max}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? "" : Number(val));
      }}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: 16,
      }}
    />
  );
};
