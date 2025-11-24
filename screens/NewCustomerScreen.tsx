import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useData } from "@/contexts/DataContext";
import { CustomersStackParamList } from "@/navigation/CustomersStackNavigator";
import { Spacing, BorderRadius } from "@/constants/theme";

type Props = {
  navigation: NativeStackNavigationProp<CustomersStackParamList, "NewCustomer">;
};

export default function NewCustomerScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addCustomer } = useData();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [navigation, theme, isSubmitting, name, phone, address]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Greška", "Unesite ime klijenta");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Greška", "Unesite broj telefona");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Greška", "Unesite adresu");
      return;
    }

    setIsSubmitting(true);
    try {
      await addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        notes: notes.trim() || undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert("Greška", "Nije moguće dodati klijenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Ime i prezime *
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Unesite ime klijenta"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Telefon *
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="+382 67 123 456"
            placeholderTextColor={theme.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Email
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Adresa *
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Ulica i broj, grad"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Napomene
          </ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Dodatne napomene o klijentu..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
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
  textArea: {
    minHeight: 80,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
});
