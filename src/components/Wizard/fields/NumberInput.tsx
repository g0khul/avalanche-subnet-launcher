import React from "react";

interface NumberInputProps {
  value: number | "";
  onChange: (val: number | "") => void;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  placeholder,
  disabled,
}) => {
  return (
    <input
      type="number"
      value={value}
      disabled={disabled}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? "" : Number(val));
      }}
    />
  );
};
