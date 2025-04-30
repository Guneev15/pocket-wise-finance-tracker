<<<<<<< HEAD
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
=======
import { User } from "@/types/user";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const AUTH_KEY = 'budgetwise_auth';
const USERS_KEY = 'budgetwise_users';

export const authService = {
  // Initialize auth state from localStorage
  init: (): AuthState => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
    return { isLoggedIn: false, user: null };
  },

  // Login user
  login: (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        // Store auth state
        const authState: AuthState = {
          isLoggedIn: true,
          user: { ...user, password: '' } // Don't store password in auth state
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
        resolve({ success: true, message: 'Login successful!' });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    });
  },

  // Register user
  register: (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      // Check if user already exists
      if (users.some((u: User) => u.email === email)) {
        resolve({ success: false, message: 'Email already registered' });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      resolve({ success: true, message: 'Registration successful!' });
    });
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const authState = authService.init();
    return authState.isLoggedIn;
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const authState = authService.init();
    return authState.user;
  },

  // Get all users (for testing)
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  // Update user data
  updateUser: (userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const userIndex = users.findIndex((u: User) => u.id === userId);
        
        if (userIndex === -1) {
          resolve({ success: false, message: 'User not found' });
          return;
        }

        // Update user data
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Update auth state if it's the current user
        const authState = authService.init();
        if (authState.user?.id === userId) {
          authState.user = { ...authState.user, ...updates, password: '' };
          localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
        }

        resolve({ success: true, message: 'User updated successfully' });
      }, 1000);
    });
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
  }
}; 