export async function getTransactions() {
  try {
    const response = await fetch("/api/transactions");
    if (!response.ok) {
      console.warn("API endpoint unavailable, falling back to localStorage for transactions");
      // Fallback logic
      return JSON.parse(localStorage.getItem("transactions") || "[]");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    console.warn("Falling back to localStorage for transactions");
    return JSON.parse(localStorage.getItem("transactions") || "[]");
  }
}