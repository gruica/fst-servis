import React, { useMemo, useState } from "react";
import { View, StyleSheet, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "../components/ScreenScrollView";
import { ThemedText } from "../components/ThemedText";
import { StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
import { useTheme } from "../hooks/useTheme";
import { useData } from "../contexts/DataContext";
import { DEVICE_TYPE_LABELS } from "../types";
import { Spacing, BorderRadius } from "../constants/theme";

const DAYS = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
const MONTHS = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];

export default function ScheduleScreen() {
  const { theme } = useTheme();
  const { services, customers, devices, isLoading, refreshData } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const scheduledServices = useMemo(() => {
    return services.filter(s => s.scheduledDate && s.status !== "completed" && s.status !== "cancelled");
  }, [services]);

  const getServicesForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return scheduledServices.filter(s => s.scheduledDate === dateStr);
  };

  const todaysServices = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return services.filter(s =>
      (s.scheduledDate === todayStr || s.createdAt === todayStr) &&
      s.status !== "completed" && s.status !== "cancelled"
    );
  }, [services]);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayServices = getServicesForDate(day);
      const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

      days.push(
        <View key={day} style={styles.dayCell}>
          <View style={[
            styles.dayNumber,
            isToday && { backgroundColor: theme.primary },
          ]}>
            <ThemedText
              type="small"
              style={[
                styles.dayText,
                isToday && { color: "#fff" },
              ]}
            >
              {day}
            </ThemedText>
          </View>
          {dayServices.length > 0 ? (
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          ) : null}
        </View>
      );
    }

    return days;
  };

  return (
    <ScreenScrollView
      hasTransparentHeader={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
    >
      <View style={[styles.calendarCard, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => changeMonth(-1)} style={styles.monthButton}>
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>
          <ThemedText type="h4">{MONTHS[currentMonth]} {currentYear}</ThemedText>
          <Pressable onPress={() => changeMonth(1)} style={styles.monthButton}>
            <Feather name="chevron-right" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.weekHeader}>
          {DAYS.map(day => (
            <View key={day} style={styles.weekDay}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>{day}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {renderCalendar()}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Danas ({todaysServices.length})
        </ThemedText>

        {todaysServices.length > 0 ? (
          todaysServices.map(service => {
            const customer = customers.find(c => c.id === service.customerId);
            const device = devices.find(d => d.id === service.deviceId);
            return (
              <View key={service.id} style={[styles.serviceCard, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.serviceHeader}>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>
                    {customer?.name || "Nepoznat"}
                  </ThemedText>
                  <StatusBadge status={service.status} />
                </View>
                {device ? (
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {device.brand} {device.model} - {DEVICE_TYPE_LABELS[device.type]}
                  </ThemedText>
                ) : null}
                <ThemedText type="small" numberOfLines={2} style={{ marginTop: Spacing.xs }}>
                  {service.description}
                </ThemedText>
              </View>
            );
          })
        ) : (
          <EmptyState
            icon="calendar"
            title="Nema zakazanih servisa"
            message="Danas nemate zakazanih servisa"
          />
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  monthButton: {
    padding: Spacing.sm,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  weekDay: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  serviceCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
});
