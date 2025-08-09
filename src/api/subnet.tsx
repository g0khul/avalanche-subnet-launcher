export async function createSubnet(data: any) {
  console.log("data : ", data);
  // Replace with your real backend URL & logic
  const res = await fetch("/api/subnet/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create subnet");
  }

  return res.json();
}
