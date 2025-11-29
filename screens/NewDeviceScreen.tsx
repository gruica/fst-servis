import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useData } from "../contexts/DataContext";
import { CustomersStackParamList } from "../navigation/CustomersStackNavigator";
import { DeviceType, DEVICE_TYPE_LABELS } from "./types";
import { Spacing, BorderRadius } from "./constants/theme";

type Props = {
  navigation: NativeStackNavigationProp<CustomersStackParamList, "NewDevice">;
  route: RouteProp<CustomersStackParamList, "NewDevice">;
};

const DEVICE_TYPES: DeviceType[] = [
  "washing_machine", "dryer", "dishwasher", "refrigerator",
  "freezer", "oven", "microwave", "air_conditioner", "other"
];

export default function NewDeviceScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addDevice } = useData();
  const { customerId, scannedData } = route.params;

  const [type, setType] = useState<DeviceType>("washing_machine");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (scannedData) {
      if (scannedData.brand) setBrand(scannedData.brand);
      if (scannedData.model) setModel(scannedData.model);
      if (scannedData.serialNumber) setSerialNumber(scannedData.serialNumber);
    }
  }, [scannedData]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <ThemedText type="body" style={{ color: theme.primary }}>Odustani</ThemedText>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSubmit} disabled={isSubmitting}>
          <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>Sačuvaj</ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, theme, isSubmitting, brand, model]);

  const handleSubmit = async () => {
    if (!brand.trim()) {
      Alert.alert("Greška", "Unesite brend uređaja");
      return;
    }
    if (!model.trim()) {
      Alert.alert("Greška", "Unesite model uređaja");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDevice({
        customerId,
        type,
        brand: brand.trim(),
        model: model.trim(),
        serialNumber: serialNumber.trim() || undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert("Greška", "Nije moguće dodati uređaj");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenScanner = () => {
    navigation.navigate("QRScanner", { customerId });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={[styles.scanButton, { backgroundColor: theme.primary }]}
          onPress={handleOpenScanner}
        >
          <Feather name="camera" size={24} color="#fff" />
          <View style={styles.scanButtonContent}>
            <ThemedText type="body" style={styles.scanButtonTitle}>
              Skeniraj QR/Bar kod
            </ThemedText>
            <ThemedText type="small" style={styles.scanButtonSubtitle}>
              Brzo dodajte uređaj skeniranjem koda
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={24} color="#fff" />
        </Pressable>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <ThemedText type="small" style={[styles.dividerText, { color: theme.textSecondary }]}>
            ili unesite ručno
          </ThemedText>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Tip uređaja</ThemedText>
          <View style={styles.typeContainer}>
            {DEVICE_TYPES.map(t => (
              <Pressable
                key={t}
                style={[
                  styles.typeChip,
                  { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
                  type === t && { borderColor: theme.primary, borderWidth: 2 },
                ]}
                onPress={() => setType(t)}
              >
                <ThemedText
                  type="small"
                  style={{ color: type === t ? theme.primary : theme.text, fontWeight: type === t ? "600" : "400" }}
                >
                  {DEVICE_TYPE_LABELS[t]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Brend *
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={brand}
            onChangeText={setBrand}
            placeholder="npr. Beko, Gorenje, Bosch..."
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Model *
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={model}
            onChangeText={setModel}
            placeholder="npr. WTV 8612 XS"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Serijski broj
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={serialNumber}
            onChangeText={setSerialNumber}
            placeholder="Opciono"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  scanButtonContent: {
    flex: 1,
  },
  scanButtonTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 2,
  },
  scanButtonSubtitle: {
    color: "rgba(255,255,255,0.8)",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing["2xl"],
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    borderWidth: 1,
  },
});
