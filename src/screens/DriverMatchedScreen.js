import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Sheet from '../components/Sheet';
import BAOMap from '../components/BAOMap';
import { LOCATIONS } from '../constants/locations';

export default function DriverMatchedScreen({ navigation, route }) {
  const driver = (route && route.params && route.params.driver) || {
    name: 'Kuya Wilbert',
    vehicle: 'Toyota Vios (white)',
    plate: 'DAV 4821',
    rating: 4.9,
  };
  const fare = (route && route.params && route.params.fare) || 55;
  const bookingId = route && route.params ? route.params.bookingId : null;

  return (
    <View style={styles.container}>
      <Header />
      <View>
        <BAOMap
          height={280}
          pickup={LOCATIONS.DORSU_MAIN_CAMPUS}
          destination={LOCATIONS.DAHICAN_BEACH}
          routeCoords={[LOCATIONS.DORSU_MAIN_CAMPUS, LOCATIONS.DAHICAN_BEACH]}
        />
        <TouchableOpacity
          style={styles.arrivalPill}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('LiveTracking', { driver, fare, bookingId })}
        >
          <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.arrivalText}>Arrives in 3 min</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Alert.alert('Map', 'Recentering to driver…')}
          accessibilityLabel="Recenter map"
        >
          <Ionicons name="locate" size={20} color={theme.colors.primary} style={styles.locate} />
        </TouchableOpacity>
      </View>

      <Sheet style={styles.sheet}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Your driver is on the way</Text>

        <View style={styles.driverRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.driverMeta}>★ {driver.rating} · Verified driver</Text>
          </View>
        </View>

        <Text style={styles.vehicle}>{driver.vehicle}</Text>
        <View style={styles.plate}>
          <Text style={styles.plateText}>{driver.plate}</Text>
        </View>

        <View style={styles.stats}>
          <Stat value="3 min" label="ETA" />
          <View style={styles.divider} />
          <Stat value="8.4 km" label="Trip" />
          <View style={styles.divider} />
          <Stat value={`₱${fare}`} label="Fare" />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryAction}
            activeOpacity={0.85}
            onPress={() => {
              if (bookingId) {
                navigation.navigate('Wallet', { bookingId });
              } else {
                Alert.alert('Payment', 'No booking attached. Schedule a ride from the Rides screen.');
              }
            }}
          >
            <Text style={styles.primaryActionText}>Pay & Confirm</Text>
            <Ionicons name="wallet" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryAction}
            activeOpacity={0.85}
            onPress={() => Alert.alert('Calling', `Calling ${driver.name}…`)}
          >
            <Text style={styles.secondaryActionText}>Call</Text>
            <Ionicons name="call" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.chatAction}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Chat', `Opening chat with ${driver.name}…`)}
        >
          <Text style={styles.secondaryActionText}>Chat with {driver.name}</Text>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        </ScrollView>
      </Sheet>

      <BottomNav active="Rides" navigation={navigation} />
    </View>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.mapBg },
  arrivalPill: {
    position: 'absolute',
    top: 24,
    left: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
  },
  arrivalText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 15,
    color: theme.colors.ink,
  },
  locate: { position: 'absolute', right: 44, bottom: 16 },
  sheet: { flex: 1 },
  heading: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.ink,
    marginBottom: 16,
  },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: { marginLeft: 16 },
  driverName: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.ink,
  },
  driverMeta: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.muted,
  },
  vehicle: {
    marginTop: 12,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.ink,
  },
  plate: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: theme.colors.plateBg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  plateText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
    color: theme.colors.ink,
    letterSpacing: 1,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 8,
  },
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
  actions: { flexDirection: 'row', marginTop: 16, gap: 14 },
  primaryAction: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
  },
  secondaryAction: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryActionText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
  },
  chatAction: {
    marginTop: 10,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
