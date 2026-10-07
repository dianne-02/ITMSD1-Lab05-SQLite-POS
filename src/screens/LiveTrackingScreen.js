import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Sheet from '../components/Sheet';
import PrimaryButton from '../components/PrimaryButton';
import BAOMap from '../components/BAOMap';
import { LOCATIONS } from '../constants/locations';

export default function LiveTrackingScreen({ navigation, route }) {
  const driver = route?.params?.driver;
  const destination = route?.params?.destination || 'Dahican Beach';
  const fare = route?.params?.fare;
  const bookingId = route?.params?.bookingId;

  return (
    <View style={styles.container}>
      <Header />
      <View>
        <BAOMap
          height={368}
          pickup={LOCATIONS.DORSU_MAIN_CAMPUS}
          destination={LOCATIONS.DAHICAN_BEACH}
          routeCoords={[LOCATIONS.DORSU_MAIN_CAMPUS, LOCATIONS.DAHICAN_BEACH]}
        />
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
          <Text style={styles.badgeText}>Trip protected</Text>
        </View>
      </View>

      <Sheet style={styles.sheet}>
        <View style={styles.headRow}>
          <Text style={styles.heading}>On the way</Text>
          <Text style={styles.arrive}>Arrive 5:24 PM</Text>
        </View>
        <View style={styles.headRow}>
          <Text style={styles.destination}>{destination}</Text>
          <Text style={styles.percent}>62%</Text>
        </View>

        <View style={styles.track}>
          <View style={styles.completed} />
          <View style={styles.handle} />
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>8 min</Text>
            <Text style={styles.statLabel}>Time left</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>3.2 km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{driver ? driver.name : 'Marco'}</Text>
            <Text style={styles.statLabel}>Driver</Text>
          </View>
        </View>

        <PrimaryButton
          title={fare ? `Pay fare · ₱${fare}` : 'Share trip'}
          icon={fare ? 'wallet' : 'share-social'}
          onPress={() =>
            fare && bookingId
              ? navigation.navigate('Wallet', { bookingId })
              : Alert.alert('Share trip', 'Live trip link copied to clipboard.')
          }
          style={{ marginTop: 16 }}
        />
      </Sheet>

      <BottomNav active="Rides" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.mapBg },
  badge: {
    position: 'absolute',
    top: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
  },
  badgeText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.ink,
  },
  sheet: { flex: 1 },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.ink,
  },
  arrive: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.muted,
  },
  destination: {
    marginTop: 4,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.muted,
  },
  percent: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginTop: 16,
  },
  completed: {
    width: '62%',
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  handle: {
    position: 'absolute',
    top: -4,
    left: '62%',
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  stats: { flexDirection: 'row', marginTop: 24 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.ink,
  },
  statLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.muted,
  },
  divider: { width: 1, height: 40, backgroundColor: theme.colors.border },
});
