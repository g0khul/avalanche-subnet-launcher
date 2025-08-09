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
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 4,
        marginBottom: 12,
        border: "1px solid #ccc",
        fontSize: "1rem",
      }}
    >
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
