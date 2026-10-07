import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../services/storageService';

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  React.useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const update = async (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const Row = ({ icon, label, right }) => (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={styles.label}>{label}</Text>
      {right}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Settings</Text>

        <Row
          icon="notifications-outline"
          label="Notifications"
          right={
            <Switch
              value={settings.notifications}
              onValueChange={(v) => update({ notifications: v })}
              trackColor={{ true: theme.colors.primary }}
            />
          }
        />
        <Row
          icon="location-outline"
          label="Location"
          right={
            <Switch
              value={settings.location}
              onValueChange={(v) => update({ location: v })}
              trackColor={{ true: theme.colors.primary }}
            />
          }
        />
        <Row
          icon="moon-outline"
          label="Appearance"
          right={<Text style={styles.value}>{settings.appearance}</Text>}
        />
        <Row icon="information-circle-outline" label="About BAO BAO" right={<Text style={styles.value}>{settings.about}</Text>} />

        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => navigation.navigate('OfflineData')}>
          <Ionicons name="server-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Offline Data</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.mutedAlt} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  body: { padding: 24 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.ink },
  heading: { marginTop: 16, marginBottom: 16, fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.ink },
  value: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.muted },
});
