import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import PrimaryButton from '../components/PrimaryButton';

export default function SuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FakeStatusBar />
      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="chevron-back" size={20} color={theme.colors.navy} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={require('../../assets/success_hand.png')} style={styles.illustration} resizeMode="contain" />

        <Text style={styles.title}>Payment successful!</Text>
        <Text style={styles.subtitle}>
          Your home is in good hands. Maya is booked and ready to make your space shine.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Amount paid</Text>
            <Text style={styles.amount}>$140</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.indigo} />
            <Text style={styles.metaText}>Oct 12, 2026 · 10:00 AM</Text>
          </View>
          <Text style={styles.bookingId}>Booking #CL-1024 · VISA ending 1024</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Track your expert" onPress={() => navigation.navigate('TrackExpert')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  back: {
    marginLeft: 20,
    marginTop: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 24, alignItems: 'center', paddingBottom: 16 },
  illustration: { width: 280, height: 250, borderRadius: 24, marginTop: 12 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.navy, marginTop: 20 },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 18,
    width: '100%',
    marginTop: 22,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { color: theme.colors.textMuted, fontSize: 13 },
  amount: { fontSize: 22, fontWeight: '800', color: theme.colors.navy },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  metaText: { color: theme.colors.navy, fontSize: 13 },
  bookingId: { color: theme.colors.textMuted, fontSize: 12, marginTop: 10 },
  footer: { paddingVertical: 12 },
});
