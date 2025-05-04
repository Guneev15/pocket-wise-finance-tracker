export async function authenticateUser() {
  try {
    const response = await fetch("/api/auth");
    if (!response.ok) {
      console.warn("Using local auth fallback for current user");
      // Fallback logic
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    }
    return await response.json();
  } catch (error) {
    console.error("Error during authentication:", error.message);
    console.warn("Using local auth fallback for current user");
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  }
}