import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import OptionPicker from '../components/OptionPicker';
import {
  initDatabase,
  getBooking,
  updateBooking,
} from '../services/db';
import {
  DRIVERS,
  RIDE_TYPES,
  LOCATIONS,
  TIME_SLOTS,
  calculateFare,
  findById,
} from '../constants/catalog';

const toLocationOption = (l) => ({ id: l.id, label: l.label, icon: 'location-outline' });
const toDriverOption = (d) => ({
  id: d.id,
  label: d.name,
  sub: `${d.vehicle} · ★ ${d.rating} · ${d.eta}`,
  icon: 'person-outline',
});
const toRideOption = (r) => ({ id: r.id, label: r.name, sub: r.description, icon: 'car-sport-outline' });
const toTimeOption = (t) => ({ id: t, label: t, icon: 'time-outline' });

const DATE_OPTIONS = (() => {
  const arr = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    arr.push({ id: label, label, icon: 'calendar-outline' });
  }
  return arr;
})();

function FieldRow({ label, icon, value, placeholder, onPress }) {
  return (
    <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.fieldLeft}>
        <View style={styles.fieldIcon}>
          <Ionicons name={icon} size={18} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={[styles.fieldValue, !value && styles.fieldPlaceholder]}>
            {value || placeholder}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-down" size={18} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}

export default function EditBookingScreen({ navigation, route }) {
  const bookingId = route.params?.bookingId;

  const [loading, setLoading] = useState(true);
  const [pickupId, setPickupId] = useState(null);
  const [destId, setDestId] = useState(null);
  const [rideTypeId, setRideTypeId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [rideDate, setRideDate] = useState('');
  const [time, setTime] = useState(null);
  const [payMethod, setPayMethod] = useState(null);
  const [picker, setPicker] = useState(null);
  const [original, setOriginal] = useState(null);

  useEffect(() => {
    try {
      initDatabase();
      const b = getBooking(bookingId);
      if (!b) {
        Alert.alert('Booking not found', 'This booking may have been deleted.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }
      setOriginal(b);
      const pickupLoc = LOCATIONS.find((l) => l.label === b.pickup);
      const destLoc = LOCATIONS.find((l) => l.label === b.destination);
      const ride = RIDE_TYPES.find((r) => r.name === b.ride_type);
      const drv = DRIVERS.find((d) => d.name === b.driver_name) ||
        DRIVERS.find((d) => d.id === b.driver_id);

      setPickupId(pickupLoc ? pickupLoc.id : null);
      setDestId(destLoc ? destLoc.id : null);
      setRideTypeId(ride ? ride.id : null);
      setDriverId(drv ? drv.id : null);
      setRideDate(b.ride_date);
      setPayMethod(b.payment_method || null);
      setTime(TIME_SLOTS.includes(b.pickup_time) ? b.pickup_time : null);
      if (!TIME_SLOTS.includes(b.pickup_time) && b.pickup_time) {
        // keep original custom time selectable
        setTime(b.pickup_time);
      }
    } catch (e) {
      Alert.alert('Database error', String(e && e.message ? e.message : e));
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  const pickup = findById(LOCATIONS, pickupId);
  const destination = findById(LOCATIONS, destId);
  const rideType = findById(RIDE_TYPES, rideTypeId);
  const driver = findById(DRIVERS, driverId);
  const fare = pickup && destination && rideType ? calculateFare(pickup, destination, rideType) : null;

  const handleSave = () => {
    if (!pickup) return Alert.alert('Select pickup', 'Please choose a pickup location.');
    if (!destination) return Alert.alert('Select destination', 'Please choose a destination.');
    if (pickup.id === destination.id)
      return Alert.alert('Check locations', 'Pickup and destination must be different.');
    if (!rideType) return Alert.alert('Select ride', 'Please choose a ride type.');
    if (!driver) return Alert.alert('Select driver', 'Please choose a driver.');
    if (!time) return Alert.alert('Select time', 'Please choose a pickup time.');
    if (!payMethod) return Alert.alert('Select payment method', 'Please choose Cash or E-Wallet.');
    if (!rideDate) return Alert.alert('Select date', 'Please choose a ride date.');
    if (!fare || fare <= 0) return Alert.alert('Fare error', 'Could not calculate the fare.');

    try {
      initDatabase();
      updateBooking(bookingId, {
        pickup: pickup.label,
        destination: destination.label,
        rideType: rideType.name,
        driverId: driver.id,
        driverName: driver.name,
        rideDate,
        pickupTime: time,
        fare,
        paymentMethod: payMethod,
      });
      Alert.alert('Booking updated', `New fare: ₱${fare} · ${driver.name} · ${time}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Database error', String(e && e.message ? e.message : e));
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showBack onBack={() => navigation.goBack()} title="Edit booking" />
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Update booking</Text>
        {original ? (
          <Text style={styles.sub}>
            Booking #{original.id} · {original.booking_status} · {original.payment_status}
          </Text>
        ) : null}

        <FieldRow
          label="Pickup"
          icon="locate-outline"
          value={pickup ? pickup.label : null}
          placeholder="Select pickup location"
          onPress={() => setPicker('pickup')}
        />
        <FieldRow
          label="Destination"
          icon="flag-outline"
          value={destination ? destination.label : null}
          placeholder="Select destination"
          onPress={() => setPicker('destination')}
        />
        <FieldRow
          label="Ride type"
          icon="car-sport-outline"
          value={rideType ? rideType.name : null}
          placeholder="Select ride"
          onPress={() => setPicker('ride')}
        />
        <FieldRow
          label="Driver"
          icon="person-outline"
          value={driver ? `${driver.name} · ${driver.vehicle}` : null}
          placeholder="Select driver"
          onPress={() => setPicker('driver')}
        />
        <FieldRow
          label="Ride date"
          icon="calendar-outline"
          value={rideDate || null}
          placeholder="Select date on Rides screen"
          onPress={() => setPicker('date')}
        />
        <FieldRow
          label="Pickup time"
          icon="time-outline"
          value={time}
          placeholder="Select pickup time"
          onPress={() => setPicker('time')}
        />
        <FieldRow
          label="Payment method"
          icon="wallet-outline"
          value={payMethod}
          placeholder="Select Cash or E-Wallet"
          onPress={() => setPicker('method')}
        />

        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Updated fare</Text>
          <Text style={styles.fareValue}>{fare != null ? `₱${fare}` : '—'}</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Update booking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>Discard changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <OptionPicker
        visible={picker === 'pickup'}
        title="Select pickup"
        options={LOCATIONS.map(toLocationOption)}
        selectedId={pickupId}
        onSelect={(o) => { setPickupId(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'destination'}
        title="Select destination"
        options={LOCATIONS.map(toLocationOption)}
        selectedId={destId}
        onSelect={(o) => { setDestId(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'ride'}
        title="Select ride type"
        options={RIDE_TYPES.map(toRideOption)}
        selectedId={rideTypeId}
        onSelect={(o) => { setRideTypeId(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'driver'}
        title="Select driver"
        options={DRIVERS.map(toDriverOption)}
        selectedId={driverId}
        onSelect={(o) => { setDriverId(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'time'}
        title="Select pickup time"
        options={TIME_SLOTS.map(toTimeOption)}
        selectedId={time}
        onSelect={(o) => { setTime(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'method'}
        title="Select payment method"
        options={[
          { id: 'Cash', label: 'Cash', sub: 'Pay the driver directly', icon: 'cash-outline' },
          { id: 'E-Wallet', label: 'E-Wallet', sub: 'Deduct from your BAO PAY balance', icon: 'wallet-outline' },
        ]}
        selectedId={payMethod}
        onSelect={(o) => { setPayMethod(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'date'}
        title="Ride date"
        options={DATE_OPTIONS}
        selectedId={rideDate}
        onSelect={(o) => { setRideDate(o.id); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  body: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48 },
  heading: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  sub: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
    marginBottom: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  fieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.muted },
  fieldValue: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 1,
  },
  fieldPlaceholder: { color: theme.colors.mutedAlt, fontFamily: theme.fonts.medium },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  fareLabel: { fontFamily: theme.fonts.semiBold, fontSize: 15, color: theme.colors.ink },
  fareValue: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.primary },
  saveBtn: {
    marginTop: 20,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
  cancelBtn: {
    marginTop: 12,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontFamily: theme.fonts.semiBold, fontSize: 15, color: theme.colors.mutedAlt },
});
