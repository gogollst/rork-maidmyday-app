import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification } from "@/types";
import { mockNotifications } from "@/mocks/notifications";

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [...mockNotifications],
      isLoading: false,
      error: null,

      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // In a real app, we would fetch notifications from the server
          // For this prototype, we'll use the mock data
          set({ notifications: [...mockNotifications], isLoading: false });
        } catch (error) {
          set({
            error: "Failed to fetch notifications",
            isLoading: false,
          });
        }
      },

      markAsRead: async (notificationId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to mark notification as read",
            isLoading: false,
          });
        }
      },

      markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to mark all notifications as read",
            isLoading: false,
          });
        }
      },

      clearNotification: async (notificationId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== notificationId
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to clear notification",
            isLoading: false,
          });
        }
      },

      clearAllNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set({ notifications: [], isLoading: false });
        } catch (error) {
          set({
            error: "Failed to clear all notifications",
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);