import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

// Small orange "verified" seal shown next to expert names
export default function VerifiedBadge({ size = 18 }) {
  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Ionicons name="checkmark" size={size * 0.65} color={theme.colors.orange} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: theme.colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
