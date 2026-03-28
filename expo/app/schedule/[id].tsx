import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Plus 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TaskCard } from "@/components/TaskCard";
import { useScheduleStore } from "@/store/scheduleStore";

export default function ScheduleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { schedules, deleteSchedule, isLoading } = useScheduleStore();
  const [schedule, setSchedule] = useState(schedules.find(s => s.id === id));

  useEffect(() => {
    // Update schedule when schedules change
    setSchedule(schedules.find(s => s.id === id));
  }, [schedules, id]);

  if (!schedule) {
    return (
      <View style={styles.container}>
        <Text style={typography.h3}>Schedule not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.button}
        />
      </View>
    );
  }

  const handleDeleteSchedule = () => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to delete this schedule?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSchedule(schedule.id);
            router.back();
          },
        },
      ]
    );
  };

  const completedTasks = schedule.tasks.filter(task => task.completed).length;
  const progress = schedule.tasks.length > 0 
    ? (completedTasks / schedule.tasks.length) * 100 
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.scheduleCard}>
        <Text style={typography.h2}>{schedule.title}</Text>
        
        <View style={styles.dateContainer}>
          <Calendar size={20} color={colors.gray[600]} />
          <Text style={[typography.body, styles.dateText]}>
            {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={typography.bodyBold}>Progress</Text>
            <Text style={typography.body}>
              {completedTasks} of {schedule.tasks.length} tasks completed
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: progress + '%' }]}
            />
          </View>
        </View>
      </Card>

      <View style={styles.tasksHeader}>
        <Text style={typography.h3}>Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // In a real app, this would navigate to add task to schedule
            alert("Add task to schedule functionality would be implemented here");
          }}
        >
          <Plus size={16} color={colors.card} />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {schedule.tasks.length > 0 ? (
        schedule.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={(task) => router.push(`/task/${task.id}`)}
          />
        ))
      ) : (
        <Card>
          <View style={styles.emptyTasks}>
            <Text style={typography.body}>No tasks in this schedule</Text>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => {
                // In a real app, this would navigate to add task to schedule
                alert("Add task to schedule functionality would be implemented here");
              }}
            >
              <Plus size={16} color={colors.card} />
              <Text style={styles.addTaskButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteSchedule}
      >
        <Trash2 size={20} color={colors.error} />
        <Text style={styles.deleteText}>Delete Schedule</Text>
      </TouchableOpacity>
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
  scheduleCard: {
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  dateText: {
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.card,
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyTasks: {
    alignItems: "center",
    padding: 24,
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addTaskButtonText: {
    color: colors.card,
    fontWeight: "500",
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.error + "10", // 10% opacity
    marginTop: 24,
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