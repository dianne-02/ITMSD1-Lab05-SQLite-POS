import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

/**
 * Reusable picker modal used for pickup, destination, ride type, driver and time.
 * options: [{ id, label, sub?, icon? }]
 */
export default function OptionPicker({ visible, title, options, selectedId, onSelect, onClose }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sub && o.sub.toLowerCase().includes(q))
    );
  }, [options, query]);

  const close = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close}>
        <TouchableOpacity activeOpacity={1} style={styles.sheetWrap} onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={40}
          >
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{title}</Text>
                <TouchableOpacity onPress={close} accessibilityLabel="Close picker">
                  <Ionicons name="close" size={24} color={theme.colors.ink} />
                </TouchableOpacity>
              </View>

              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={theme.colors.muted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search…"
                  placeholderTextColor={theme.colors.muted}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery('')}>
                    <Ionicons name="close-circle" size={18} color={theme.colors.muted} />
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: 360 }}
                ItemSeparatorComponent={() => <View style={styles.sep} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No matches found.</Text>}
                renderItem={({ item }) => {
                  const active = String(item.id) === String(selectedId);
                  return (
                    <TouchableOpacity
                      style={[styles.row, active && styles.rowActive]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setQuery('');
                        onSelect(item);
                      }}
                    >
                      {item.icon ? (
                        <View style={styles.rowIcon}>
                          <Ionicons name={item.icon} size={18} color={theme.colors.primary} />
                        </View>
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowLabel}>{item.label}</Text>
                        {item.sub ? <Text style={styles.rowSub}>{item.sub}</Text> : null}
                      </View>
                      {active ? (
                        <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
                      ) : (
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 27, 77, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetWrap: { width: '100%' },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.ink },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.ink,
    paddingVertical: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rowActive: { backgroundColor: '#F0F4FF' },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { fontFamily: theme.fonts.semiBold, fontSize: 14, color: theme.colors.ink },
  rowSub: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.muted, marginTop: 1 },
  sep: { height: 1, backgroundColor: theme.colors.border },
  emptyText: {
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.muted,
    paddingVertical: 20,
  },
});
