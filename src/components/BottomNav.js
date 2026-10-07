import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const TABS = [
  { key: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'Rides', label: 'Rides', icon: 'car-sport-outline', activeIcon: 'car-sport' },
  { key: 'Wallet', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
  { key: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export default function BottomNav({ active, navigation }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.key)}
          >
            {isActive && <View style={styles.indicator} />}
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? theme.colors.primary : theme.colors.mutedAlt}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 92,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  indicator: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginBottom: 5,
  },
  label: {
    marginTop: 5,
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.mutedAlt,
  },
  labelActive: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#141B4D',
    opacity: 0.9,
  },
});
