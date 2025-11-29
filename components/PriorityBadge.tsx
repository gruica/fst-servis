import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Priority, PRIORITY_LABELS } from "../types";
import { Spacing, BorderRadius } from "../constants/theme";

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { theme } = useTheme();

  const getPriorityColor = () => {
    switch (priority) {
      case "urgent":
        return theme.error;
      case "high":
        return theme.warning;
      case "medium":
        return theme.primary;
      case "low":
        return theme.textSecondary;
      default:
        return theme.textSecondary;
    }
  };

  const priorityColor = getPriorityColor();

  return (
    <View style={[styles.badge, { backgroundColor: `${priorityColor}15` }]}>
      {priority === "urgent" || priority === "high" ? (
        <Feather name="alert-circle" size={12} color={priorityColor} />
      ) : null}
      <ThemedText type="small" style={{ color: priorityColor, fontWeight: "500" }}>
        {PRIORITY_LABELS[priority]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
});
