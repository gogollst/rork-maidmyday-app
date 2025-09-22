import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Bell, CheckCircle, Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { useNotificationStore } from "@/store/notificationStore";

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isLoading 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleNotificationPress = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return "📋";
      case "message":
        return "💬";
      case "schedule":
        return "📅";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => markAllAsRead()}
          >
            <CheckCircle size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Mark All as Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={() => clearAllNotifications()}
          >
            <Trash2 size={16} color={colors.error} />
            <Text style={[styles.actionButtonText, styles.clearButtonText]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNotificationPress(item.id)}
            activeOpacity={0.7}
          >
            <Card style={[styles.notificationCard, item.read && styles.readCard]}>
              <View style={styles.notificationHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
                </View>
                <View style={styles.notificationContent}>
                  <Text style={[typography.bodyBold, item.read && styles.readText]}>
                    {item.title}
                  </Text>
                  <Text style={[typography.body, styles.message, item.read && styles.readText]}>
                    {item.message}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.notificationActions}>
                {!item.read && (
                  <TouchableOpacity
                    style={styles.notificationAction}
                    onPress={() => markAsRead(item.id)}
                  >
                    <CheckCircle size={16} color={colors.primary} />
                    <Text style={styles.notificationActionText}>Mark as Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.notificationAction, styles.deleteAction]}
                  onPress={() => clearNotification(item.id)}
                >
                  <Trash2 size={16} color={colors.error} />
                  <Text style={styles.deleteActionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            description="You don't have any notifications yet."
            icon={<Bell size={48} color={colors.gray[400]} />}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary + "10", // 10% opacity
  },
  actionButtonText: {
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 4,
  },
  clearButton: {
    backgroundColor: colors.error + "10", // 10% opacity
  },
  clearButtonText: {
    color: colors.error,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  notificationCard: {
    padding: 16,
  },
  readCard: {
    opacity: 0.7,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    marginTop: 4,
    color: colors.gray[700],
  },
  readText: {
    color: colors.gray[500],
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  notificationAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary + "10", // 10% opacity
    marginLeft: 8,
  },
  notificationActionText: {
    color: colors.primary,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 4,
  },
  deleteAction: {
    backgroundColor: colors.error + "10", // 10% opacity
  },
  deleteActionText: {
    color: colors.error,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 4,
  },
});