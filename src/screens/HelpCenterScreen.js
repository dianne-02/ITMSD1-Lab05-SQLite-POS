import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import theme from '../theme';

const FAQS = [
  { q: 'How do I book a ride?', a: 'On the Home screen, tap "Where to?", pick a destination on the map, and press "Find ride".' },
  { q: 'How do I schedule a ride?', a: 'Go to the Rides tab, pick a date and pickup time, then tap "Schedule ride".' },
  { q: 'How do I use a promo code?', a: 'On the Wallet screen, tap Apply next to BAOFIRST before confirming your booking fee.' },
  { q: 'Is my payment information stored?', a: 'Only a local simulated card ending in 4821 is kept on your device. No real credentials are collected.' },
  { q: 'What if location permission is denied?', a: 'The app still works using Mati City, Davao Oriental as the fallback location.' },
];

export default function HelpCenterScreen({ navigation }) {
  const [open, setOpen] = useState(null);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.body}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Help center</Text>

        {FAQS.map((f, i) => (
          <TouchableOpacity key={i} style={styles.qRow} activeOpacity={0.7} onPress={() => setOpen(open === i ? null : i)}>
            <Text style={styles.q}>{f.q}</Text>
            <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.mutedAlt} />
            {open === i && <Text style={styles.a}>{f.a}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { padding: 24, paddingBottom: 40 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.ink },
  heading: { marginTop: 16, marginBottom: 16, fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  qRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  q: { flex: 1, fontFamily: theme.fonts.semiBold, fontSize: 15, color: theme.colors.ink },
  a: { width: '100%', marginTop: 8, fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.muted },
});
