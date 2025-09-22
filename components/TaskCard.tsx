import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckCircle2, Clock, User } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "./Card";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
}

export const TaskCard = ({ task, onPress }: TaskCardProps) => {
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
    <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
          <Text style={typography.h4}>{task.title}</Text>
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

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Clock size={16} color={colors.gray[600]} />
            <Text style={[typography.caption, styles.footerText]}>
              {new Date(task.deadline).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <User size={16} color={colors.gray[600]} />
            <Text style={[typography.caption, styles.footerText]}>
              {task.assignedTo}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <CheckCircle2
              size={16}
              color={task.completed ? colors.success : colors.gray[400]}
            />
            <Text
              style={[
                typography.caption,
                styles.footerText,
                task.completed && { color: colors.success },
              ]}
            >
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    marginBottom: 16,
    color: colors.gray[700],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 4,
  },
});