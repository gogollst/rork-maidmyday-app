import React, { useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Plus } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "@/components/Card";
import { TaskCard } from "@/components/TaskCard";
import { ScheduleCard } from "@/components/ScheduleCard";
import { useTaskStore } from "@/store/taskStore";
import { useScheduleStore } from "@/store/scheduleStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { schedules, fetchSchedules } = useScheduleStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      fetchTasks(),
      fetchSchedules(),
      fetchNotifications(),
    ]);
  }, [fetchTasks, fetchSchedules, fetchNotifications]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Get upcoming tasks (not completed, sorted by deadline)
  const upcomingTasks = React.useMemo(() => 
    tasks
      .filter(task => !task.completed)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3),
    [tasks]
  );

  // Get current schedule (if any)
  const currentSchedule = React.useMemo(() => 
    schedules.find(schedule => {
      const now = new Date();
      return new Date(schedule.startDate) <= now && new Date(schedule.endDate) >= now;
    }),
    [schedules]
  );

  // Get unread notifications
  const unreadNotifications = React.useMemo(() => 
    notifications
      .filter(notification => !notification.read)
      .slice(0, 3),
    [notifications]
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={typography.h2}>Hello, {user?.name?.split(" ")[0] || "User"}</Text>
          <Text style={[typography.body, styles.subtitle]}>
            Manage your household staff
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/notifications")}
        >
          <Bell size={24} color={colors.text} />
          {unreadNotifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadNotifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Current Schedule Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Current Schedule</Text>
          <TouchableOpacity onPress={() => router.push("/schedules")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {currentSchedule ? (
          <ScheduleCard
            schedule={currentSchedule}
            onPress={(schedule) => router.push(`/schedule/${schedule.id}`)}
          />
        ) : (
          <Card>
            <View style={styles.emptySchedule}>
              <Text style={typography.body}>No active schedule</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push("/schedules")}
              >
                <Plus size={16} color={colors.card} />
                <Text style={styles.createButtonText}>Create Schedule</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      </View>

      {/* Upcoming Tasks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={() => router.push("/tasks")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={(task) => router.push(`/task/${task.id}`)}
            />
          ))
        ) : (
          <Card>
            <View style={styles.emptyTasks}>
              <Text style={typography.body}>No upcoming tasks</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push("/tasks")}
              >
                <Plus size={16} color={colors.card} />
                <Text style={styles.createButtonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      </View>

      {/* Recent Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={typography.h3}>Recent Notifications</Text>
          <TouchableOpacity onPress={() => router.push("/notifications")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <Card>
          {unreadNotifications.length > 0 ? (
            <View style={styles.notificationsList}>
              {unreadNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={styles.notificationItem}
                  onPress={() => router.push("/notifications")}
                >
                  <View style={styles.notificationDot} />
                  <View style={styles.notificationContent}>
                    <Text style={typography.bodyBold}>{notification.title}</Text>
                    <Text style={typography.caption} numberOfLines={1}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyNotifications}>
              <Text style={typography.body}>No new notifications</Text>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  subtitle: {
    color: colors.gray[600],
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: "500",
  },
  emptySchedule: {
    alignItems: "center",
    padding: 16,
  },
  emptyTasks: {
    alignItems: "center",
    padding: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  createButtonText: {
    color: colors.card,
    fontWeight: "500",
    marginLeft: 8,
  },
  notificationsList: {
    gap: 12,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
  },
  emptyNotifications: {
    alignItems: "center",
    padding: 16,
  },
});