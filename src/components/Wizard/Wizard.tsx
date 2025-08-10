import React, { useState, useEffect } from "react";
import { useWizard } from "./WizardContext";
import { TextInput } from "./fields/TextInput";
import { TextArea } from "./fields/TextArea";
import { NumberInput } from "./fields/NumberInput";
import { SelectInput } from "./fields/SelectInput";

interface Validator {
  nodeId: string;
  stakeAmount: number | "";
  stakeStartTime: string; // ISO date string
  stakeEndTime: string; // ISO date string
  rewardAddress: string;
}

interface Field {
  name: string;
  label: string;
  type:
    | "select"
    | "text"
    | "number"
    | "textarea"
    | "validators"
    | "radio"
    | "file"
    | "button"
    | "textarea";
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
  multiple?: boolean; // for file inputs
  placeholder?: string;
  dependsOn?: { field: string; value: any }; // conditional rendering
  accept?: string;
}

interface Step {
  step: number;
  title: string;
  fields: Field[];
}

interface WizardProps {
  steps: Step[];
  onSubmit: (data: any) => Promise<void> | void;
  onFetchPredefinedContracts?: () => void; // callback prop for fetch button
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  onSubmit,
  onFetchPredefinedContracts,
}) => {
  const { data, setField } = useWizard();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(true);

  const currentStep = steps[currentStepIndex];

  // Animate header on step change
  useEffect(() => {
    setAnimateTitle(false);
    const timeout = setTimeout(() => setAnimateTitle(true), 300);
    return () => clearTimeout(timeout);
  }, [currentStepIndex]);

  // This useEffect is the CORRECT place to manage the validators array based on validatorCount
  useEffect(() => {
    const count = Number(data.validatorCount) || 0;
    const currentValidators = Array.isArray(data.validators)
      ? data.validators
      : [];

    if (currentValidators.length !== count) {
      // Create a new array of the target length, preserving existing validators
      const newValidators = Array.from({ length: count }, (_, index) => {
        // If a validator already exists at this index, keep it. Otherwise, create a new one.
        return (
          currentValidators[index] || {
            nodeId: "",
            stakeAmount: "",
            stakeStartTime: "",
            stakeEndTime: "",
            rewardAddress: "",
          }
        );
      });

      setField("validators", newValidators);
    }
  }, [data.validatorCount, setField]); // Added setField to dependency array

  // Helper: Check if field should be shown based on dependsOn
  const shouldShowField = (field: Field) => {
    if (!field.dependsOn) return true;
    const { field: depField, value } = field.dependsOn;
    if (typeof value === "function") {
      return value(data[depField]);
    }
    return data[depField] === value;
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    currentStep.fields.forEach((field) => {
      if (!shouldShowField(field)) return; // skip validation if field hidden
      const value = data[field.name];

      if (field.required) {
        if (
          value === undefined ||
          value === "" ||
          (typeof value === "number" && isNaN(value)) ||
          (field.type === "validators" &&
            Array.isArray(value) &&
            value.length === 0)
        ) {
          newErrors[field.name] = `${field.label} is required`;
          return;
        }
      }

      if (field.type === "number" && typeof value === "number") {
        if (field.min !== undefined && value < field.min) {
          newErrors[field.name] = `${field.label} must be >= ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.name] = `${field.label} must be <= ${field.max}`;
        }
      }

      if (field.type === "validators" && Array.isArray(value)) {
        const nodeIds = new Set<string>();
        value.forEach((validator: Validator, idx: number) => {
          if (!validator.nodeId) {
            newErrors[`${field.name}-${idx}-nodeId`] = `Validator #${
              idx + 1
            } Node ID is required`;
          } else if (nodeIds.has(validator.nodeId)) {
            newErrors[`${field.name}-${idx}-nodeId`] = `Validator #${
              idx + 1
            } Node ID must be unique`;
          } else {
            nodeIds.add(validator.nodeId);
          }

          if (validator.stakeAmount === "" || validator.stakeAmount < 0) {
            newErrors[`${field.name}-${idx}-stakeAmount`] = `Validator #${
              idx + 1
            } Stake Amount must be >= 0`;
          }

          if (!validator.stakeStartTime) {
            newErrors[`${field.name}-${idx}-stakeStartTime`] = `Validator #${
              idx + 1
            } Stake Start Time is required`;
          }

          if (!validator.stakeEndTime) {
            newErrors[`${field.name}-${idx}-stakeEndTime`] = `Validator #${
              idx + 1
            } Stake End Time is required`;
          }

          if (
            validator.stakeStartTime &&
            validator.stakeEndTime &&
            new Date(validator.stakeStartTime) >=
              new Date(validator.stakeEndTime)
          ) {
            newErrors[`${field.name}-${idx}-stakeEndTime`] = `Validator #${
              idx + 1
            } Stake End Time must be after Stake Start Time`;
          }

          if (!validator.rewardAddress) {
            newErrors[`${field.name}-${idx}-rewardAddress`] = `Validator #${
              idx + 1
            } Reward Address is required`;
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onNext = () => {
    if (!validateStep()) return;
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setErrors({});
    } else {
      onFinish();
    }
  };

  const onBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setErrors({});
    }
  };

  const onFinish = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    if (e.target.files) {
      setField(fieldName, Array.from(e.target.files));
    }
  };

  const renderValidatorField = (
    validator: Validator,
    idx: number,
    onValidatorChange: (idx: number, key: keyof Validator, val: any) => void
  ) => {
    return (
      <div
        key={idx}
        style={{
          marginBottom: 20,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        <h4>Validator #{idx + 1}</h4>

        <label>
          Node ID
          <input
            type="text"
            placeholder="e.g. NodeID-1 or auto-generate"
            value={validator.nodeId}
            onChange={(e) => onValidatorChange(idx, "nodeId", e.target.value)}
          />
          {errors[`validators-${idx}-nodeId`] && (
            <div className="field-error">
              {errors[`validators-${idx}-nodeId`]}
            </div>
          )}
        </label>

        <label>
          Stake Amount (AVAX)
          <input
            type="number"
            min={0}
            placeholder="Stake amount"
            value={validator.stakeAmount}
            onChange={(e) =>
              onValidatorChange(idx, "stakeAmount", Number(e.target.value))
            }
          />
          {errors[`validators-${idx}-stakeAmount`] && (
            <div className="field-error">
              {errors[`validators-${idx}-stakeAmount`]}
            </div>
          )}
        </label>

        <label>
          Stake Start Time
          <input
            type="date"
            value={validator.stakeStartTime}
            onChange={(e) =>
              onValidatorChange(idx, "stakeStartTime", e.target.value)
            }
          />
          {errors[`validators-${idx}-stakeStartTime`] && (
            <div className="field-error">
              {errors[`validators-${idx}-stakeStartTime`]}
            </div>
          )}
        </label>

        <label>
          Stake End Time
          <input
            type="date"
            value={validator.stakeEndTime}
            onChange={(e) =>
              onValidatorChange(idx, "stakeEndTime", e.target.value)
            }
          />
          {errors[`validators-${idx}-stakeEndTime`] && (
            <div className="field-error">
              {errors[`validators-${idx}-stakeEndTime`]}
            </div>
          )}
        </label>

        <label>
          Reward Address
          <input
            type="text"
            placeholder="Wallet address for rewards"
            value={validator.rewardAddress}
            onChange={(e) =>
              onValidatorChange(idx, "rewardAddress", e.target.value)
            }
          />
          {errors[`validators-${idx}-rewardAddress`] && (
            <div className="field-error">
              {errors[`validators-${idx}-rewardAddress`]}
            </div>
          )}
        </label>
      </div>
    );
  };

  const renderField = (field: Field) => {
    if (!shouldShowField(field)) return null;

    const value = data[field.name];
    const error = errors[field.name];

    if (field.type === "validators") {
      const validatorsData: Validator[] = Array.isArray(value) ? value : [];
      const onValidatorChange = (
        idx: number,
        key: keyof Validator,
        val: any
      ) => {
        const newValidators = [...validatorsData];
        newValidators[idx] = { ...newValidators[idx], [key]: val };
        setField(field.name, newValidators);
      };

      return (
        <div>
          {/* *** FIX: Loop directly over the `validatorsData` array from state. *** */}
          {validatorsData.map((validator, idx) =>
            renderValidatorField(validator, idx, onValidatorChange)
          )}
        </div>
      );
    }

    if (field.type === "select" && field.options) {
      return (
        <SelectInput
          value={value as string}
          options={field.options}
          onChange={(val) => setField(field.name, val)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          value={(value as string) || ""}
          placeholder={field.placeholder || ""}
          onChange={(e) => setField(field.name, e.target.value)}
          rows={4} // or any default you want
        />
      );
    }

    if (field.type === "radio") {
      return (
        <div
          role="radiogroup"
          aria-label={field.label}
          style={{ display: "inline-flex", gap: 16 }}
        >
          <label
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <input
              type="radio"
              name={field.name}
              value="yes"
              checked={value === true}
              onChange={() => setField(field.name, true)}
            />
            <span>Yes</span>
          </label>
          <label
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <input
              type="radio"
              name={field.name}
              value="no"
              checked={value === false}
              onChange={() => setField(field.name, false)}
            />
            <span>No</span>
          </label>
        </div>
      );
    }

    if (field.type === "file") {
      return (
        <input
          type="file"
          multiple={field.multiple}
          accept={field.accept}
          onChange={(e) => handleFileChange(e, field.name)}
        />
      );
    }

    if (field.type === "button") {
      return (
        <button
          type="button"
          onClick={() =>
            onFetchPredefinedContracts && onFetchPredefinedContracts()
          }
        >
          {field.label}
        </button>
      );
    }

    switch (field.type) {
      case "text":
        return (
          <TextInput
            value={value as string}
            placeholder={field.placeholder}
            onChange={(val) => setField(field.name, val)}
          />
        );
      case "textarea":
        return (
          <TextArea
            value={value as string}
            placeholder={field.placeholder}
            onChange={(val) => setField(field.name, val)}
          />
        );
      case "number":
        return (
          <NumberInput
            value={typeof value === "number" ? value : ""}
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            onChange={(val) => setField(field.name, val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <nav className={`wizard-header ${animateTitle ? "visible" : "hidden"}`}>
        <h2>{currentStep.title}</h2>
        <div className="wizard-progress">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </nav>

      <main className="wizard-container">
        {currentStep.fields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className="wizard-field">
              <label>
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              {renderField(field)}
              {field.type !== "validators" && error && (
                <div className="field-error">{error}</div>
              )}
            </div>
          );
        })}

        <div className="wizard-actions">
          <button
            onClick={onBack}
            disabled={currentStepIndex === 0 || submitting}
            className="btn-secondary"
          >
            Back
          </button>

          <button
            onClick={onNext}
            disabled={submitting}
            className="btn-primary"
          >
            {currentStepIndex === steps.length - 1
              ? submitting
                ? "Submitting..."
                : "Submit"
              : "Next"}
          </button>
        </div>
      </main>
    </>
  );
};
