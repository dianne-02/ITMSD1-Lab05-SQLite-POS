import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import OptionPicker from '../components/OptionPicker';
import {
  initDatabase,
  getBookings,
  addBooking,
  deleteBooking,
} from '../services/db';
import {
  DRIVERS,
  RIDE_TYPES,
  LOCATIONS,
  TIME_SLOTS,
  calculateFare,
  findById,
} from '../constants/catalog';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const toLocationOption = (l) => ({ id: l.id, label: l.label, icon: 'location-outline' });
const toDriverOption = (d) => ({
  id: d.id,
  label: d.name,
  sub: `${d.vehicle} · ★ ${d.rating} · ${d.eta}`,
  icon: 'person-outline',
});
const toRideOption = (r) => ({
  id: r.id,
  label: r.name,
  sub: r.description,
  icon: 'car-sport-outline',
});
const toTimeOption = (t) => ({ id: t, label: t, icon: 'time-outline' });

function FieldRow({ label, icon, value, placeholder, onPress }) {
  return (
    <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.fieldLeft}>
        <View style={styles.fieldIcon}>
          <Ionicons name={icon} size={18} color={theme.colors.primary} />
        </View>
        <View>
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

function BookingCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}>
          <Ionicons name="car-sport" size={20} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.cardRoute}>
            {item.pickup} — {item.destination}
          </Text>
          <Text style={styles.cardMeta}>
            {item.ride_date} · {item.pickup_time}
          </Text>
          <Text style={styles.cardMeta}>
            {item.ride_type} · {item.driver_name}
          </Text>
        </View>
        <Text style={styles.cardFare}>₱{Number(item.fare).toFixed(0)}</Text>
      </View>

      <View style={styles.cardBadges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.booking_status}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.payment_status}
            {item.payment_method ? ` · ${item.payment_method}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() => onEdit(item)}
          accessibilityLabel="Edit booking"
        >
          <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.8}
          onPress={() => onDelete(item)}
          accessibilityLabel="Cancel booking"
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
          <Text style={styles.deleteBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ScheduleScreen({ navigation }) {
  const [tab, setTab] = useState('Schedule');
  const [monthDate, setMonthDate] = useState(new Date(2026, 9, 1));
  const [selectedDay, setSelectedDay] = useState(10);

  // Booking form state
  const [pickupId, setPickupId] = useState(null);
  const [destId, setDestId] = useState(null);
  const [rideTypeId, setRideTypeId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [time, setTime] = useState(null);
  const [payMethod, setPayMethod] = useState(null); // 'Cash' | 'E-Wallet'

  // Pickers
  const [picker, setPicker] = useState(null); // 'pickup' | 'destination' | 'ride' | 'driver' | 'time'

  const [bookings, setBookings] = useState([]);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const monthName = monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDayIdx = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const refresh = useCallback(() => {
    try {
      initDatabase();
      setBookings(getBookings());
    } catch (e) {
      Alert.alert('Database error', String(e && e.message ? e.message : e));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const goMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    setMonthDate(next);
    setSelectedDay((d) => Math.min(d, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
  };

  const pickup = findById(LOCATIONS, pickupId);
  const destination = findById(LOCATIONS, destId);
  const rideType = findById(RIDE_TYPES, rideTypeId);
  const driver = findById(DRIVERS, driverId);
  const fare = pickup && destination && rideType ? calculateFare(pickup, destination, rideType) : null;

  const selectedDate = `${monthDate.toLocaleString('en-US', { month: 'short' })} ${selectedDay}, ${year}`;

  const handleSchedule = () => {
    if (!pickup) return Alert.alert('Select pickup', 'Please choose a pickup location.');
    if (!destination) return Alert.alert('Select destination', 'Please choose a destination.');
    if (pickup.id === destination.id)
      return Alert.alert('Check locations', 'Pickup and destination must be different.');
    if (!rideType) return Alert.alert('Select ride', 'Please choose a ride type.');
    if (!driver) return Alert.alert('Select driver', 'Please choose a driver.');
    if (!time) return Alert.alert('Select time', 'Please choose a pickup time.');
    if (!payMethod) return Alert.alert('Select payment method', 'Please choose Cash or E-Wallet.');
    if (!selectedDay) return Alert.alert('Select date', 'Please choose a ride date.');
    if (!fare || fare <= 0) return Alert.alert('Fare error', 'Could not calculate the fare.');

    try {
      initDatabase();
      const id = addBooking({
        pickup: pickup.label,
        destination: destination.label,
        rideType: rideType.name,
        driverId: driver.id,
        driverName: driver.name,
        rideDate: selectedDate,
        pickupTime: time,
        fare,
        paymentMethod: payMethod,
        paymentStatus: 'PENDING',
        bookingStatus: 'SCHEDULED',
      });
      refresh();
      Alert.alert(
        'Ride scheduled',
        `${pickup.label} → ${destination.label}\n${driver.name} · ${selectedDate} · ${time}\nFare: ₱${fare}`,
        [
          { text: 'Pay later', style: 'cancel' },
          {
            text: 'Pay now',
            onPress: () => navigation.navigate('Wallet', { bookingId: id }),
          },
        ]
      );
    } catch (e) {
      Alert.alert('Database error', String(e && e.message ? e.message : e));
    }
  };

  const handleDelete = (booking) => {
    Alert.alert(
      'Are you sure you want to cancel this booking?',
      `${booking.pickup} → ${booking.destination}\n${booking.ride_date} · ${booking.pickup_time}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteBooking(booking.id);
              refresh();
            } catch (e) {
              Alert.alert('Database error', String(e && e.message ? e.message : e));
            }
          },
        },
      ]
    );
  };

  const handleEdit = (booking) => {
    navigation.navigate('EditBooking', { bookingId: booking.id });
  };

  const cells = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const scheduled = bookings.filter((b) => b.booking_status !== 'CANCELLED');
  const past = bookings;

  const renderScheduleForm = () => (
    <>
      <View style={styles.calendarHeader}>
        <Text style={styles.month}>{monthName}</Text>
        <View style={styles.chevrons}>
          <TouchableOpacity onPress={() => goMonth(-1)} accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={20} color={theme.colors.ink} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goMonth(1)} accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={20} color={theme.colors.ink} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={i} style={styles.weekday}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => (
          <TouchableOpacity
            key={i}
            disabled={day === null}
            style={styles.cell}
            onPress={() => setSelectedDay(day)}
            activeOpacity={0.7}
          >
            {day !== null && (
              <View style={[styles.dayCircle, day === selectedDay && styles.daySelected]}>
                <Text style={[styles.dayText, day === selectedDay && styles.dayTextSelected]}>
                  {day}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

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
        <Text style={styles.fareLabel}>Estimated fare</Text>
        <Text style={styles.fareValue}>{fare != null ? `₱${fare}` : '—'}</Text>
      </View>

      <TouchableOpacity style={styles.scheduleBtn} activeOpacity={0.85} onPress={handleSchedule}>
        <Text style={styles.scheduleBtnText}>Schedule ride</Text>
      </TouchableOpacity>
    </>
  );

  const renderHistoryList = () => (
    <FlatList
      data={tab === 'Schedule' ? scheduled : past}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 130 }}
      ListHeaderComponent={
        <Text style={styles.pastTitle}>
          {tab === 'Schedule' ? 'Active bookings' : 'All bookings'}
        </Text>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>
          {tab === 'Schedule'
            ? 'No active bookings yet — schedule one above.'
            : 'No bookings in the database yet.'}
        </Text>
      }
      renderItem={({ item }) => (
        <BookingCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    />
  );

  const renderHistoryInline = () => (
    <>
      <Text style={styles.pastTitle}>Active bookings</Text>
      {scheduled.length === 0 ? (
        <Text style={styles.empty}>No active bookings yet — schedule one above.</Text>
      ) : (
        scheduled.map((item) => (
          <BookingCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
        ))
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <Text style={styles.heading}>Your rides</Text>

        <View style={styles.toggle}>
          {['Schedule', 'History'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.toggleItem, tab === t && styles.toggleActive]}
              activeOpacity={0.8}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.toggleText, tab === t && styles.toggleTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'Schedule' ? (
          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderScheduleForm()}
            {renderHistoryInline()}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{renderHistoryList()}</View>
        )}
      </View>

      <OptionPicker
        visible={picker === 'pickup'}
        title="Select pickup"
        options={LOCATIONS.map(toLocationOption)}
        selectedId={pickupId}
        onSelect={(o) => {
          setPickupId(o.id);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'destination'}
        title="Select destination"
        options={LOCATIONS.map(toLocationOption)}
        selectedId={destId}
        onSelect={(o) => {
          setDestId(o.id);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'ride'}
        title="Select ride type"
        options={RIDE_TYPES.map(toRideOption)}
        selectedId={rideTypeId}
        onSelect={(o) => {
          setRideTypeId(o.id);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'driver'}
        title="Select driver"
        options={DRIVERS.map(toDriverOption)}
        selectedId={driverId}
        onSelect={(o) => {
          setDriverId(o.id);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
      <OptionPicker
        visible={picker === 'time'}
        title="Select pickup time"
        options={TIME_SLOTS.map(toTimeOption)}
        selectedId={time}
        onSelect={(o) => {
          setTime(o.id);
          setPicker(null);
        }}
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
        onSelect={(o) => {
          setPayMethod(o.id);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />

      <BottomNav active="Rides" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  scrollBody: { paddingBottom: 130 },
  heading: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  toggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 20,
    padding: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  toggleItem: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: theme.colors.primary },
  toggleText: { fontFamily: theme.fonts.semiBold, fontSize: 13, color: theme.colors.mutedAlt },
  toggleTextActive: { color: '#FFFFFF' },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  month: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: theme.colors.ink },
  chevrons: { flexDirection: 'row', gap: 24 },
  weekRow: { flexDirection: 'row', marginTop: 16, marginBottom: 4 },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.mutedAlt,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', aspectRatio: 1.3, alignItems: 'center', justifyContent: 'center' },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: { backgroundColor: theme.colors.primary },
  dayText: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.ink },
  dayTextSelected: { color: '#FFFFFF', fontFamily: theme.fonts.semiBold },

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

  scheduleBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleBtnText: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: '#FFFFFF' },

  pastTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.ink,
  },
  empty: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted },

  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRoute: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.ink },
  cardMeta: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.muted, marginTop: 1 },
  cardFare: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  cardBadges: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  badge: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: theme.fonts.semiBold, fontSize: 11, color: theme.colors.mutedAlt },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  editBtnText: { fontFamily: theme.fonts.semiBold, fontSize: 13, color: theme.colors.primary },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  deleteBtnText: { fontFamily: theme.fonts.semiBold, fontSize: 13, color: '#DC2626' },
});
