import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import CurvedHeader from '../components/CurvedHeader';
import TabBar from '../components/TabBar';

const MENU = [
  { label: 'Personal information', icon: 'person-outline' },
  { label: 'Saved addresses', icon: 'location-outline' },
  { label: 'Payment methods', icon: 'card-outline' },
  { label: 'Notifications', icon: 'notifications-outline' },
  { label: 'Help & support', icon: 'help-circle-outline' },
];

export default function ProfileScreen({ navigation }) {
  const onTab = (tab) => {
    if (tab === 'Profile') return;
    if (tab === 'Messages') {
      alert('Messages is not part of this demo.');
      return;
    }
    navigation.navigate(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <FakeStatusBar />
        <CurvedHeader title="My Profile" onBack={() => navigation.navigate('Home')} rightIcon="pencil-outline" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarRing}>
          <Image source={require('../../assets/avatar_profile.png')} style={styles.avatar} />
        </View>
        <Text style={styles.name}>Dianne Ali</Text>
        <Text style={styles.email}>dianne.ali@email.com</Text>

        {/* Points */}
        <TouchableOpacity style={styles.pointsCard}>
          <View style={styles.pointsIcon}>
            <Ionicons name="gift-outline" size={22} color="#B97B4F" />
          </View>
          <View style={styles.pointsText}>
            <Text style={styles.pointsLabel}>Points gained</Text>
            <Text style={styles.pointsValue}>240 points</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.indigo} />
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item, index) => (
            <TouchableOpacity key={item.label} style={[styles.menuRow, index > 0 && styles.menuBorder]}>
              <Ionicons name={item.icon} size={20} color={theme.colors.indigo} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.indigo} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TabBar active="Profile" onNavigate={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerWrap: { backgroundColor: theme.colors.lavender },
  scroll: { paddingHorizontal: 20, paddingBottom: 16 },
  avatarRing: {
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'rgba(169,175,209,0.5)',
  },
  avatar: { width: 104, height: 104, borderRadius: 52 },
  name: { textAlign: 'center', fontSize: 22, fontWeight: '800', color: theme.colors.navy, marginTop: 14 },
  email: { textAlign: 'center', color: theme.colors.textMuted, fontSize: 13, marginTop: 6 },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.lavenderLight,
    borderRadius: theme.radius.card,
    padding: 16,
    marginTop: 22,
  },
  pointsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: { flex: 1 },
  pointsLabel: { color: theme.colors.indigo, fontSize: 12 },
  pointsValue: { fontSize: 20, fontWeight: '800', color: theme.colors.navy, marginTop: 2 },
  menuCard: { backgroundColor: theme.colors.white, borderRadius: theme.radius.card, marginTop: 18 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  menuBorder: { borderTopWidth: 1, borderTopColor: theme.colors.background },
  menuLabel: { flex: 1, fontSize: 14, color: theme.colors.navy },
});
