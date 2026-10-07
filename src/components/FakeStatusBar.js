import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

// Fake iOS status bar to match the Figma frames
export default function FakeStatusBar({ light = false }) {
  const color = light ? theme.colors.white : theme.colors.navy;
  return (
    <View style={styles.container}>
      <Text style={[styles.time, { color }]}>9:41</Text>
      <View style={styles.icons}>
        <Ionicons name="cellular" size={14} color={color} />
        <Ionicons name="wifi" size={14} color={color} />
        <Ionicons name="battery-full" size={16} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 6,
  },
  time: { fontWeight: '600', fontSize: 14 },
  icons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
