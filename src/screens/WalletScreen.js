import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import {
  initDatabase,
  getBooking,
  getPendingBooking,
  updateBooking,
  updateBookingPayment,
  getWallet,
  setWalletBalance,
  addPayment,
  getPayments,
} from '../services/db';
import { loadPromo, savePromo } from '../services/storageService';

const DISCOUNT = 10;

export default function WalletScreen({ navigation, route }) {
  const bookingId = route.params?.bookingId;
  const [applied, setApplied] = useState(false);
  const [method, setMethod] = useState(null); // 'Cash' | 'E-Wallet'
  const [balance, setBalance] = useState(0);
  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [success, setSuccess] = useState(null); // { booking, amount, method }

  const loadAll = useCallback(() => {
    try {
      initDatabase();
      const b = bookingId ? getBooking(bookingId) : getPendingBooking();
      setBooking(b || null);
      const w = getWallet();
      setBalance(w ? Number(w.balance) : 0);
      setPayments(getPayments().slice(0, 5));
      if (b && b.payment_method) setMethod(b.payment_method);
    } catch (e) {
      Alert.alert('Database error', String(e && e.message ? e.message : e));
    }
  }, [bookingId]);

  useFocusEffect(
    useCallback(() => {
      loadAll();
      loadPromo().then((p) => setApplied(!!(p && p.applied)));
    }, [loadAll])
  );

  const togglePromo = async () => {
    const next = !applied;
    setApplied(next);
    await savePromo({ code: next ? 'BAOFIRST' : '', applied: next });
    Alert.alert(
      next ? 'Promo applied' : 'Promo removed',
      next ? `BAOFIRST applied — ₱${DISCOUNT} off your payment.` : 'BAOFIRST promo has been removed.'
    );
  };

  const fare = booking ? Number(booking.fare) : 0;
  const discount = applied && booking ? Math.min(DISCOUNT, fare) : 0;
  const total = Math.max(0, fare - discount);

  const confirmPayment = () => {
    if (!booking) {
      Alert.alert('Booking information is incomplete', 'Schedule a ride first — no pending booking was found.');
      return;
    }
    if (booking.payment_status === 'PAID') {
      Alert.alert('Already paid', 'This booking has already been paid.');
      return;
    }
    if (!booking.pickup || !booking.destination) {
      Alert.alert('Booking information is incomplete', 'Missing pickup or destination.');
      return;
    }
    if (!booking.driver_name || !booking.ride_date || !booking.pickup_time) {
      Alert.alert('Booking information is incomplete', 'Missing driver, date or pickup time.');
      return;
    }
    if (!booking.fare || booking.fare <= 0) {
      Alert.alert('Booking information is incomplete', 'Invalid fare.');
      return;
    }
    if (!method) {
      Alert.alert('Please select a payment method', 'Choose Cash or E-Wallet.');
      return;
    }

    try {
      initDatabase();

      if (method === 'E-Wallet') {
        const w = getWallet();
        const current = w ? Number(w.balance) : 0;
        if (current < total) {
          Alert.alert(
            'Insufficient wallet balance.',
            `Your balance is ₱${current.toFixed(0)} but this ride costs ₱${total.toFixed(0)}.`
          );
          return;
        }
        setWalletBalance(current - total);
      }

      // Persist the final paid amount as the booking fare (single source of truth).
      updateBooking(booking.id, {
        pickup: booking.pickup,
        destination: booking.destination,
        rideType: booking.ride_type,
        driverId: booking.driver_id,
        driverName: booking.driver_name,
        rideDate: booking.ride_date,
        pickupTime: booking.pickup_time,
        fare: total,
        paymentMethod: method,
      });
      updateBookingPayment(booking.id, method, 'PAID', 'CONFIRMED');
      addPayment(booking.id, total, method, 'PAID');

      const updated = getBooking(booking.id);
      setBooking(updated);
      const w = getWallet();
      setBalance(w ? Number(w.balance) : 0);
      setPayments(getPayments().slice(0, 5));
      setSuccess({ booking: updated, amount: total, method });
      // Clear the param so revisiting Wallet never re-charges this booking.
      navigation.setParams({ bookingId: null });
    } catch (e) {
      Alert.alert('Payment failed', String(e && e.message ? e.message : e));
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Pay for your ride</Text>

        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.cardBrand}>BAO PAY</Text>
          <Ionicons name="wifi" size={20} color="#FFFFFF" style={styles.cardWifi} />
          <Ionicons name="card" size={24} color="#FFFFFF" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>•••• 4821</Text>
          <View style={styles.cardRing} />
        </LinearGradient>

        <View style={styles.balanceRow}>
          <View style={styles.balanceLeft}>
            <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.balanceLabel}>E-Wallet balance</Text>
          </View>
          <Text style={styles.balanceValue}>₱{balance.toFixed(0)}</Text>
        </View>

        <View style={styles.bookingBox}>
          <Text style={styles.bookingTitle}>Booking details</Text>
          {booking ? (
            <>
              <DetailRow label="Ride" value={`${booking.pickup} → ${booking.destination}`} />
              <DetailRow label="Driver" value={booking.driver_name} />
              <DetailRow label="Ride type" value={booking.ride_type} />
              <DetailRow label="Date" value={booking.ride_date} />
              <DetailRow label="Pickup" value={booking.pickup_time} />
              <DetailRow label="Fare" value={`₱${fare.toFixed(0)}`} />
              {discount > 0 ? (
                <DetailRow label="Promo (BAOFIRST)" value={`-₱${discount}`} />
              ) : null}
            </>
          ) : (
            <Text style={styles.noBooking}>
              No pending booking. Schedule a ride on the Rides screen first.
            </Text>
          )}
        </View>

        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Amount due:</Text>
          <Text style={styles.fareValue}>₱{total.toFixed(0)}</Text>
        </View>

        <View style={styles.promoRow}>
          <View style={styles.promoLeft}>
            <Ionicons name="pricetag-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.promoCode}>BAOFIRST</Text>
          </View>
          <TouchableOpacity
            style={[styles.applyBtn, applied && styles.applyBtnDone]}
            activeOpacity={0.7}
            onPress={togglePromo}
          >
            <Text style={[styles.applyText, applied && styles.applyTextDone]}>
              {applied ? 'Applied' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.methodTitle}>Payment method</Text>
        <View style={styles.methodRow}>
          {['Cash', 'E-Wallet'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.methodChip, method === m && styles.methodChipActive]}
              activeOpacity={0.8}
              onPress={() => setMethod(m)}
            >
              <Ionicons
                name={method === m ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={method === m ? theme.colors.primary : theme.colors.muted}
              />
              <Text style={[styles.methodText, method === m && styles.methodTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.confirm, !booking && styles.confirmDisabled]}
          activeOpacity={0.85}
          onPress={confirmPayment}
          disabled={!booking}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>

        {payments.length > 0 && (
          <>
            <Text style={styles.historyTitle}>Recent payments</Text>
            {payments.map((p) => (
              <View key={p.id} style={styles.payRow}>
                <View style={styles.payIcon}>
                  <Ionicons name="receipt-outline" size={16} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.payMeta}>
                    Booking #{p.booking_id} · {p.method}
                  </Text>
                  <Text style={styles.payDate}>
                    {new Date(p.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Text style={styles.payAmount}>₱{Number(p.amount).toFixed(0)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={!!success} animationType="fade" transparent>
        <View style={styles.successBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Payment Successful</Text>

            {success && (
              <>
                <SuccessRow
                  label="Ride"
                  value={`${success.booking.pickup} → ${success.booking.destination}`}
                />
                <SuccessRow label="Driver" value={success.booking.driver_name} />
                <SuccessRow label="Pickup" value={success.booking.pickup_time} />
                <SuccessRow label="Fare" value={`₱${Number(success.amount).toFixed(0)}`} />
                <SuccessRow label="Payment" value={success.method} />
                <SuccessRow label="Status" value="PAID" />
                <SuccessRow
                  label="Booking"
                  value={success.booking.booking_status}
                />
                <SuccessRow
                  label="Wallet balance"
                  value={`₱${balance.toFixed(0)}`}
                />
              </>
            )}

            <TouchableOpacity
              style={styles.successBtn}
              activeOpacity={0.85}
              onPress={() => {
                setSuccess(null);
                navigation.navigate('Rides');
              }}
            >
              <Text style={styles.successBtnText}>View my rides</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.successClose}
              activeOpacity={0.8}
              onPress={() => setSuccess(null)}
            >
              <Text style={styles.successCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav active="Wallet" navigation={navigation} />
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function SuccessRow({ label, value }) {
  return (
    <View style={styles.successRow}>
      <Text style={styles.successLabel}>{label}</Text>
      <Text style={styles.successValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 130 },
  heading: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  card: {
    marginTop: 20,
    height: 160,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  cardBrand: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardWifi: { position: 'absolute', top: 24, right: 24 },
  cardIcon: { marginTop: 24 },
  cardNumber: {
    marginTop: 8,
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardRing: {
    position: 'absolute',
    right: -40,
    bottom: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 24,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  balanceLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  balanceLabel: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.ink },
  balanceValue: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary },

  bookingBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 14,
  },
  bookingTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.ink,
    marginBottom: 6,
  },
  noBooking: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  detailLabel: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted },
  detailValue: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.ink,
    flexShrink: 1,
    textAlign: 'right',
  },

  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  feeLabel: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: theme.colors.ink },
  fareValue: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.primary },

  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  promoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  promoCode: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.ink,
    letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  applyBtnDone: { backgroundColor: '#E3F3EC' },
  applyText: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.primary },
  applyTextDone: { color: theme.colors.success },

  methodTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontFamily: theme.fonts.semiBold,
    fontSize: 15,
    color: theme.colors.ink,
  },
  methodRow: { flexDirection: 'row', gap: 12 },
  methodChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  methodChipActive: { borderColor: theme.colors.primary, backgroundColor: '#F0F4FF' },
  methodText: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.muted },
  methodTextActive: { color: theme.colors.primary },

  confirm: {
    marginTop: 20,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDisabled: { backgroundColor: '#9AA4D6' },
  confirmText: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: '#FFFFFF' },

  historyTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.ink,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    padding: 10,
  },
  payIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payMeta: { fontFamily: theme.fonts.semiBold, fontSize: 12, color: theme.colors.ink },
  payDate: { fontFamily: theme.fonts.regular, fontSize: 11, color: theme.colors.muted },
  payAmount: { fontFamily: theme.fonts.bold, fontSize: 14, color: theme.colors.primary },

  successBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 27, 77, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  successCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'stretch',
  },
  successIcon: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.ink,
    marginBottom: 14,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 12,
  },
  successLabel: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted },
  successValue: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.ink,
    flexShrink: 1,
    textAlign: 'right',
  },
  successBtn: {
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBtnText: { fontFamily: theme.fonts.semiBold, fontSize: 15, color: '#FFFFFF' },
  successClose: {
    marginTop: 10,
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCloseText: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.mutedAlt },
});
