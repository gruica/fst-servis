import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useTheme } from "@/hooks/useTheme";
import { Service, DEVICE_TYPE_LABELS } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ServiceCardProps {
  service: Service;
  customerName: string;
  deviceInfo: string;
  onPress: () => void;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ServiceCard({ service, customerName, deviceInfo, onPress, compact = false }: ServiceCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.compactCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <View style={styles.compactHeader}>
          <ThemedText type="small" style={{ fontWeight: "600" }}>
            #{service.id.slice(-4)}
          </ThemedText>
          <StatusBadge status={service.status} small />
        </View>
        <ThemedText type="small" numberOfLines={1}>{service.description}</ThemedText>
      </Pressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText type="h4" numberOfLines={1}>{customerName}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
            {deviceInfo}
          </ThemedText>
        </View>
        <StatusBadge status={service.status} />
      </View>

      <ThemedText type="body" numberOfLines={2} style={styles.description}>
        {service.description}
      </ThemedText>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <PriorityBadge priority={service.priority} />
          {service.scheduledDate ? (
            <View style={styles.dateContainer}>
              <Feather name="calendar" size={14} color={theme.textSecondary} />
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {service.scheduledDate}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.cardPadding,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  description: {
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  compactCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
});
