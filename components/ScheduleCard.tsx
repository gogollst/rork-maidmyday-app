import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Calendar, CheckCircle2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "./Card";
import { Schedule } from "@/types";

interface ScheduleCardProps {
  schedule: Schedule;
  onPress: (schedule: Schedule) => void;
}

export const ScheduleCard = ({ schedule, onPress }: ScheduleCardProps) => {
  const completedTasks = schedule.tasks.filter((task) => task.completed).length;
  const progress = schedule.tasks.length > 0 
    ? (completedTasks / schedule.tasks.length) * 100 
    : 0;

  return (
    <TouchableOpacity onPress={() => onPress(schedule)} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
          <Text style={typography.h4}>{schedule.title}</Text>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.gray[600]} />
            <Text style={[typography.caption, styles.dateText]}>
              {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={typography.caption}>
            {completedTasks} of {schedule.tasks.length} tasks completed
          </Text>
        </View>

        <View style={styles.tasksContainer}>
          {schedule.tasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <CheckCircle2
                size={16}
                color={task.completed ? colors.success : colors.gray[400]}
              />
              <Text
                style={[
                  typography.caption,
                  styles.taskText,
                  task.completed && styles.completedTask,
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
            </View>
          ))}
          {schedule.tasks.length > 3 && (
            <Text style={[typography.caption, styles.moreText]}>
              +{schedule.tasks.length - 3} more tasks
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    marginLeft: 4,
    color: colors.gray[600],
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  tasksContainer: {
    gap: 8,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskText: {
    marginLeft: 8,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: colors.gray[500],
  },
  moreText: {
    color: colors.primary,
    marginTop: 4,
  },
});