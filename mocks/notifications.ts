import { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    title: "Task Completed",
    message: "Anna has completed vacuuming the living room.",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    type: "task",
    relatedId: "task1",
  },
  {
    id: "notif2",
    title: "New Message",
    message: "You have a new message from Maria.",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: true,
    type: "message",
    relatedId: "conv2",
  },
  {
    id: "notif3",
    title: "Task Due Soon",
    message: "The 'Clean Bathrooms' task is due tomorrow.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    type: "task",
    relatedId: "task4",
  },
  {
    id: "notif4",
    title: "Schedule Started",
    message: "The 'This Week's Cleaning' schedule has started.",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: true,
    type: "schedule",
    relatedId: "schedule1",
  },
  {
    id: "notif5",
    title: "System Update",
    message: "MaidMyDay has been updated to version 1.2.0.",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    read: true,
    type: "system",
  },
];

export const getUnreadNotificationsCount = () => {
  return mockNotifications.filter(notif => !notif.read).length;
};

export const getRecentNotifications = () => {
  return mockNotifications
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);
};