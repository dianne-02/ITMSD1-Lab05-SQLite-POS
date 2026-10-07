import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import VerifiedBadge from '../components/VerifiedBadge';
import PrimaryButton from '../components/PrimaryButton';

const STATS = [
  { value: '4.9', label: 'Reviews', icon: 'star-outline' },
  { value: '128', label: 'Jobs Done' },
  { value: '5 yrs', label: 'Experience' },
];

const SPECIALTIES = ['Deep clean', 'Kitchens', 'Bathrooms'];

export default function ExpertProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header with large curved lavender area */}
      <View style={styles.largeHeader}>
        <FakeStatusBar />
        <View style={styles.decorCircle} />
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expert Profile</Text>
          <TouchableOpacity style={styles.circleButton}>
            <Ionicons name="bookmark-outline" size={18} color={theme.colors.navy} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarRing}>
          <Image source={require('../../assets/expert_maya_big.png')} style={styles.bigAvatar} />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>Maya Johnson</Text>
          <VerifiedBadge size={20} />
        </View>
        <Text style={styles.subtitle}>
          <Text style={styles.price}>$140</Text>
          <Text style={styles.subtitleMuted}>/day · Home cleaning</Text>
        </Text>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              {stat.icon ? (
                <Ionicons name="star-outline" size={16} color={theme.colors.orange} />
              ) : null}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.aboutTitle}>About Maya</Text>
        <Text style={styles.aboutText}>
          A little care makes a home feel new. I bring 5 years of experience, a keen eye for detail,
          and a smile to every clean.{' '}
          <Text style={styles.readMore}>Read More</Text>
        </Text>

        <Text style={styles.aboutTitle}>Specialties</Text>
        <View style={styles.chipsRow}>
          {SPECIALTIES.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Schedule Now" onPress={() => navigation.navigate('MakeAppointment')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  largeHeader: {
    backgroundColor: theme.colors.lavender,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
    minHeight: 160,
  },
  decorCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: theme.colors.lavenderMid,
    bottom: -140,
    left: -80,
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.navy },
  scroll: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 0 },
  avatarRing: {
    alignSelf: 'center',
    marginTop: -70,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  bigAvatar: { width: 130, height: 130, borderRadius: 65 },
  nameRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 },
  name: { fontSize: 24, fontWeight: '800', color: theme.colors.navy },
  subtitle: { textAlign: 'center', marginTop: 8 },
  price: { fontSize: 18, fontWeight: '800', color: theme.colors.indigo },
  subtitleMuted: { fontSize: 15, color: theme.colors.textMuted },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.lavenderLight,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800', color: theme.colors.navy, marginTop: 4 },
  statLabel: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  aboutTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.navy, marginTop: 22 },
  aboutText: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  readMore: { color: theme.colors.indigo, fontWeight: '700' },
  chipsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chip: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: { color: theme.colors.navy, fontSize: 12 },
  footer: { paddingVertical: 12 },
});
