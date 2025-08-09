export const wizardSteps = [
  {
    step: 1,
    title: "Chain Basics",
    fields: [
      {
        name: "chainName",
        label: "Name of your gaming chain",
        type: "text",
        placeholder: "e.g., My Awesome Game Chain",
        required: true,
      },
      {
        name: "chainId",
        label: "Chain ID",
        type: "text",
        placeholder: "short, lowercase, 1-8 chars (e.g., game01)",
        required: true,
        pattern: /^[a-z0-9]{1,8}$/,
        patternError:
          "Chain ID must be 1-8 characters, lowercase letters and numbers only",
      },
    ],
  },
  {
    step: 2,
    title: "Token Details",
    fields: [
      {
        name: "tokenName",
        label: "Token Name",
        type: "text",
        placeholder: "e.g., GameCoin",
        required: false,
      },
      {
        name: "tokenSymbol",
        label: "Token Symbol",
        type: "text",
        placeholder: "e.g., GC",
        required: false,
        maxLength: 5,
      },
      {
        name: "initialSupply",
        label: "Initial Supply",
        type: "number",
        placeholder: "Number of tokens to mint at launch",
        required: false,
        min: 0,
      },
      {
        name: "decimalPrecision",
        label: "Token Decimal Precision",
        type: "number",
        placeholder: "Usually 18",
        required: false,
        min: 0,
        max: 18,
      },
    ],
  },
  {
    step: 3,
    title: "Block Parameters",
    fields: [
      {
        name: "blockTime",
        label: "Block Time (seconds per block)",
        type: "number",
        placeholder: "e.g., 2 or 5",
        required: true,
        min: 1,
        max: 60,
      },
      {
        name: "gasLimit",
        label: "Gas Limit per Block",
        type: "number",
        placeholder: "Default ~15,000,000",
        required: true,
        min: 1000000,
      },
    ],
  },
  {
    step: 4,
    title: "Validator Setup",
    fields: [
      {
        name: "validatorCount",
        label: "Number of Validators",
        type: "number",
        placeholder: "e.g., 2 or 5",
        min: 1,
        max: 20,
        required: true,
      },
      {
        name: "validators",
        label: "Validator Details",
        type: "validators", // your custom field type
        required: true,
        dependsOn: { field: "validatorCount", value: (val: number) => val > 0 }, // optional conditional rendering
      },
    ],
  },
  {
    step: 5,
    title: "Special Features for Game Economy",
    fields: [
      {
        name: "predeployedContracts",
        label:
          "Do you want any smart contracts pre-deployed at genesis? (Yes/No)",
        type: "radio",
        required: true,
      },
      {
        name: "uploadContracts",
        label: "Upload Smart Contracts (bytecode or artifacts)",
        type: "file",
        multiple: true,
        required: false,
        dependsOn: { field: "predeployedContracts", value: true },
        accept: ".json,.bin,.wasm", // restrict to typical compiled contract formats
        description: "Upload compiled contract files to be deployed at genesis",
      },
      {
        name: "transactionFees",
        label: "Transaction Fees",
        type: "select",
        options: ["Low : 0.001", "Free : 0", "Normal : 0.01", "High : 0.05"],
        required: false,
        placeholder: "Select transaction fee model",
      },
    ],
  },
];
