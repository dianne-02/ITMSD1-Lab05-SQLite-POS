import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import CurvedHeader from '../components/CurvedHeader';
import PrimaryButton from '../components/PrimaryButton';

export default function PaymentScreen({ navigation }) {
  const [saveCard, setSaveCard] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <FakeStatusBar />
        <CurvedHeader title="Payment" onBack={() => navigation.goBack()} rightIcon="add" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Visa card */}
        <View style={styles.card}>
          <View style={styles.cardDecoration} />
          <View style={styles.cardTop}>
            <View style={styles.chip} />
            <Text style={styles.visa}>VISA</Text>
          </View>
          <Text style={styles.cardNumber}>4582  ••••  ••••  1024</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue}>DIANNE ALI</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>VALID THRU</Text>
              <Text style={styles.cardValue}>08/28</Text>
            </View>
          </View>
        </View>

        {/* Pagination dots */}
        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.sectionTitle}>Card details</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Cardholder name</Text>
          <TextInput style={styles.fieldValue} value="Dianne Ali" editable={false} />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Card number</Text>
          <View style={styles.fieldRow}>
            <TextInput style={[styles.fieldValue, { flex: 1 }]} value="4582  ••••  ••••  1024" editable={false} />
            <Ionicons name="card-outline" size={20} color={theme.colors.indigo} />
          </View>
        </View>
        <View style={styles.fieldSplit}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Expiry date</Text>
            <Text style={styles.fieldValue}>08 / 28</Text>
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>CVV</Text>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldValue, { flex: 1 }]}>•••</Text>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.indigo} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.checkRow} onPress={() => setSaveCard(!saveCard)}>
          <View style={[styles.checkbox, saveCard && styles.checkboxActive]}>
            {saveCard && <Ionicons name="checkmark" size={14} color={theme.colors.white} />}
          </View>
          <Text style={styles.checkLabel}>Save card for future payments</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Pay · $140" onPress={() => navigation.navigate('Success')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerWrap: { backgroundColor: theme.colors.lavender },
  scroll: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 18 },
  card: {
    backgroundColor: theme.colors.cardIndigo,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  cardDecoration: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -60,
    right: -40,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: {
    width: 34,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  visa: { color: theme.colors.white, fontSize: 22, fontWeight: '800', fontStyle: 'italic' },
  cardNumber: { color: theme.colors.white, fontSize: 20, letterSpacing: 2, marginTop: 22 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 1 },
  cardValue: { color: theme.colors.white, fontWeight: '700', fontSize: 13, marginTop: 4 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  dotActive: { width: 20, height: 6, borderRadius: 3, backgroundColor: theme.colors.indigo },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.lavenderMid },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.navy, marginTop: 22 },
  field: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center' },
  fieldSplit: { flexDirection: 'row', gap: 12 },
  fieldLabel: { color: theme.colors.textMuted, fontSize: 11 },
  fieldValue: { color: theme.colors.navy, fontSize: 15, fontWeight: '600', marginTop: 4 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: theme.colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: theme.colors.indigo },
  checkLabel: { color: theme.colors.textMuted, fontSize: 13 },
  footer: { paddingVertical: 12 },
});
