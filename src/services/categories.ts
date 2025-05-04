import { toast } from "sonner";

export const categoryService = {
  getCategories: async (userId: string): Promise<any[]> => {
    try {
      // First try API endpoint
      const response = await fetch(
        `http://localhost:5001/api/categories?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API_NOT_FOUND");
        }
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (apiError) {
      toast.error("Failed to fetch categories");
      throw new Error(apiError);
    }
  },
};
