import React from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { ServiceStatus, STATUS_LABELS } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

type FilterStatus = ServiceStatus | "all";

interface StatusFilterProps {
  selectedStatus: FilterStatus;
  onSelectStatus: (status: FilterStatus) => void;
}

const STATUSES: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "Svi" },
  { key: "pending", label: STATUS_LABELS.pending },
  { key: "in_progress", label: STATUS_LABELS.in_progress },
  { key: "completed", label: STATUS_LABELS.completed },
  { key: "cancelled", label: STATUS_LABELS.cancelled },
];

export function StatusFilter({ selectedStatus, onSelectStatus }: StatusFilterProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {STATUSES.map(({ key, label }) => (
        <Pressable
          key={key}
          onPress={() => onSelectStatus(key)}
          style={[
            styles.chip,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            selectedStatus === key && { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
        >
          <ThemedText
            type="small"
            style={[
              styles.chipText,
              { color: selectedStatus === key ? "#fff" : theme.text },
            ]}
          >
            {label}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -Spacing.xl,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: "500",
  },
});
