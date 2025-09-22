import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.text,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray[600],
  },
  small: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.gray[600],
  },
});