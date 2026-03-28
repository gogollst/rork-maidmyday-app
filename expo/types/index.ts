export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "staff";
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  deadline: string; // ISO date string
  assignedTo: string; // Name of the staff member
  assignedToId: string; // ID of the staff member
  completed: boolean;
  createdAt: string; // ISO date string
}

export interface Schedule {
  id: string;
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  tasks: Task[];
  createdAt: string; // ISO date string
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string; // ISO date string
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO date string
  read: boolean;
  type: "task" | "message" | "schedule" | "system";
  relatedId?: string; // ID of the related item (task, message, etc.)
}