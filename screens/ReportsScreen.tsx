import React, { useMemo } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useData } from "@/contexts/DataContext";
import { DEVICE_TYPE_LABELS, STATUS_LABELS } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function ReportsScreen() {
  const { theme } = useTheme();
  const { services, customers, devices, isLoading, refreshData } = useData();

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = services.filter(s => {
      const date = new Date(s.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const byStatus = {
      pending: services.filter(s => s.status === "pending").length,
      in_progress: services.filter(s => s.status === "in_progress").length,
      completed: services.filter(s => s.status === "completed").length,
      cancelled: services.filter(s => s.status === "cancelled").length,
    };

    const byDeviceType: Record<string, number> = {};
    services.forEach(s => {
      const device = devices.find(d => d.id === s.deviceId);
      if (device) {
        byDeviceType[device.type] = (byDeviceType[device.type] || 0) + 1;
      }
    });

    const totalRevenue = services
      .filter(s => s.status === "completed" && s.cost)
      .reduce((sum, s) => sum + (s.cost || 0), 0);

    return {
      total: services.length,
      thisMonth: thisMonth.length,
      byStatus,
      byDeviceType,
      totalRevenue,
      totalCustomers: customers.length,
      totalDevices: devices.length,
    };
  }, [services, customers, devices]);

  const topDeviceTypes = Object.entries(stats.byDeviceType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <ScreenScrollView
      hasTransparentHeader={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
    >
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="tool" size={24} color={theme.primary} />
          <ThemedText type="h2">{stats.total}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>Ukupno servisa</ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="calendar" size={24} color={theme.primary} />
          <ThemedText type="h2">{stats.thisMonth}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>Ovog meseca</ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="users" size={24} color={theme.primary} />
          <ThemedText type="h2">{stats.totalCustomers}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>Klijenata</ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="dollar-sign" size={24} color={theme.success} />
          <ThemedText type="h2">{stats.totalRevenue}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>EUR prihoda</ThemedText>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h4" style={styles.cardTitle}>Po statusu</ThemedText>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: theme.statusPending }]} />
          <ThemedText type="body" style={styles.statusLabel}>{STATUS_LABELS.pending}</ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>{stats.byStatus.pending}</ThemedText>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: theme.statusInProgress }]} />
          <ThemedText type="body" style={styles.statusLabel}>{STATUS_LABELS.in_progress}</ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>{stats.byStatus.in_progress}</ThemedText>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: theme.statusCompleted }]} />
          <ThemedText type="body" style={styles.statusLabel}>{STATUS_LABELS.completed}</ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>{stats.byStatus.completed}</ThemedText>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: theme.statusCancelled }]} />
          <ThemedText type="body" style={styles.statusLabel}>{STATUS_LABELS.cancelled}</ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>{stats.byStatus.cancelled}</ThemedText>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h4" style={styles.cardTitle}>Po tipu uređaja</ThemedText>

        {topDeviceTypes.length > 0 ? (
          topDeviceTypes.map(([type, count]) => (
            <View key={type} style={styles.deviceRow}>
              <ThemedText type="body" style={styles.deviceLabel}>
                {DEVICE_TYPE_LABELS[type as keyof typeof DEVICE_TYPE_LABELS] || type}
              </ThemedText>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: theme.primary,
                      width: `${(count / stats.total) * 100}%`,
                    },
                  ]}
                />
              </View>
              <ThemedText type="body" style={{ fontWeight: "600", width: 30, textAlign: "right" }}>
                {count}
              </ThemedText>
            </View>
          ))
        ) : (
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Nema podataka
          </ThemedText>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    gap: Spacing.xs,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  statusLabel: {
    flex: 1,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  deviceLabel: {
    width: 100,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
});
