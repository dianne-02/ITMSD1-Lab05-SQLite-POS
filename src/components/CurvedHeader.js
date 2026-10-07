import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

// Curved lavender header used by inner screens (Expert Profile, Payment, etc.)
export default function CurvedHeader({ title, onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.header}>
      <View style={styles.decoration} />
      <View style={styles.row}>
        <TouchableOpacity style={styles.circleButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {rightIcon ? (
          <TouchableOpacity style={styles.circleButton} onPress={onRightPress}>
            <Ionicons name={rightIcon} size={18} color={theme.colors.navy} />
          </TouchableOpacity>
        ) : (
          <View style={styles.circleButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.lavender,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  decoration: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.lavenderMid,
    top: -120,
    right: -60,
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.navy,
  },
});
