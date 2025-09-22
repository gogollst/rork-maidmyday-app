import { Schedule } from "@/types";
import { mockTasks } from "./tasks";

export const mockSchedules: Schedule[] = [
  {
    id: "schedule1",
    title: "This Week's Cleaning",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 86400000).toISOString(), // 7 days from now
    tasks: [mockTasks[0], mockTasks[3], mockTasks[5]],
    createdAt: new Date().toISOString(),
  },
  {
    id: "schedule2",
    title: "Monthly Deep Clean",
    startDate: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
    endDate: new Date(Date.now() + 14 * 86400000).toISOString(), // 14 days from now
    tasks: [mockTasks[1], mockTasks[2], mockTasks[4]],
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
  },
  {
    id: "schedule3",
    title: "Special Event Preparation",
    startDate: new Date(Date.now() + 21 * 86400000).toISOString(), // 21 days from now
    endDate: new Date(Date.now() + 22 * 86400000).toISOString(), // 22 days from now
    tasks: [
      mockTasks[0],
      mockTasks[1],
      mockTasks[3],
      mockTasks[5],
    ],
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), // 14 days ago
  },
];

export const getCurrentSchedule = () => {
  const now = new Date();
  return mockSchedules.find(
    schedule =>
      new Date(schedule.startDate) <= now && new Date(schedule.endDate) >= now
  );
};

export const getUpcomingSchedules = () => {
  const now = new Date();
  return mockSchedules
    .filter(schedule => new Date(schedule.startDate) > now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
};