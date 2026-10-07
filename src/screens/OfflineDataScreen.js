import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import Header from '../components/Header';
import {
  initDatabase,
  getProducts,
  addProduct,
  deleteProduct,
  incrementStock,
  decrementStock,
} from '../services/db';

export default function OfflineDataScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const refresh = (q = search) => setProducts(getProducts(q));

  useEffect(() => {
    initDatabase();
    setProducts(getProducts(''));
  }, []);

  const onSearch = (t) => {
    setSearch(t);
    setProducts(getProducts(t)); // SQL LIKE filtering
  };

  const clearSearch = () => {
    setSearch('');
    setProducts(getProducts(''));
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
  };

  const handleAdd = () => {
    const n = name.trim();
    const c = category.trim();
    const p = parseFloat(price);
    const s = parseInt(stock, 10);
    if (!n) return Alert.alert('Invalid input', 'Name is required.');
    if (!c) return Alert.alert('Invalid input', 'Category is required.');
    if (isNaN(p) || p < 0) return Alert.alert('Invalid input', 'Price must be a valid number.');
    if (isNaN(s) || s < 0) return Alert.alert('Invalid input', 'Stock must be a valid number.');
    addProduct(n, c, p, s);
    resetForm();
    setModalVisible(false);
    refresh();
  };

  const handleDelete = (item) => {
    Alert.alert('Delete Confirmation', `Remove ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProduct(item.id);
          refresh();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.stock} in stock</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.price}>₱{Number(item.price).toFixed(2)}</Text>
        <View style={styles.counter}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => {
              decrementStock(item.id);
              refresh();
            }}
          >
            <Ionicons name="remove" size={18} color={theme.colors.ink} />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{item.stock}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => {
              incrementStock(item.id);
              refresh();
            }}
          >
            <Ionicons name="add" size={18} color={theme.colors.ink} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
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

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.heading}>Offline Data</Text>
            <Text style={styles.sub}>{products.length} products · SQLite</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color={theme.colors.mutedAlt} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={theme.colors.muted}
            value={search}
            onChangeText={onSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color={theme.colors.mutedAlt} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No products found in SQLite database</Text>
          }
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrap}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Product</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Bao Bao Ride Pass" placeholderTextColor={theme.colors.muted} />

            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="e.g. Route" placeholderTextColor={theme.colors.muted} />

            <Text style={styles.label}>Price (PHP)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" placeholderTextColor={theme.colors.muted} />

            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" placeholderTextColor={theme.colors.muted} />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surfaceAlt },
  body: { flex: 1, padding: 24 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.ink },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  heading: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.ink },
  sub: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addText: { color: '#FFFFFF', fontFamily: theme.fonts.semiBold, fontSize: 14 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 16,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: { flex: 1, fontFamily: theme.fonts.regular, fontSize: 15, color: theme.colors.ink },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardInfo: { flex: 1, marginRight: 8 },
  cardName: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.ink },
  cardCategory: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.muted, marginTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: theme.fonts.semiBold, fontSize: 12, color: theme.colors.primary },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  price: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.ink, minWidth: 20, textAlign: 'center' },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  empty: { textAlign: 'center', marginTop: 60, fontFamily: theme.fonts.regular, fontSize: 15, color: theme.colors.muted },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(14,42,53,0.5)' },
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.ink, marginBottom: 8 },
  label: { fontFamily: theme.fonts.semiBold, fontSize: 13, color: theme.colors.muted, marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.ink,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontFamily: theme.fonts.semiBold, fontSize: 15, color: theme.colors.mutedAlt },
  saveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { fontFamily: theme.fonts.bold, fontSize: 15, color: '#FFFFFF' },
});
