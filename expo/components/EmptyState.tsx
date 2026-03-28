import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  buttonTitle,
  onButtonPress,
  icon,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[typography.h3, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.description]}>{description}</Text>
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    color: colors.gray[600],
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});