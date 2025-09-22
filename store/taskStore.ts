import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/types";
import { mockTasks } from "@/mocks/tasks";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [...mockTasks],
      isLoading: false,
      error: null,

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // In a real app, we would fetch tasks from the server
          // For this prototype, we'll use the mock data
          set({ tasks: [...mockTasks], isLoading: false });
        } catch (error) {
          set({
            error: "Failed to fetch tasks",
            isLoading: false,
          });
        }
      },

      addTask: async (task) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          const newTask: Task = {
            ...task,
            id: `task${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          
          set((state) => ({
            tasks: [...state.tasks, newTask],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to add task",
            isLoading: false,
          });
        }
      },

      updateTask: async (taskId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to update task",
            isLoading: false,
          });
        }
      },

      deleteTask: async (taskId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to delete task",
            isLoading: false,
          });
        }
      },

      toggleTaskCompletion: async (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        
        if (task) {
          await get().updateTask(taskId, { completed: !task.completed });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);