import { toast } from "sonner";
import bcrypt from 'bcryptjs';
import { User, UserData, Session } from "./types";

const SALT_ROUNDS = 10;

// Default categories that make sense for a new user
const DEFAULT_CATEGORIES: { id: string; name: string; icon: string; color: string; type: "income" | "expense" }[] = [
  { id: "income", name: "Income", icon: "wallet", color: "#4CAF50", type: "income" },
  { id: "expense", name: "Expense", icon: "credit-card", color: "#F44336", type: "expense" }
];

export const auth = {
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      // Validate input
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email already exists
      if (existingUsers.some((user: UserData) => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      // Create new user with clean initial state
      const newUser: UserData = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        transactions: [], // Empty transactions array
        budgets: [], // Explicitly empty budgets array - user must create their own
        categories: DEFAULT_CATEGORIES,
        settings: {
          currency: "USD",
          theme: "light",
          notifications: true
        },
        stats: {
          balance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          lastUpdated: new Date().toISOString()
        }
      };

      // Save user
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Create and save session
      const session: Session = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      localStorage.setItem("session", JSON.stringify(session));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      // Show welcome message
      toast.success(`Welcome to PocketWise, ${name}! 🎉`);

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Get users
      const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        console.log("User not found:", email);
        throw new Error("Invalid email or password");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log("Invalid password for user:", email);
        throw new Error("Invalid email or password");
      }

      // Create and save session
      const session: Session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      localStorage.setItem("session", JSON.stringify(session));
      localStorage.setItem("currentUser", JSON.stringify(user));

      toast.success(`Welcome back, ${user.name}! 👋`);

      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem("session");
      localStorage.removeItem("currentUser");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const session = JSON.parse(localStorage.getItem("session") || "null");
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      
      if (!session || !currentUser) {
        return null;
      }

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await this.logout();
        return null;
      }

      return {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const currentUser: UserData | null = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      // Get users
      const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isValidPassword) {
        throw new Error("Current password is incorrect");
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password
      users[userIndex].password = hashedPassword;
      localStorage.setItem("users", JSON.stringify(users));
      
      // Update current user
      currentUser.password = hashedPassword;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }
};

// Add this interface if it doesn't exist already
interface SignUpCredentials {
  username: string;
  password: string;
}

const authService = {
  signUp: async (credentials: SignUpCredentials) => {
    try {
      // First, try to make the API request
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        // Handle non-200 responses
        if (!response.ok) {
          // If API returns 404, throw a specific error to trigger the fallback
          if (response.status === 404) {
            throw new Error("API_NOT_FOUND");
          }
          
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
        }

        // Parse the response data
        const data = await response.json();
        
        // Save the token to localStorage
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        } else {
          throw new Error("No authentication token received");
        }
        
        return data;
      } catch (apiError: any) {
        // Check if this is a 404 error or network error
        if (apiError.message === "API_NOT_FOUND" || 
            (apiError instanceof TypeError && apiError.message.includes('Failed to fetch'))) {
          console.warn("API endpoint not available, falling back to local storage authentication");
          
          // Fall back to local storage-based auth
          const { username, password } = credentials;
          
          // Create a valid email that will pass validation
          // Replace any characters that wouldn't be valid in an email
          const safeUsername = username.replace(/[^a-zA-Z0-9]/g, '');
          const validEmail = `${safeUsername}@pocketwise.local`;
          
          try {
            // Use the existing auth.register method with appropriate parameters
            const user = await auth.register(
              username, // Use username as name
              validEmail, // Use a guaranteed valid email
              password
            );
            
            // Create a token-like structure to maintain compatibility
            const tokenData = {
              token: `local_${Math.random().toString(36).substring(2)}`,
              user: {
                id: user.id,
                username: user.name
              }
            };
            
            localStorage.setItem("authToken", tokenData.token);
            return tokenData;
          } catch (localAuthError: any) {
            // Handle specific error cases from local auth
            if (localAuthError.message.includes("valid email")) {
              throw new Error("Please use a valid username (letters and numbers only)");
            }
            // Re-throw other errors
            throw localAuthError;
          }
        }
        
        // Re-throw any other errors
        throw apiError;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Provide more helpful error message for network issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          // If API returns 404, throw a specific error to trigger the fallback
          if (response.status === 404) {
            throw new Error("API_NOT_FOUND");
          }
          
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to log in");
        }

        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Save token for authentication
        return data;
      } catch (apiError: any) {
        // Check if this is a 404 error or network error for fallback
        if (apiError.message === "API_NOT_FOUND" || 
            (apiError instanceof TypeError && apiError.message.includes('Failed to fetch'))) {
          console.warn("API endpoint not available, falling back to local storage authentication");
          
          // Fall back to local storage-based auth
          const { username, password } = credentials;
          
          // Create a valid email that will pass validation
          const safeUsername = username.replace(/[^a-zA-Z0-9]/g, '');
          const validEmail = `${safeUsername}@pocketwise.local`;
          
          try {
            // Use the existing auth.login method
            const user = await auth.login(validEmail, password);
            
            // Create a token-like structure to maintain compatibility
            const tokenData = {
              token: `local_${Math.random().toString(36).substring(2)}`,
              user: {
                id: user.id,
                username: user.name
              }
            };
            
            localStorage.setItem("authToken", tokenData.token);
            return tokenData;
          } catch (localAuthError) {
            // This could be because the user doesn't exist in local storage
            // Try registering instead (first-time login fallback)
            if (confirm("Account not found. Would you like to create a new account?")) {
              return await authService.signUp(credentials);
            }
            throw new Error("Login failed. User not found.");
          }
        }
        
        // Re-throw any other errors
        throw apiError;
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    // Check if this is a local token
    if (token.startsWith('local_')) {
      console.log("Using local auth fallback for current user");
      try {
        // Try to get the user from the local session
        const session = JSON.parse(localStorage.getItem("session") || "null");
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        
        if (!session || !currentUser) {
          return null;
        }

        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
          localStorage.removeItem("session");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("authToken");
          return null;
        }

        return {
          id: currentUser.id,
          username: currentUser.name, // Map name to username for API compatibility
          name: currentUser.name
        };
      } catch (error) {
        console.error("Error getting local user:", error);
        return null;
      }
    }

    // Regular API flow
    try {
      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // API endpoint not found, try local fallback
          return authService.getFallbackCurrentUser();
        }
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      
      // Try local fallback if we get a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return authService.getFallbackCurrentUser();
      }
      
      return null;
    }
  },

  // New helper method for fallback
  getFallbackCurrentUser: () => {
    try {
      const session = JSON.parse(localStorage.getItem("session") || "null");
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      
      if (!session || !currentUser) {
        return null;
      }

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem("session");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
        return null;
      }

      return {
        id: currentUser.id,
        username: currentUser.name, // Map name to username for API compatibility
        name: currentUser.name
      };
    } catch (error) {
      console.error("Error in fallback current user:", error);
      return null;
    }
  },

  logout: async () => {
    // Clear both auth systems
    localStorage.removeItem("authToken");
    localStorage.removeItem("session");
    localStorage.removeItem("currentUser");
    toast.success("Logged out successfully");
  },
  
  isAuthenticated: () => {
    // Check both auth systems
    const token = localStorage.getItem("authToken");
    const session = localStorage.getItem("session");
    return !!token || !!session;
  },
};

export { authService };