import * as Location from 'expo-location';
import { MATI_CITY } from '../constants/locations';

/**
 * Requests foreground permission and returns the device location.
 * Falls back to Mati City when permission is denied or GPS fails.
 */
export async function getCurrentLocationAsync() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { coords: MATI_CITY, granted: false };
    }
    const pos = await Location.getCurrentPositionAsync({});
    return {
      coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
      granted: true,
    };
  } catch {
    return { coords: MATI_CITY, granted: false };
  }
}
