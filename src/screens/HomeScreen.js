import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Sheet from '../components/Sheet';
import PrimaryButton from '../components/PrimaryButton';
import { getCurrentLocationAsync } from '../services/locationService';
import { getRoute } from '../services/routingService';
import { LOCATIONS, DESTINATION_SUGGESTIONS, MATI_CITY } from '../constants/locations';
import { loadRecents, saveRecents } from '../services/storageService';

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);
  const [query, setQuery] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userCoords, setUserCoords] = useState(MATI_CITY);
  const [pickup, setPickup] = useState(LOCATIONS.DORSU_MAIN_CAMPUS);
  const [destination, setDestination] = useState(LOCATIONS.DAHICAN_BEACH);
  const [routeCoords, setRouteCoords] = useState([]);
  const [chip, setChip] = useState('Home');
  const [recents, setRecents] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    (async () => {
      const { coords, granted } = await getCurrentLocationAsync();
      setUserCoords(coords);
      setPermissionGranted(granted);
      setRecents(await loadRecents());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setRouteCoords(await getRoute(pickup, destination));
      } catch {
        setRouteCoords([pickup, destination]);
      }
    })();
  }, [pickup, destination]);

  const suggestions = DESTINATION_SUGGESTIONS.filter((d) =>
    d.label.toLowerCase().includes(query.toLowerCase())
  );

  const chooseDestination = async (loc) => {
    setDestination(loc);
    setQuery('');
    setShowSuggestions(false);
    const next = [loc, ...recents.filter((r) => r.id !== loc.id)].slice(0, 5);
    setRecents(next);
    saveRecents(next);
    mapRef.current?.animateToRegion(
      { latitude: loc.latitude, longitude: loc.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      600
    );
  };

  const applyChip = (label) => {
    setChip(label);
    if (label === 'Home') {
      setPickup(LOCATIONS.MATI_CITY_HALL);
    } else if (label === 'Work') {
      setPickup(LOCATIONS.DAHICAN_BEACH);
    }
  };

  const recenter = () => {
    const target = permissionGranted ? userCoords : MATI_CITY;
    mapRef.current?.animateToRegion(
      { ...target, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      600
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ ...MATI_CITY, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
        showsUserLocation={permissionGranted}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={pickup}
          title="Pickup"
          description={pickup.label}
          pinColor={theme.colors.primary}
        />
        <Marker
          coordinate={destination}
          title="Destination"
          description={destination.label}
          pinColor="#44A2EA"
        />
        {routeCoords.length >= 2 && (
          <Polyline coordinates={routeCoords} strokeColor={theme.colors.primary} strokeWidth={4} />
        )}
      </MapView>

      <TouchableOpacity style={styles.recenter} activeOpacity={0.7} onPress={recenter}>
        <Ionicons name="locate" size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      <Sheet style={styles.sheet}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={24} color={theme.colors.mutedAlt} />
          <TextInput
            placeholder="Where to?"
            placeholderTextColor={theme.colors.muted}
            style={styles.searchInput}
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.mutedAlt} />
            </TouchableOpacity>
          )}
        </View>

        {showSuggestions && (
          <ScrollView style={styles.suggestions} keyboardShouldPersistTaps="handled">
            {(chip === 'Recent' && recents.length > 0 ? recents : suggestions).map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.suggestionRow}
                onPress={() => chooseDestination(loc)}
              >
                <Ionicons name="location-outline" size={18} color={theme.colors.mutedAlt} />
                <Text style={styles.suggestionText}>{loc.label}</Text>
              </TouchableOpacity>
            ))}
            {chip === 'Recent' && recents.length === 0 && (
              <Text style={styles.emptyText}>No recent destinations yet.</Text>
            )}
          </ScrollView>
        )}

        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.pickupDot} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>{pickup.label}</Text>
            </View>
          </View>
          <View style={styles.connector} />
          <View style={styles.routeRow}>
            <View style={styles.destPin} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{destination.label}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chips}>
          {['Home', 'Work', 'Recent'].map((label) => (
            <Chip
              key={label}
              icon={label === 'Home' ? 'home-outline' : label === 'Work' ? 'briefcase-outline' : 'time-outline'}
              label={label}
              active={chip === label}
              onPress={() => {
                if (label === 'Recent') {
                  setChip('Recent');
                  setShowSuggestions(true);
                } else {
                  applyChip(label);
                }
              }}
            />
          ))}
        </View>

        <PrimaryButton
          title="Find ride"
          onPress={() =>
            navigation.navigate('ChooseRide', {
              pickupLabel: pickup.label,
              destinationLabel: destination.label,
            })
          }
        />
      </Sheet>

      <BottomNav active="Home" navigation={navigation} />
    </View>
  );
}

function Chip({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Ionicons name={icon} size={16} color={active ? '#FFFFFF' : theme.colors.mutedAlt} />
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.mapBg },
  map: { flex: 1 },
  recenter: {
    position: 'absolute',
    right: 24,
    bottom: 340,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    zIndex: 5,
  },
  sheet: {
    position: 'absolute',
    bottom: 92,
    left: 0,
    right: 0,
    maxHeight: 420,
    paddingTop: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.button,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.ink,
  },
  suggestions: { maxHeight: 110, marginTop: 8 },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionText: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.ink },
  emptyText: { paddingVertical: 10, color: theme.colors.muted, fontFamily: theme.fonts.regular },
  routeBlock: { marginTop: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  pickupDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primaryLight },
  destPin: { width: 10, height: 10, borderRadius: 3, backgroundColor: theme.colors.primary },
  connector: { marginLeft: 4, height: 26, borderLeftWidth: 2, borderStyle: 'dotted', borderColor: theme.colors.mutedAlt },
  routeText: { marginLeft: 24 },
  routeLabel: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.muted },
  routeValue: { fontFamily: theme.fonts.semiBold, fontSize: 15, color: theme.colors.ink },
  chips: { flexDirection: 'row', marginTop: 16, marginBottom: 20, gap: 12 },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.chipBg,
    gap: 6,
  },
  chipActive: { backgroundColor: theme.colors.primary },
  chipLabel: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.mutedAlt },
  chipLabelActive: { color: '#FFFFFF' },
});
