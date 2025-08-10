import React from "react";

interface SelectInputProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  value,
  options,
  onChange,
}) => {
  value = value ? value : "Low : 0.001";
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        Select...
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};
