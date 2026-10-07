import React, { useEffect, useState, useCallback } from 'react';
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
import {
  initDatabase,
  getProducts,
  getCategories,
  addProduct,
  incrementStock,
  decrementStock,
  deleteProduct,
} from '../services/db';

export default function SQLitePOSScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const refresh = useCallback(() => {
    setProducts(getProducts(searchQuery, selectedCategory));
    setCategories(getCategories());
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    initDatabase();
    setProducts(getProducts('', 'All'));
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    setProducts(getProducts(searchQuery, selectedCategory));
  }, [searchQuery, selectedCategory]);

  const handleSearch = (text) => setSearchQuery(text);

  const clearSearch = () => {
    setSearchQuery('');
    setProducts(getProducts('', selectedCategory));
  };

  const handleIncrement = (item) => {
    incrementStock(item.id);
    refresh();
  };

  const handleDecrement = (item) => {
    if (item.stock <= 0) return;
    decrementStock(item.id);
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

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
  };

  const handleAdd = () => {
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (!trimmedName) {
      Alert.alert('Invalid input', 'Product name is required.');
      return;
    }
    if (!trimmedCategory) {
      Alert.alert('Invalid input', 'Category is required.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Invalid input', 'Price must be a valid positive number.');
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      Alert.alert('Invalid input', 'Stock must be a valid whole number.');
      return;
    }

    addProduct(trimmedName, trimmedCategory, parsedPrice, parsedStock);
    resetForm();
    setModalVisible(false);
    refresh();
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
        <Text style={styles.price}>₱{item.price.toFixed(2)}</Text>
        <View style={styles.counter}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => handleDecrement(item)}>
            <Ionicons name="remove" size={18} color="#0E2A35" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{item.stock}</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => handleIncrement(item)}>
            <Ionicons name="add" size={18} color="#0E2A35" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
            accessibilityLabel={`Delete ${item.name}`}
          >
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Store Inventory</Text>
          <Text style={styles.headerSub}>{products.length} products</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addHeaderText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chipsRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found in SQLite database</Text>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrap}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Product</Text>

            <Text style={styles.label}>Product Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Fresh Mangoes" placeholderTextColor="#94A3B8" />

            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="e.g. Produce" placeholderTextColor="#94A3B8" />

            <Text style={styles.label}>Price (PHP)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" placeholderTextColor="#94A3B8" />

            <Text style={styles.label}>Initial Stock</Text>
            <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" placeholderTextColor="#94A3B8" />

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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#0E2A35',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  headerSub: { color: '#94A3B8', fontSize: 13, marginTop: 2 },
  addHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00758F',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  addHeaderText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#0E2A35' },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 14,
    gap: 8,
  },
  chip: {
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#00758F' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  chipTextActive: { color: '#FFFFFF' },
  list: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardInfo: { flex: 1, marginRight: 8 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#0E2A35' },
  cardCategory: { fontSize: 13, color: '#64748B', marginTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#00758F' },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  price: { fontSize: 18, fontWeight: '700', color: '#00758F' },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: { fontSize: 16, fontWeight: '700', color: '#0E2A35', minWidth: 20, textAlign: 'center' },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15, color: '#64748B' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(14,42,53,0.5)' },
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0E2A35', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: '#0E2A35',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#475569' },
  saveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#00758F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
