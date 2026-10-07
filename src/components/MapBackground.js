import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

// Simplified map background inspired by the Figma "Map/City" layer
export default function MapBackground({ height }) {
  return (
    <View style={[styles.map, { height }]}>
      <View style={[styles.river]} />
      {blocks.map((b, i) => (
        <View
          key={i}
          style={[
            styles.block,
            { left: b[0], top: b[1], width: b[2], height: b[3] },
          ]}
        />
      ))}
      <View style={styles.park} />
      <Text style={[styles.place, { left: 20, top: 98 }]}>Park</Text>
      <Text style={[styles.place, { left: 94, top: 200 }]}>DOrSU</Text>
      <Text style={[styles.place, { left: 296, top: 18 }]}>Dahican</Text>
      <Text style={[styles.place, { left: 104, top: 288 }]}>Mati City</Text>
    </View>
  );
}

const blocks = [
  [-16, 16, 80, 64], [80, 16, 96, 64], [192, 16, 72, 64], [280, 16, 104, 64],
  [8, 96, 64, 80], [88, 96, 88, 80], [192, 96, 56, 80], [264, 96, 112, 80],
  [-16, 192, 88, 80], [88, 192, 88, 80], [192, 192, 88, 80], [296, 192, 96, 80],
  [8, 288, 64, 80], [88, 288, 96, 80], [200, 288, 64, 80], [280, 288, 104, 80],
  [8, 384, 88, 80], [112, 384, 64, 80], [192, 384, 88, 80], [296, 384, 96, 80],
];

const styles = StyleSheet.create({
  map: {
    width: '100%',
    backgroundColor: theme.colors.mapBg,
    overflow: 'hidden',
  },
  river: {
    position: 'absolute',
    top: -24,
    right: -30,
    width: 128,
    height: 560,
    backgroundColor: theme.colors.mapRiver,
    borderRadius: 64,
    opacity: 0.7,
  },
  block: {
    position: 'absolute',
    backgroundColor: theme.colors.mapBlock,
    borderRadius: 8,
  },
  park: {
    position: 'absolute',
    left: 16,
    top: 202,
    width: 48,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.mapPark,
  },
  place: {
    position: 'absolute',
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.mutedAlt,
  },
});
