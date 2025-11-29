import React, { useState, useMemo, useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, Pressable, RefreshControl, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenFlatList } from "../components/ScreenFlatList";
import { ServiceCard } from "../components/ServiceCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { StatusFilter } from "../components/StatusFilter";
import { EmptyState } from "../components/EmptyState";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { ServicesStackParamList } from "../navigation/ServicesStackNavigator";
import { Service, ServiceStatus } from "./types";
import { Spacing, BorderRadius } from "./constants/theme";
import { registerForPushNotifications } from "../utils/notifications";

type Props = {
  navigation: NativeStackNavigationProp<ServicesStackParamList, "Services">;
};

export default function ServicesScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { services, customers, devices, isLoading, refreshData } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const notificationInitialized = useRef(false);

  useEffect(() => {
    if (!isLoading && !notificationInitialized.current && Platform.OS !== "web") {
      notificationInitialized.current = true;
      registerForPushNotifications().catch(console.log);
    }
  }, [isLoading]);

  const filteredServices = useMemo(() => {
    let servicesList = services;
    
    // Poslovni partneri vide samo svoje servise
    if (user?.role === 'business_partner') {
      servicesList = servicesList.filter(s => s.createdByUserId === user.id);
    }
    
    return servicesList
      .filter(service => {
        if (statusFilter !== "all" && service.status !== statusFilter) return false;
        if (searchQuery) {
          const customer = customers.find(c => c.id === service.customerId);
          const device = devices.find(d => d.id === service.deviceId);
          const query = searchQuery.toLowerCase();
          return (
            customer?.name.toLowerCase().includes(query) ||
            device?.brand.toLowerCase().includes(query) ||
            device?.model.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [services, customers, devices, searchQuery, statusFilter, user]);

  const handleServicePress = (service: Service) => {
    navigation.navigate("ServiceDetail", { serviceId: service.id });
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const renderItem = ({ item }: { item: Service }) => {
    const customer = customers.find(c => c.id === item.customerId);
    const device = devices.find(d => d.id === item.deviceId);
    return (
      <ServiceCard
        service={item}
        customerName={customer?.name || "Nepoznat"}
        deviceInfo={device ? `${device.brand} ${device.model}` : "Nepoznat uređaj"}
        onPress={() => handleServicePress(item)}
      />
    );
  };

  return (
    <>
      <ScreenFlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.searchRow}>
              <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
                <Feather name="search" size={20} color={theme.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Pretraga servisa..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <Feather name="x" size={20} color={theme.textSecondary} />
                  </Pressable>
                ) : null}
              </View>
              <Pressable
                style={[styles.profileButton, { backgroundColor: theme.backgroundDefault }]}
                onPress={handleProfilePress}
              >
                <Feather name="user" size={22} color={theme.primary} />
              </Pressable>
            </View>
            <StatusFilter
              selectedStatus={statusFilter}
              onSelectStatus={setStatusFilter}
            />
            <ThemedText type="small" style={[styles.resultCount, { color: theme.textSecondary }]}>
              {filteredServices.length} {filteredServices.length === 1 ? "servis" : "servisa"}
            </ThemedText>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="tool"
            title="Nema servisa"
            message={searchQuery || statusFilter !== "all" ? "Nema rezultata za ovu pretragu" : "Dodajte novi servis pritiskom na + dugme"}
          />
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
        contentContainerStyle={styles.listContent}
      />
      <FloatingActionButton
        onPress={() => navigation.navigate("NewService")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  resultCount: {
    marginTop: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing["5xl"],
  },
});
