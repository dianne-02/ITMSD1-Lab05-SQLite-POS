import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import Header from '../components/Header';
import { loadPaymentMethods, savePaymentMethods } from '../services/storageService';

export default function PaymentMethodsScreen({ navigation }) {
  const [methods, setMethods] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadPaymentMethods().then(setMethods);
    }, [])
  );

  const addMethod = async () => {
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    const next = [...methods, { id: String(Date.now()), brand: 'BAO PAY', last4, label: 'Added' }];
    setMethods(next);
    await savePaymentMethods(next);
    Alert.alert('Payment method added', `BAO PAY •••• ${last4} saved locally.`);
  };

  const removeMethod = async (id) => {
    const next = methods.filter((m) => m.id !== id);
    setMethods(next);
    await savePaymentMethods(next);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Payment methods</Text>

        {methods.map((m) => (
          <View key={m.id} style={styles.row}>
            <Ionicons name="card" size={22} color={theme.colors.primary} />
            <View style={styles.info}>
              <Text style={styles.brand}>{m.brand}</Text>
              <Text style={styles.number}>•••• {m.last4} · {m.label}</Text>
            </View>
            <TouchableOpacity onPress={() => removeMethod(m.id)}>
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addMethod}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addText}>Add payment method</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { padding: 24 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.ink },
  heading: { marginTop: 16, marginBottom: 16, fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  info: { flex: 1 },
  brand: { fontFamily: theme.fonts.semiBold, fontSize: 15, color: theme.colors.ink },
  number: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted },
  addBtn: {
    marginTop: 24,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addText: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
});
