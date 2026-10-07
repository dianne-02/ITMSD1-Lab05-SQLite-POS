import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { loadProfile } from '../services/storageService';

const MENU = [
  { icon: 'person-outline', label: 'Edit profile', route: 'EditProfile' },
  { icon: 'card-outline', label: 'Payment methods', route: 'PaymentMethods' },
  { icon: 'time-outline', label: 'Ride history', route: 'RideHistory' },
  { icon: 'settings-outline', label: 'Settings', route: 'Settings' },
  { icon: 'help-circle-outline', label: 'Help center', route: 'HelpCenter' },
];

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({ name: 'Aira Mae Tabudlong', phone: '+63 912 345 6789' });

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.phone}>{profile.phone}</Text>

        <View style={styles.menu}>
          {MENU.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.route)}
            >
              <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.mutedAlt} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <BottomNav active="Profile" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 16, alignItems: 'center' },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: 12, fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.ink },
  phone: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.muted },
  menu: { alignSelf: 'stretch', marginTop: 32 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  menuLabel: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.ink },
});
