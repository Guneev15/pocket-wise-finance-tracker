import { toast } from "sonner";
import bcrypt from 'bcryptjs';
import { User, UserData, Session } from "./types";

const SALT_ROUNDS = 10;

// Default categories that make sense for a new user
const DEFAULT_CATEGORIES = [
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
        transactions: [],
        budgets: [],
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