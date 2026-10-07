import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Sheet from '../components/Sheet';
import PrimaryButton from '../components/PrimaryButton';
import BAOMap from '../components/BAOMap';

import { LOCATIONS } from '../constants/locations';
import {
  DRIVERS,
  RIDE_TYPES,
  calculateFare,
  findById,
} from '../constants/catalog';

import { initDatabase, addBooking } from '../services/db';

export default function ChooseRideScreen({ navigation, route }) {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedType, setSelectedType] = useState('standard');

  // --------------------------------------------------
  // MAKE LOCATIONS WORK WHETHER IT IS AN ARRAY OR OBJECT
  // --------------------------------------------------

  const locationList = Array.isArray(LOCATIONS)
    ? LOCATIONS
    : Object.values(LOCATIONS || {});

  // --------------------------------------------------
  // GET PICKUP AND DESTINATION
  // --------------------------------------------------

  const pickupLabel =
    route?.params?.pickupLabel || 'DOrSU Main Campus';

  const destinationLabel =
    route?.params?.destinationLabel || 'Dahican Beach';

  const pickupLoc =
    locationList.find((location) => location?.label === pickupLabel) || {
      id: 'dorsu',
      label: pickupLabel,
      latitude: 7.0731,
      longitude: 126.1985,
    };

  const destLoc =
    locationList.find((location) => location?.label === destinationLabel) || {
      id: 'dahican',
      label: destinationLabel,
      latitude: 6.9988,
      longitude: 126.2375,
    };

  // --------------------------------------------------
  // RIDE TYPE
  // --------------------------------------------------

  const rideType = findById(RIDE_TYPES, selectedType);

  // Safety fallback in case selectedType is not found
  const safeRideType =
    rideType || RIDE_TYPES?.[0] || {
      id: 'standard',
      name: 'BAO BAO Standard',
    };

  // --------------------------------------------------
  // FARE
  // --------------------------------------------------

  const fare = calculateFare(
    pickupLoc,
    destLoc,
    safeRideType
  );

  // --------------------------------------------------
  // MAP COORDINATES
  // --------------------------------------------------

  const pickupCoord =
    pickupLoc?.latitude != null &&
    pickupLoc?.longitude != null
      ? {
          latitude: pickupLoc.latitude,
          longitude: pickupLoc.longitude,
        }
      : {
          latitude: 7.0731,
          longitude: 126.1985,
        };

  const destCoord =
    destLoc?.latitude != null &&
    destLoc?.longitude != null
      ? {
          latitude: destLoc.latitude,
          longitude: destLoc.longitude,
        }
      : {
          latitude: 6.9988,
          longitude: 126.2375,
        };

  // --------------------------------------------------
  // BOOK NOW
  // --------------------------------------------------

  const bookNow = () => {
    if (!selectedDriver) {
      Alert.alert(
        'Select a driver',
        'Please tap a driver before booking.'
      );
      return;
    }

    const driver = findById(DRIVERS, selectedDriver);

    if (!driver) {
      Alert.alert(
        'Driver Error',
        'The selected driver could not be found.'
      );
      return;
    }

    try {
      initDatabase();

      const id = addBooking({
        pickup: pickupLoc.label,
        destination: destLoc.label,
        rideType: safeRideType.name,
        driverId: driver.id,
        driverName: driver.name,

        rideDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),

        pickupTime: 'Now',
        fare,
        paymentStatus: 'PENDING',
        bookingStatus: 'SCHEDULED',
      });

      navigation.navigate('DriverMatched', {
        driver,
        fare,
        bookingId: id,
      });
    } catch (error) {
      console.error('Booking error:', error);

      Alert.alert(
        'Booking Error',
        'Something went wrong while creating your booking.'
      );
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <Header />

      <BAOMap
        height={180}
        pickup={pickupCoord}
        destination={destCoord}
        routeCoords={[pickupCoord, destCoord]}
      />

      <Sheet style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>
            Choose your ride
          </Text>

          <Text style={styles.route}>
            {pickupLoc.label} → {destLoc.label}
          </Text>

          {/* RIDE TYPE */}
          <Text style={styles.section}>
            Ride type
          </Text>

          <View style={styles.typeRow}>
            {RIDE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeChip,
                  selectedType === type.id &&
                    styles.typeChipActive,
                ]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    selectedType === type.id &&
                      styles.typeChipTextActive,
                  ]}
                >
                  {type.name.replace('BAO BAO ', '')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DRIVERS */}
          <Text style={styles.section}>
            Available drivers
          </Text>

          {DRIVERS.map((driver) => {
            const active =
              driver.id === selectedDriver;

            return (
              <TouchableOpacity
                key={driver.id}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedDriver(driver.id)
                }
                style={[
                  styles.card,
                  active && styles.cardActive,
                ]}
              >
                <View style={styles.cardIcon}>
                  <Ionicons
                    name="car-sport"
                    size={28}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.rideName}>
                    {driver.name}
                  </Text>

                  <Text style={styles.rideMeta}>
                    {driver.seats} seats · {driver.eta} · ★{' '}
                    {driver.rating}
                  </Text>
                </View>

                <Text style={styles.fare}>
                  ₱{fare}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* TOTAL FARE */}
          <Text style={styles.total}>
            Fare: ₱{fare}
          </Text>

          {/* BOOK BUTTON */}
          <PrimaryButton
            title="Book Now"
            onPress={bookNow}
            style={styles.bookButton}
          />

          {/* EXTRA SPACE SO BUTTON IS NOT HIDDEN */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </Sheet>

      <BottomNav
        active="Rides"
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mapBg,
  },

  sheet: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  heading: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.ink,
  },

  route: {
    marginTop: 4,
    marginBottom: 12,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.muted,
  },

  section: {
    marginTop: 12,
    marginBottom: 8,
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.ink,
  },

  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },

  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },

  typeChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F4FF',
  },

  typeChipText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
    color: theme.colors.mutedAlt,
  },

  typeChipTextActive: {
    color: theme.colors.primary,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
    paddingHorizontal: 12,
  },

  cardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F0F4FF',
    borderWidth: 1.5,
  },

  cardIcon: {
    width: 56,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },

  rideName: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 15,
    color: theme.colors.ink,
  },

  rideMeta: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.muted,
  },

  fare: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.primary,
  },

  total: {
    marginTop: 12,
    textAlign: 'right',
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.primary,
  },

  bookButton: {
    marginTop: 8,
  },
});