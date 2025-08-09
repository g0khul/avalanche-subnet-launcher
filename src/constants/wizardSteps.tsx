export const wizardSteps = [
  {
    step: 1,
    title: "Basic Info",
    fields: [
      {
        name: "subnetName",
        label: "Subnet Name",
        type: "text",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    step: 2,
    title: "Node Setup",
    fields: [
      {
        name: "validatorCount",
        label: "Number of Validator Nodes",
        type: "number",
        min: 1,
        max: 20,
        required: true,
      },
      // Optional node specs could be a nested step or toggle for advanced users
    ],
  },
  {
    step: 3,
    title: "Token Setup",
    fields: [
      { name: "tokenName", label: "Token Name", type: "text", required: false },
      {
        name: "tokenSymbol",
        label: "Token Symbol",
        type: "text",
        required: false,
      },
      {
        name: "tokenSupply",
        label: "Initial Supply",
        type: "number",
        required: false,
      },
    ],
  },
  {
    step: 4,
    title: "Owner & Access",
    fields: [
      {
        name: "ownerAddress",
        label: "Owner Wallet Address",
        type: "text",
        required: true,
      },
      { name: "apiKey", label: "API Key", type: "text", required: false },
    ],
  },
  {
    step: 5,
    title: "Monitoring & Alerts",
    fields: [
      {
        name: "healthCheckInterval",
        label: "Health Check Interval (seconds)",
        type: "number",
        min: 10,
        max: 3600,
        required: true,
      },
      {
        name: "alertContact",
        label: "Alert Contact (email/webhook)",
        type: "text",
        required: false,
      },
    ],
  },
];
