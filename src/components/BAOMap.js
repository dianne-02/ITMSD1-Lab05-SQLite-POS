import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MATI_CITY } from '../constants/locations';
import theme from '../theme';

export default function BAOMap({ height, pickup, destination, routeCoords, showsUserLocation = false }) {
  return (
    <MapView
      style={{ height, width: '100%' }}
      initialRegion={{ ...MATI_CITY, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
    >
      {pickup && (
        <Marker coordinate={pickup} title="Pickup" description={pickup.label} pinColor={theme.colors.primary} />
      )}
      {destination && (
        <Marker coordinate={destination} title="Destination" description={destination.label} pinColor="#44A2EA" />
      )}
      {routeCoords && routeCoords.length >= 2 && (
        <Polyline coordinates={routeCoords} strokeColor={theme.colors.primary} strokeWidth={4} />
      )}
    </MapView>
  );
}
