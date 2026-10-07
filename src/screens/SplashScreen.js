import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { saveOnboarding } from '../services/storageService';

export default function SplashScreen({ navigation }) {
  const getStarted = async () => {
    await saveOnboarding(true);
    navigation.replace('Home');
  };
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.illustrationWrap}>
        <View style={styles.halo} />
        <View style={[styles.dot, { top: 74, left: 30 }]} />
        <View style={[styles.dot, { top: 174, left: 276, width: 10, height: 10 }]} />
        <View style={styles.lens} />
        <Ionicons name="search" size={180} color="#B9C6F2" style={styles.lensIcon} />
        <MaterialCommunityIcons
          name="rickshaw"
          size={110}
          color={theme.colors.primaryLight}
          style={styles.truck}
        />
        <Ionicons name="location" size={56} color={theme.colors.primaryLight} style={styles.pin} />
      </View>

      <Text style={styles.title}>BAO BAO</Text>
      <Text style={styles.tagline}>Your ride, anytime</Text>

      <View style={styles.indicators}>
        <View style={styles.indicatorActive} />
        <View style={styles.indicator} />
        <View style={styles.indicator} />
      </View>

      <View style={styles.buttonWrap}>
        <PrimaryButton
          title="GET STARTED"
          icon="arrow-forward"
          onPress={getStarted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  illustrationWrap: {
    marginTop: 64,
    alignSelf: 'center',
    width: 310,
    height: 288,
  },
  halo: {
    position: 'absolute',
    top: 16,
    left: 15,
    width: 280,
    height: 264,
    borderRadius: 140,
    backgroundColor: '#EAF0F8',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: theme.colors.primaryLight,
  },
  lens: {
    position: 'absolute',
    top: 88,
    left: 60,
    width: 184,
    height: 172,
    borderRadius: 92,
    borderWidth: 10,
    borderColor: '#C7D2F5',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  lensIcon: { position: 'absolute', top: 88, left: 60 },
  truck: { position: 'absolute', top: 136, left: 72 },
  pin: { position: 'absolute', top: 0, left: 127 },
  title: {
    marginTop: 24,
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
    fontSize: 44,
    color: theme.colors.primary,
  },
  tagline: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    fontSize: 18,
    color: theme.colors.muted,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  indicatorActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  buttonWrap: { paddingHorizontal: 24, marginTop: 48 },
});
