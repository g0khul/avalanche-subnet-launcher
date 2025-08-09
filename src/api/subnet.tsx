export async function createSubnet(data: any) {
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
