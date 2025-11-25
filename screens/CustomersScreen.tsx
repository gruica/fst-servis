import React, { useState, useMemo } from "react";
import { View, StyleSheet, TextInput, Pressable, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { CustomerCard } from "@/components/CustomerCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { CustomersStackParamList } from "@/navigation/CustomersStackNavigator";
import { Customer } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

type Props = {
  navigation: NativeStackNavigationProp<CustomersStackParamList, "Customers">;
};

export default function CustomersScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { customers, devices, isLoading, refreshData } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    let customersList = customers;
    
    // Poslovni partneri vide samo svoje klijente
    if (user?.role === 'business_partner') {
      customersList = customersList.filter(c => c.createdByUserId === user.id);
    }
    
    return customersList
      .filter(customer => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            customer.name.toLowerCase().includes(query) ||
            customer.phone.includes(query) ||
            customer.address.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, searchQuery, user]);

  const handleCustomerPress = (customer: Customer) => {
    navigation.navigate("CustomerDetail", { customerId: customer.id });
  };

  const handleAddCustomer = () => {
    navigation.navigate("NewCustomer");
  };

  const renderItem = ({ item }: { item: Customer }) => {
    const deviceCount = devices.filter(d => d.customerId === item.id).length;
    return (
      <CustomerCard
        customer={item}
        deviceCount={deviceCount}
        onPress={() => handleCustomerPress(item)}
      />
    );
  };

  return (
    <ScreenFlatList
      data={filteredCustomers}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.searchRow}>
            <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
              <Feather name="search" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Pretraga klijenata..."
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
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={handleAddCustomer}
            >
              <Feather name="plus" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          icon="users"
          title="Nema klijenata"
          message={searchQuery ? "Nema rezultata za ovu pretragu" : "Dodajte novog klijenta"}
        />
      }
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
      }
    />
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
