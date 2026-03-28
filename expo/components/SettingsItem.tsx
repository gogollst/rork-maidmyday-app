import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";

interface SettingsItemProps {
  title: string;
  icon?: ReactNode;
  onPress?: () => void;
  rightElement?: ReactNode;
  showChevron?: boolean;
}

export const SettingsItem = ({
  title,
  icon,
  onPress,
  rightElement,
  showChevron = true,
}: SettingsItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.leftContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={typography.body}>{title}</Text>
      </View>
      <View style={styles.rightContent}>
        {rightElement}
        {showChevron && onPress && (
          <ChevronRight size={20} color={colors.gray[400]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});