import React, { useState, useEffect } from "react";
import { useWizard } from "./WizardContext";
import { TextInput } from "./fields/TextInput";
import { TextArea } from "./fields/TextArea";
import { NumberInput } from "./fields/NumberInput";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "predeployedContracts";
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[]; // for presets dropdown
}

interface Step {
  step: number;
  title: string;
  fields: Field[];
}

interface WizardProps {
  steps: Step[];
  onSubmit: (data: any) => Promise<void> | void;
}

export const Wizard: React.FC<WizardProps> = ({ steps, onSubmit }) => {
  const { data, setField } = useWizard();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(true);

  // States for predeployedContracts UI & validation
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [uploadedContractFile, setUploadedContractFile] = useState<File | null>(
    null
  );
  const [showContractOptions, setShowContractOptions] = useState(false);

  const currentStep = steps[currentStepIndex];

  // Animate header on step change
  useEffect(() => {
    setAnimateTitle(false);
    const timeout = setTimeout(() => setAnimateTitle(true), 300);
    return () => clearTimeout(timeout);
  }, [currentStepIndex]);

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    currentStep.fields.forEach((field) => {
      const value = data[field.name];
      if (field.required) {
        if (
          value === undefined ||
          value === "" ||
          (typeof value === "number" && isNaN(value))
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

      if (field.type === "predeployedContracts") {
        const hasPredeployed = value;
        if (field.required && hasPredeployed === undefined) {
          newErrors[field.name] = `${field.label} is required`;
        }
        if (hasPredeployed) {
          if (!selectedPreset && !uploadedContractFile) {
            newErrors[field.name] =
              "Please select a preset or upload a contract JSON file.";
          }
        }
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
      // Add the uploaded contract file and selected preset data into form data before submit
      const formData = { ...data };
      formData["selectedPreset"] = selectedPreset;
      if (uploadedContractFile) {
        formData["uploadedContractFileName"] = uploadedContractFile.name;
        // You can add actual file content upload handling separately
      }
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const value = data[field.name] ?? (field.type === "number" ? "" : "");
    const error = errors[field.name];

    if (field.type === "predeployedContracts") {
      const hasPredeployed = !!data[field.name];

      return (
        <>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name={field.name}
              value="yes"
              checked={hasPredeployed === true}
              onChange={() => {
                setField(field.name, true);
                setShowContractOptions(true);
              }}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={field.name}
              value="no"
              checked={hasPredeployed === false}
              onChange={() => {
                setField(field.name, false);
                setShowContractOptions(false);
                setSelectedPreset("");
                setUploadedContractFile(null);
              }}
            />{" "}
            No
          </label>

          {showContractOptions && (
            <div
              style={{
                marginTop: 16,
                paddingLeft: 24,
                borderLeft: "3px solid var(--color-primary-red)",
              }}
            >
              <label>
                Select a contract preset:{" "}
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  style={{ marginLeft: 8, padding: 6, borderRadius: 4 }}
                >
                  <option value="">--Select--</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ marginTop: 16 }}>
                <label>
                  Or upload contract JSON:{" "}
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) =>
                      setUploadedContractFile(e.target.files?.[0] || null)
                    }
                    style={{ marginLeft: 8 }}
                  />
                </label>
                {uploadedContractFile && (
                  <div style={{ marginTop: 8, fontStyle: "italic" }}>
                    Selected file: {uploadedContractFile.name}
                  </div>
                )}
              </div>
            </div>
          )}
          {error && <div className="field-error">{error}</div>}
        </>
      );
    }

    switch (field.type) {
      case "text":
        return (
          <TextInput
            value={value as string}
            onChange={(val) => setField(field.name, val)}
          />
        );
      case "textarea":
        return (
          <TextArea
            value={value as string}
            onChange={(val) => setField(field.name, val)}
          />
        );
      case "number":
        return (
          <NumberInput
            value={value as number | ""}
            min={field.min}
            max={field.max}
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
        {currentStep.fields.map((field) => (
          <div key={field.name} className="wizard-field">
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <div className="field-error">{errors[field.name]}</div>
            )}
          </div>
        ))}

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
