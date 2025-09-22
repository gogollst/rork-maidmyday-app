import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Schedule, Task } from "@/types";
import { mockSchedules } from "@/mocks/schedules";
import { useTaskStore } from "./taskStore";

interface ScheduleState {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  
  fetchSchedules: () => Promise<void>;
  addSchedule: (schedule: Omit<Schedule, "id" | "createdAt">) => Promise<void>;
  updateSchedule: (scheduleId: string, updates: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  addTaskToSchedule: (scheduleId: string, task: Task) => Promise<void>;
  removeTaskFromSchedule: (scheduleId: string, taskId: string) => Promise<void>;
  clearError: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [...mockSchedules],
      isLoading: false,
      error: null,

      fetchSchedules: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // In a real app, we would fetch schedules from the server
          // For this prototype, we'll use the mock data
          set({ schedules: [...mockSchedules], isLoading: false });
        } catch (error) {
          set({
            error: "Failed to fetch schedules",
            isLoading: false,
          });
        }
      },

      addSchedule: async (schedule) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const newSchedule: Schedule = {
            ...schedule,
            id: `schedule${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          
          set((state) => ({
            schedules: [...state.schedules, newSchedule],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to add schedule",
            isLoading: false,
          });
        }
      },

      updateSchedule: async (scheduleId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            schedules: state.schedules.map((schedule) =>
              schedule.id === scheduleId
                ? { ...schedule, ...updates }
                : schedule
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to update schedule",
            isLoading: false,
          });
        }
      },

      deleteSchedule: async (scheduleId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            schedules: state.schedules.filter(
              (schedule) => schedule.id !== scheduleId
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to delete schedule",
            isLoading: false,
          });
        }
      },

      addTaskToSchedule: async (scheduleId, task) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            schedules: state.schedules.map((schedule) =>
              schedule.id === scheduleId
                ? {
                    ...schedule,
                    tasks: [...schedule.tasks, task],
                  }
                : schedule
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to add task to schedule",
            isLoading: false,
          });
        }
      },

      removeTaskFromSchedule: async (scheduleId, taskId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            schedules: state.schedules.map((schedule) =>
              schedule.id === scheduleId
                ? {
                    ...schedule,
                    tasks: schedule.tasks.filter((task) => task.id !== taskId),
                  }
                : schedule
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to remove task from schedule",
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "schedule-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);