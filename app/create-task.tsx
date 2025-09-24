import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useTaskStore } from "@/store/taskStore";
import { mockUsers } from "@/mocks/users";

export default function CreateTaskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addTask, isLoading } = useTaskStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");

  const staffMembers = mockUsers.filter(u => u.role === "staff");

  const validateForm = () => {
    let isValid = true;

    setTitleError("");
    setDescriptionError("");
    setDeadlineError("");
    setAssignedToError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    }

    if (!deadline.trim()) {
      setDeadlineError("Deadline is required");
      isValid = false;
    } else if (isNaN(Date.parse(deadline))) {
      setDeadlineError("Please enter a valid date");
      isValid = false;
    }

    if (!assignedTo.trim()) {
      setAssignedToError("Assigned to is required");
      isValid = false;
    } else {
      const staff = staffMembers.find(s => s.name === assignedTo.trim());
      if (!staff) {
        setAssignedToError("Please select a valid staff member");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    const staff = staffMembers.find(s => s.name === assignedTo.trim());
    if (!staff) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline: new Date(deadline).toISOString(),
      assignedTo: staff.name,
      assignedToId: staff.id,
      completed: false,
    };

    await addTask(taskData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            error={titleError}
            containerStyle={styles.input}
          />

          <Input
            label="Description"
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            error={descriptionError}
            multiline
            containerStyle={styles.input}
          />

          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priority</Text>
            <View style={styles.priorityButtons}>
              {(["low", "medium", "high"] as const).map((priorityLevel) => (
                <Button
                  key={priorityLevel}
                  title={priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}
                  onPress={() => {
                    if (priorityLevel && priorityLevel.trim() && priorityLevel.length <= 10) {
                      setPriority(priorityLevel);
                    }
                  }}
                  variant={priority === priorityLevel ? "primary" : "outline"}
                  size="small"
                  style={styles.priorityButton}
                />
              ))}
            </View>
          </View>

          <Input
            label="Deadline"
            placeholder="YYYY-MM-DD"
            value={deadline}
            onChangeText={setDeadline}
            error={deadlineError}
            containerStyle={styles.input}
          />

          <Input
            label="Assign To"
            placeholder="Select staff member"
            value={assignedTo}
            onChangeText={setAssignedTo}
            error={assignedToError}
            containerStyle={styles.input}
          />

          <View style={styles.staffList}>
            <Text style={styles.staffLabel}>Available Staff:</Text>
            {staffMembers.map((staff) => (
              <Button
                key={staff.id}
                title={staff.name}
                onPress={() => setAssignedTo(staff.name)}
                variant="outline"
                size="small"
                style={styles.staffButton}
              />
            ))}
          </View>

          <Button
            title="Create Task"
            onPress={handleCreateTask}
            loading={isLoading}
            style={styles.createButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  form: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  priorityContainer: {
    marginBottom: 16,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  staffList: {
    marginBottom: 16,
  },
  staffLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  staffButton: {
    marginBottom: 8,
  },
  createButton: {
    marginTop: 16,
  },
});