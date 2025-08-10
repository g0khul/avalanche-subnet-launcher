export async function createSubnet(data: any) {
  let contractFiles = data["contractFiles"];

  if (!data["special_transaction_fees"]) {
    data["special_transaction_fees"] = "Low : 0.001";
  }

  if (contractFiles) {
    let contractNames: string[] = [];
    contractFiles.forEach((file: File) => {
      contractNames.push(file.name);
    });
    data["contractNames"] = contractNames;
  }

  data = keysToSnakeCase(data);
  data["network_type"] = "subnet-evm";
  console.log("data : ", data);
  // Replace with your real backend URL & logic
  const res = await fetch("http://127.0.0.1:5000/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("res.json()", res.json());
    throw new Error("Failed to create subnet");
  }

  console.log("status code : ", res.statusText);

  return res.json();
}

function pascalToSnake(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1") // prefix uppercase letters with _
    .toLowerCase()
    .replace(/^_/, ""); // remove leading underscore if exists
}

function keysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        pascalToSnake(key),
        keysToSnakeCase(value),
      ])
    );
  }
  return obj;
}
