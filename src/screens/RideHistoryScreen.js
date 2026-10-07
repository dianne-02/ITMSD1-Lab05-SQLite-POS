import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import Header from '../components/Header';
import { initDatabase, getBookings } from '../services/db';

export default function RideHistoryScreen({ navigation }) {
  const [rides, setRides] = useState([]);

  useFocusEffect(
    useCallback(() => {
      initDatabase();
      setRides(getBookings());
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Ride history</Text>

        <FlatList
          data={rides}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.empty}>No rides yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name="car-sport" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.date}>{item.ride_date} · {item.pickup_time}</Text>
                <Text style={styles.route}>{item.pickup} — {item.destination}</Text>
                <Text style={styles.status}>
                  {item.driver_name} · {item.ride_type} · {item.booking_status}
                  {item.payment_method ? ` · ${item.payment_method}` : ''}
                </Text>
              </View>
              <Text style={styles.fare}>₱{Number(item.fare).toFixed(0)}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { flex: 1, padding: 24 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.ink },
  heading: { marginTop: 16, marginBottom: 16, fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  empty: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.muted, marginTop: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: { flex: 1, marginLeft: 12 },
  date: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.muted },
  route: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.ink },
  status: { fontFamily: theme.fonts.regular, fontSize: 11, color: theme.colors.muted },
  fare: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.primary },
});
