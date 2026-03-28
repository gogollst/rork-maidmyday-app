import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, CheckSquare } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";
import { useTaskStore } from "@/store/taskStore";

export default function TasksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const handleFetchTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    handleFetchTasks();
  }, [handleFetchTasks]);

  const handleRefresh = () => {
    handleFetchTasks();
  };

  const getPendingTasks = () => {
    return tasks
      .filter((task) => !task.completed)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  };

  const getCompletedTasks = () => {
    return tasks
      .filter((task) => task.completed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredTasks = activeTab === "pending" ? getPendingTasks() : getCompletedTasks();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={typography.h2}>Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/create-task")}
        >
          <Plus size={24} color={colors.card} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "pending" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "completed" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={(task) => router.push(`/task/${task.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Tasks Found"
            description={`You don't have any ${activeTab} tasks`}
            buttonTitle="Create Task"
            onButtonPress={() => router.push("/create-task")}
            icon={<CheckSquare size={48} color={colors.gray[400]} />}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
});