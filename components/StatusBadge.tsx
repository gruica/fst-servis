import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { ServiceStatus, STATUS_LABELS } from "../types";
import { Spacing, BorderRadius } from "../constants/theme";

interface StatusBadgeProps {
  status: ServiceStatus;
  small?: boolean;
}

export function StatusBadge({ status, small = false }: StatusBadgeProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return theme.statusPending;
      case "in_progress":
        return theme.statusInProgress;
      case "completed":
        return theme.statusCompleted;
      case "cancelled":
        return theme.statusCancelled;
      default:
        return theme.textSecondary;
    }
  };

  const statusColor = getStatusColor();

  return (
    <View
      style={[
        styles.badge,
        small && styles.badgeSmall,
        { backgroundColor: `${statusColor}20` },
      ]}
    >
      <ThemedText
        type="small"
        style={[
          styles.text,
          small && styles.textSmall,
          { color: statusColor },
        ]}
      >
        {STATUS_LABELS[status]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 10,
  },
});
