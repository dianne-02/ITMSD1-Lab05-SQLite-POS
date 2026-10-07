import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';

export default function Header({ showBack, onBack, title }) {
  const navigation = useNavigation();
  const goBack = onBack || (() => navigation.goBack());
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backWrap}
          activeOpacity={0.8}
          onPress={goBack}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.badge}>
          <MaterialCommunityIcons name="rickshaw" size={24} color="#FFFFFF" />
        </View>
      )}
      <Text style={[styles.brand, showBack && styles.brandSmall]}>
        {title || 'BAO BAO'}
      </Text>
      <TouchableOpacity
        style={styles.settingsWrap}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Settings')}
        accessibilityLabel="Open settings"
      >
        <Ionicons name="settings" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 68,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    marginLeft: 12,
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: theme.colors.primary,
  },
  brandSmall: { fontSize: 20 },
  settingsWrap: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2437C9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});
