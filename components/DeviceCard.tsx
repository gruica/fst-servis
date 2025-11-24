import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Device, DEVICE_TYPE_LABELS } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

interface DeviceCardProps {
  device: Device;
  onPress: () => void;
}

export function DeviceCard({ device, onPress }: DeviceCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Feather name="box" size={24} color={theme.primary} />
      <View style={styles.info}>
        <ThemedText type="body" style={{ fontWeight: "600" }}>
          {device.brand} {device.model}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {DEVICE_TYPE_LABELS[device.type]}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
});
