import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { mockUsers } from "@/mocks/users";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock authentication
          const user = mockUsers.find((u) => u.email === email);
          
          if (user && password === "password") {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({
              error: "Invalid email or password",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "An error occurred during login",
            isLoading: false,
          });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Check if email already exists
          const existingUser = mockUsers.find((u) => u.email === email);
          
          if (existingUser) {
            set({
              error: "Email already in use",
              isLoading: false,
            });
            return;
          }
          
          // Create new user (in a real app, this would be done on the server)
          const newUser: User = {
            id: `user${mockUsers.length + 1}`,
            name,
            email,
            role: "owner",
          };
          
          // In a real app, we would add the user to the database
          // For this prototype, we'll just set the user as authenticated
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "An error occurred during registration",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);