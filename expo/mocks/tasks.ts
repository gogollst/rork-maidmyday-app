import { Task } from "@/types";

export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Vacuum Living Room",
    description: "Vacuum the entire living room, including under the furniture and the corners.",
    priority: "high",
    deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    assignedTo: "Anna Johnson",
    assignedToId: "user2",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task2",
    title: "Clean Kitchen",
    description: "Wipe down all surfaces, clean the sink, and mop the floor.",
    priority: "medium",
    deadline: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    assignedTo: "Maria Garcia",
    assignedToId: "user3",
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "task3",
    title: "Laundry",
    description: "Wash, dry, and fold all clothes in the laundry basket.",
    priority: "low",
    deadline: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    assignedTo: "Robert Chen",
    assignedToId: "user4",
    completed: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: "task4",
    title: "Clean Bathrooms",
    description: "Clean all bathrooms, including toilets, showers, and sinks.",
    priority: "high",
    deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    assignedTo: "Anna Johnson",
    assignedToId: "user2",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task5",
    title: "Water Plants",
    description: "Water all indoor and outdoor plants.",
    priority: "low",
    deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    assignedTo: "Maria Garcia",
    assignedToId: "user3",
    completed: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    id: "task6",
    title: "Dust Furniture",
    description: "Dust all furniture in the living room and bedrooms.",
    priority: "medium",
    deadline: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    assignedTo: "Robert Chen",
    assignedToId: "user4",
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
];

export const getUpcomingTasks = () => {
  return mockTasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};

export const getCompletedTasks = () => {
  return mockTasks
    .filter(task => task.completed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getTasksByAssignee = (assigneeId: string) => {
  return mockTasks.filter(task => task.assignedToId === assigneeId);
};