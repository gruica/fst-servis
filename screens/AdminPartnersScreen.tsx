import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';

interface Partner {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: string;
}

const DEMO_PARTNERS: Partner[] = [
  {
    id: '3',
    name: 'Aleksandar Nikolić',
    companyName: 'ElektroShop D.O.O',
    email: 'partner@fst.me',
    phone: '+382 69 999 111',
    createdAt: '2024-11-20',
  },
];

export default function AdminPartnersScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>(DEMO_PARTNERS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
  });

  if (user?.role !== 'admin') {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Samo admin može upravljati partnerima.</ThemedText>
      </ThemedView>
    );
  }

  const handleAddPartner = async () => {
    if (!formData.name.trim() || !formData.companyName.trim() || !formData.email.trim()) {
      Alert.alert('Greška', 'Popunite sva obavezna polja');
      return;
    }

    const newPartner: Partner = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPartners([...partners, newPartner]);
    setFormData({ name: '', companyName: '', email: '', phone: '' });
    setShowForm(false);
    Alert.alert('Uspešno', 'Partner je dodan');
  };

  const handleDeletePartner = (id: string) => {
    Alert.alert('Obriši Partnera', 'Da li ste sigurni?', [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: () => {
          setPartners(partners.filter(p => p.id !== id));
          Alert.alert('Obrisano', 'Partner je obrisan');
        },
      },
    ]);
  };

  const renderPartnerCard = ({ item }: { item: Partner }) => (
    <ThemedView style={[styles.partnerCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.partnerHeader}>
        <View style={styles.partnerInfo}>
          <ThemedText type="h4">{item.name}</ThemedText>
          <ThemedText style={[styles.companyName, { color: theme.textSecondary }]}>{item.companyName}</ThemedText>
        </View>
        <Pressable onPress={() => handleDeletePartner(item.id)} style={styles.deleteButton}>
          <Feather name="trash-2" size={20} color="#F87171" />
        </Pressable>
      </View>
      <View style={styles.partnerDetails}>
        <View style={styles.detailRow}>
          <Feather name="mail" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>{item.email}</ThemedText>
        </View>
        {item.phone && (
          <View style={styles.detailRow}>
            <Feather name="phone" size={16} color={theme.textSecondary} />
            <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>{item.phone}</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.lg }]}>
      <View style={styles.header}>
        <ThemedText type="h2">Upravljanje Partnerima</ThemedText>
        <Button
          onPress={() => setShowForm(!showForm)}
          style={styles.toggleButton}
        >
          {showForm ? 'Otkaži' : 'Dodaj Partnera'}
        </Button>
      </View>

      {showForm && (
        <ThemedView style={[styles.form, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.formTitle}>Novi Partner</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Ime *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
              placeholder="Unesite ime"
              placeholderTextColor={theme.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Kompanija *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
              placeholder="Unesite naziv kompanije"
              placeholderTextColor={theme.textSecondary}
              value={formData.companyName}
              onChangeText={(text) => setFormData({ ...formData, companyName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Email *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
              placeholder="Unesite email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Telefon</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
              placeholder="Unesite telefon"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <Button onPress={handleAddPartner} style={styles.submitButton}>
            Dodaj Partnera
          </Button>
        </ThemedView>
      )}

      <FlatList
        data={partners}
        renderItem={renderPartnerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="users" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>Nema dodata partnera</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  toggleButton: {
    marginTop: Spacing.md,
  },
  form: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  formTitle: {
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  input: {
    height: 44,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    fontSize: 16,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  partnerCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  partnerInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.md,
  },
  partnerDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: 14,
  },
});
