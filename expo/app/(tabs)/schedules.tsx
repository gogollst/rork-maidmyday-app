import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Calendar } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { ScheduleCard } from "@/components/ScheduleCard";
import { EmptyState } from "@/components/EmptyState";
import { useScheduleStore } from "@/store/scheduleStore";

export default function SchedulesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { schedules, fetchSchedules, isLoading } = useScheduleStore();
  const [activeTab, setActiveTab] = useState<"current" | "upcoming" | "past">("current");

  const handleFetchSchedules = useCallback(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    handleFetchSchedules();
  }, [handleFetchSchedules]);

  const handleRefresh = () => {
    handleFetchSchedules();
  };

  const getCurrentSchedules = () => {
    const now = new Date();
    return schedules.filter(
      (schedule) =>
        new Date(schedule.startDate) <= now && new Date(schedule.endDate) >= now
    );
  };

  const getUpcomingSchedules = () => {
    const now = new Date();
    return schedules.filter(
      (schedule) => new Date(schedule.startDate) > now
    );
  };

  const getPastSchedules = () => {
    const now = new Date();
    return schedules.filter(
      (schedule) => new Date(schedule.endDate) < now
    );
  };

  const getFilteredSchedules = () => {
    switch (activeTab) {
      case "current":
        return getCurrentSchedules();
      case "upcoming":
        return getUpcomingSchedules();
      case "past":
        return getPastSchedules();
      default:
        return [];
    }
  };

  const filteredSchedules = getFilteredSchedules();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={typography.h2}>Weekly Plans</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // In a real app, this would navigate to a create schedule screen
            // For this prototype, we'll just show an alert
            alert("Create schedule functionality would be implemented here");
          }}
        >
          <Plus size={24} color={colors.card} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "current" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeTabText,
            ]}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "upcoming" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "past" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSchedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScheduleCard
            schedule={item}
            onPress={(schedule) => router.push(`/schedule/${schedule.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Schedules Found"
            description={`You don't have any ${activeTab} schedules`}
            buttonTitle="Create Schedule"
            onButtonPress={() => {
              // In a real app, this would navigate to a create schedule screen
              alert("Create schedule functionality would be implemented here");
            }}
            icon={<Calendar size={48} color={colors.gray[400]} />}
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