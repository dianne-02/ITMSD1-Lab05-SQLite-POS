import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import CurvedHeader from '../components/CurvedHeader';
import VerifiedBadge from '../components/VerifiedBadge';
import PrimaryButton from '../components/PrimaryButton';

const DAYS = [
  { day: 'Sat', num: '10' },
  { day: 'Sun', num: '11' },
  { day: 'Mon', num: '12' },
  { day: 'Tue', num: '13' },
  { day: 'Wed', num: '14' },
];

const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM'];

const HOME_SIZES = [
  { label: 'Studio', detail: 'Studio' },
  { label: '2 beds · 1,200 ft²', detail: '2 beds · 1,200 ft²' },
  { label: '5+ bedrooms', detail: '5+ bedrooms' },
];

export default function MakeAppointmentScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState('12');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [sizeIndex, setSizeIndex] = useState(1);

  const currentSize = HOME_SIZES[sizeIndex];

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <FakeStatusBar />
        <CurvedHeader
          title="Make Appointment"
          onBack={() => navigation.goBack()}
          rightIcon="ellipsis-horizontal"
          onRightPress={() => navigation.navigate('MakeAppointment')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Expert card */}
        <TouchableOpacity style={styles.expertCard} onPress={() => navigation.navigate('ExpertProfile')}>
          <Image source={require('../../assets/expert_maya_small.png')} style={styles.expertImage} />
          <View>
            <View style={styles.expertNameRow}>
              <Text style={styles.expertName}>Maya Johnson</Text>
              <VerifiedBadge size={16} />
            </View>
            <Text style={styles.expertService}>Home cleaning specialist</Text>
            <Text style={styles.expertPrice}>$140/day</Text>
          </View>
        </TouchableOpacity>

        {/* Address card */}
        <View style={styles.addressCard}>
          <View style={styles.addressIcon}>
            <Ionicons name="location-outline" size={18} color={theme.colors.indigo} />
          </View>
          <View style={styles.addressText}>
            <Text style={styles.addressTitle}>Home address</Text>
            <Text style={styles.addressSub}>24 Maple Street, Brooklyn, NY</Text>
          </View>
          <Ionicons name="pencil-outline" size={18} color={theme.colors.indigo} />
        </View>

        {/* Home size */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Home size</Text>
          <Text style={styles.sectionMeta}>{currentSize.detail}</Text>
        </View>
        <TouchableOpacity
          style={styles.sliderTrack}
          onPress={() => setSizeIndex((sizeIndex + 1) % HOME_SIZES.length)}
        >
          <View style={[styles.sliderFill, { width: `${(sizeIndex / (HOME_SIZES.length - 1)) * 100}%` }]} />
          <View
            style={[
              styles.sliderThumb,
              { left: `${(sizeIndex / (HOME_SIZES.length - 1)) * 100}%` },
            ]}
          />
        </TouchableOpacity>
        <View style={styles.sectionRow}>
          <Text style={styles.sliderLabel}>Studio</Text>
          <Text style={styles.sliderLabel}>5+ bedrooms</Text>
        </View>

        {/* Date */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Choose date</Text>
          <Text style={styles.sectionMetaSmall}>October 2026</Text>
        </View>
        <View style={styles.chipsRow}>
          {DAYS.map((d) => (
            <TouchableOpacity
              key={d.num}
              style={[styles.dayChip, selectedDay === d.num && styles.dayChipActive]}
              onPress={() => setSelectedDay(d.num)}
            >
              <Text style={[styles.dayLabel, selectedDay === d.num && styles.dayLabelActive]}>{d.day}</Text>
              <Text style={[styles.dayNum, selectedDay === d.num && styles.dayNumActive]}>{d.num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time */}
        <Text style={styles.sectionTitle}>Choose time</Text>
        <View style={styles.chipsRow}>
          {TIMES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
              onPress={() => setSelectedTime(t)}
            >
              <Text style={[styles.timeLabel, selectedTime === t && styles.timeLabelActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Book Now" onPress={() => navigation.navigate('Payment')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerWrap: { backgroundColor: theme.colors.lavender },
  scroll: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 18 },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 14,
  },
  expertImage: { width: 64, height: 64, borderRadius: 14 },
  expertNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expertName: { fontSize: 16, fontWeight: '800', color: theme.colors.navy },
  expertService: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  expertPrice: { color: theme.colors.indigo, fontWeight: '700', fontSize: 14, marginTop: 4 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 14,
    marginTop: 14,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: { flex: 1 },
  addressTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.navy },
  addressSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.navy },
  sectionMeta: { fontSize: 13, fontWeight: '700', color: theme.colors.indigo },
  sectionMetaSmall: { fontSize: 12, color: theme.colors.indigo, fontWeight: '600' },
  sliderTrack: {
    height: 6,
    backgroundColor: theme.colors.lavenderMid,
    borderRadius: 3,
    marginTop: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.indigo,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    borderWidth: 5,
    borderColor: theme.colors.indigo,
    marginLeft: -10,
  },
  sliderLabel: { color: theme.colors.textMuted, fontSize: 11 },
  chipsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  dayChip: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dayChipActive: { backgroundColor: theme.colors.orange },
  dayLabel: { color: theme.colors.textMuted, fontSize: 11 },
  dayLabelActive: { color: theme.colors.navy },
  dayNum: { color: theme.colors.navy, fontWeight: '800', fontSize: 18, marginTop: 6 },
  dayNumActive: { color: theme.colors.navy },
  timeChip: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: theme.colors.orange },
  timeLabel: { color: theme.colors.navy, fontSize: 13 },
  timeLabelActive: { color: theme.colors.navy, fontWeight: '700' },
  footer: { paddingVertical: 12 },
});
