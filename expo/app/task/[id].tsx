import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  Calendar, 
  Clock, 
  User, 
  Flag, 
  CheckCircle2, 
  Trash2 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTaskStore } from "@/store/taskStore";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, toggleTaskCompletion, deleteTask, isLoading } = useTaskStore();
  const [task, setTask] = useState(tasks.find(t => t.id === id));

  useEffect(() => {
    // Update task when tasks change
    setTask(tasks.find(t => t.id === id));
  }, [tasks, id]);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={typography.h3}>Task not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </View>
    );
  }

  const handleToggleCompletion = async () => {
    await toggleTaskCompletion(task.id);
  };

  const handleDeleteTask = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTask(task.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleChatWithStaff = () => {
    // In a real app, this would navigate to the chat with the assigned staff
    // For this prototype, we'll just show an alert
    alert(`Chat with ${task.assignedTo} would open here`);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.gray[500];
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.taskCard}>
        <View style={styles.header}>
          <Text style={typography.h2}>{task.title}</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor() },
            ]}
          >
            <Text style={styles.priorityText}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={[typography.body, styles.description]}>
          {task.description}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Calendar size={20} color={colors.gray[600]} />
            <Text style={[typography.body, styles.detailText]}>
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Clock size={20} color={colors.gray[600]} />
            <Text style={[typography.body, styles.detailText]}>
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <User size={20} color={colors.gray[600]} />
            <Text style={[typography.body, styles.detailText]}>
              Assigned to: {task.assignedTo}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Flag size={20} color={getPriorityColor()} />
            <Text style={[typography.body, styles.detailText]}>
              Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <CheckCircle2
              size={20}
              color={task.completed ? colors.success : colors.gray[400]}
            />
            <Text
              style={[
                typography.body,
                styles.detailText,
                task.completed && { color: colors.success },
              ]}
            >
              Status: {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          onPress={handleToggleCompletion}
          loading={isLoading}
          variant={task.completed ? "outline" : "primary"}
          style={styles.actionButton}
        />

        <Button
          title="Chat with Staff"
          onPress={handleChatWithStaff}
          variant="secondary"
          style={styles.actionButton}
        />

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteTask}
        >
          <Trash2 size={20} color={colors.error} />
          <Text style={styles.deleteText}>Delete Task</Text>
        </TouchableOpacity>
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
  },
  taskCard: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "600",
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  detailsContainer: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 12,
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    width: "100%",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.error + "10", // 10% opacity
  },
  deleteText: {
    color: colors.error,
    fontWeight: "600",
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
  },
});