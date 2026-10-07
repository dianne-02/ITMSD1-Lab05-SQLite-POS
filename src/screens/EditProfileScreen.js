import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import { loadProfile, saveProfile } from '../services/storageService';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  React.useEffect(() => {
    loadProfile().then((p) => {
      setName(p.name);
      setPhone(p.phone);
    });
  }, []);

  const save = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Invalid input', 'Name and phone are required.');
      return;
    }
    await saveProfile({ name: name.trim(), phone: phone.trim() });
    Alert.alert('Saved', 'Profile updated.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Edit profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.save} onPress={save}>
          <Text style={styles.saveText}>Save changes</Text>
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
  heading: { marginTop: 16, fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  label: { marginTop: 20, marginBottom: 6, fontFamily: theme.fonts.semiBold, fontSize: 13, color: theme.colors.muted },
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: theme.colors.ink,
  },
  save: {
    marginTop: 28,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { fontFamily: theme.fonts.semiBold, fontSize: 16, color: '#FFFFFF' },
});
