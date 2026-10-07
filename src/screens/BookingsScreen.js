import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import CurvedHeader from '../components/CurvedHeader';
import TabBar from '../components/TabBar';

const BOOKINGS = [
  {
    id: '1',
    title: 'Home cleaning',
    expert: 'Maya Johnson',
    date: 'Oct 12 · 10:00 AM',
    price: '$140',
    status: 'Confirmed',
    upcoming: true,
    image: require('../../assets/booking_maya.png'),
  },
  {
    id: '2',
    title: 'Painting',
    expert: 'Leo Carter',
    date: 'Oct 18 · 09:00 AM',
    price: '$220',
    status: 'Scheduled',
    upcoming: true,
    image: require('../../assets/booking_leo.png'),
  },
  {
    id: '3',
    title: 'Car cleaning',
    expert: 'Daniel Smith',
    date: 'Sep 28 · 11:00 AM',
    price: '$90',
    status: 'Completed',
    upcoming: false,
    image: require('../../assets/booking_daniel.png'),
  },
];

const FILTERS = ['All', 'Upcoming', 'Past'];

export default function BookingsScreen({ navigation }) {
  const [filter, setFilter] = useState('All');

  const upcoming = BOOKINGS.filter((b) => b.upcoming);
  const past = BOOKINGS.filter((b) => !b.upcoming);

  const onTab = (tab) => {
    if (tab === 'Bookings') return;
    if (tab === 'Messages') {
      alert('Messages is not part of this demo.');
      return;
    }
    navigation.navigate(tab);
  };

  const BookingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => item.upcoming && navigation.navigate('TrackExpert')}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardMiddle}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardExpert}>{item.expert}</Text>
      </View>
      <View style={styles.cardRight}>
        <View
          style={[
            styles.statusPill,
            item.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPillLight,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardBottomRow}>
        <Ionicons name="calendar-outline" size={14} color={theme.colors.indigo} />
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <Ionicons name="chevron-forward" size={14} color={theme.colors.indigo} />
      </View>
    </TouchableOpacity>
  );

  const showUpcoming = filter === 'All' || filter === 'Upcoming';
  const showPast = filter === 'All' || filter === 'Past';

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <FakeStatusBar />
        <CurvedHeader title="My Bookings" onBack={() => navigation.navigate('Home')} rightIcon="calendar-outline" />
      </View>

      <View style={styles.segmented}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.segment, filter === f && styles.segmentActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.segmentText, filter === f && styles.segmentTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {showUpcoming && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              <Text style={styles.sectionMeta}>{upcoming.length} bookings</Text>
            </View>
            {upcoming.map((b) => (
              <BookingCard key={b.id} item={b} />
            ))}
          </>
        )}

        {showPast && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Past bookings</Text>
              <Text style={styles.sectionMetaLink}>View all</Text>
            </View>
            {past.map((b) => (
              <BookingCard key={b.id} item={b} />
            ))}
          </>
        )}
      </ScrollView>

      <TabBar active="Bookings" onNavigate={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerWrap: { backgroundColor: theme.colors.lavender },
  segmented: {
    flexDirection: 'row',
    backgroundColor: theme.colors.segmentTrack,
    borderRadius: theme.radius.pill,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 4,
  },
  segment: { flex: 1, borderRadius: theme.radius.pill, paddingVertical: 10, alignItems: 'center' },
  segmentActive: { backgroundColor: theme.colors.orange },
  segmentText: { color: theme.colors.textMuted, fontWeight: '600', fontSize: 13 },
  segmentTextActive: { color: theme.colors.navy },
  scroll: { paddingHorizontal: 20, paddingBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.navy },
  sectionMeta: { color: theme.colors.indigo, fontSize: 13 },
  sectionMetaLink: { color: theme.colors.indigo, fontSize: 13, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 12,
    marginBottom: 12,
  },
  cardImage: { width: 52, height: 52, borderRadius: 26 },
  cardMiddle: { flex: 1, paddingHorizontal: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.navy },
  cardExpert: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  statusPill: { borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  statusConfirmed: { backgroundColor: theme.colors.orangeLight },
  statusPillLight: { backgroundColor: theme.colors.lavenderLight },
  statusText: { fontSize: 11, fontWeight: '700', color: theme.colors.navy },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 14,
    width: '100%',
  },
  cardDate: { color: theme.colors.textMuted, fontSize: 11 },
  cardPrice: {
    color: theme.colors.navy,
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 'auto',
  },
});
