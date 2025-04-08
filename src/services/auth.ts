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
  }
}; 