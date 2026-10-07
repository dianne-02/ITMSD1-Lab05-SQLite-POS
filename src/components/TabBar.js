import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const TABS = [
  { key: 'Home', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
  { key: 'Bookings', label: 'Bookings', icon: 'calendar', iconOutline: 'calendar-outline' },
  { key: 'Messages', label: 'Messages', icon: 'chatbubble-ellipses', iconOutline: 'chatbubble-ellipses-outline' },
  { key: 'Profile', label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
];

// Bottom tab bar shown on Home, Bookings and Profile in the Figma prototype
export default function TabBar({ active, onNavigate }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onNavigate(tab.key)}
          >
            {isActive ? (
              <View style={styles.activePill}>
                <Ionicons name={tab.icon} size={18} color={theme.colors.navy} />
                <Text style={styles.activeLabel}>{tab.label}</Text>
              </View>
            ) : (
              <>
                <Ionicons name={tab.iconOutline} size={20} color={theme.colors.textMuted} />
                <Text style={styles.label}>{tab.label}</Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.orangeLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
  },
  activeLabel: { color: theme.colors.navy, fontWeight: '600', fontSize: 12 },
  label: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
});
