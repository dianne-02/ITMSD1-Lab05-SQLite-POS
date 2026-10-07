import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import TabBar from '../components/TabBar';
import VerifiedBadge from '../components/VerifiedBadge';

import { db, initDatabase } from '../services/db';

const CATEGORIES = [
  { label: 'Home', icon: 'home-outline' },
  { label: 'Car', icon: 'car-outline' },
  { label: 'Laundry', mcIcon: 'washing-machine' },
  { label: 'Painting', mcIcon: 'format-paint' },
];

const EXPERT_IMAGES = {
  Home: require('../../assets/expert_maya_card.png'),
  Car: require('../../assets/expert_daniel_card.png'),
  Laundry: require('../../assets/expert_maya_card.png'),
  Painting: require('../../assets/expert_daniel_card.png'),
};

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Home');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Load products from SQLite
  const loadProducts = (query = '') => {
    try {
      if (query.trim() === '') {
        const rows = db.getAllSync(
          'SELECT * FROM products ORDER BY id DESC;'
        );

        setProducts(rows);
      } else {
        const rows = db.getAllSync(
          'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;',
          [`%${query}%`]
        );

        setProducts(rows);
      }
    } catch (error) {
      console.log('Error loading products:', error);
      Alert.alert('Database Error', 'Unable to load products.');
    }
  };

  // Initialize database when HomeScreen opens
  useEffect(() => {
    initDatabase();
    loadProducts();
  }, []);

  // Add product
  const handleAddProduct = () => {
    if (!name.trim() || !category.trim() || !price.trim() || !stock.trim()) {
      Alert.alert(
        'Missing Information',
        'Please fill in all product fields.'
      );
      return;
    }

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock, 10);

    if (isNaN(numericPrice) || isNaN(numericStock)) {
      Alert.alert(
        'Invalid Information',
        'Price and stock must be valid numbers.'
      );
      return;
    }

    try {
      db.runSync(
        `INSERT INTO products
          (name, category, price, stock)
         VALUES (?, ?, ?, ?);`,
        [
          name.trim(),
          category.trim(),
          numericPrice,
          numericStock,
        ]
      );

      setName('');
      setCategory('Home');
      setPrice('');
      setStock('');
      setModalVisible(false);

      loadProducts(search);

      Alert.alert('Success', 'Product added successfully.');
    } catch (error) {
      console.log('Error adding product:', error);
      Alert.alert('Database Error', 'Unable to add product.');
    }
  };

  // Delete product
  const handleDeleteProduct = (id, productName) => {
    Alert.alert(
      'Delete Confirmation',
      `Remove ${productName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              db.runSync(
                'DELETE FROM products WHERE id = ?;',
                [id]
              );

              loadProducts(search);
            } catch (error) {
              console.log('Error deleting product:', error);
              Alert.alert(
                'Database Error',
                'Unable to delete product.'
              );
            }
          },
        },
      ]
    );
  };

  const onTab = (tab) => {
    if (tab === 'Home') return;

    if (tab === 'Messages') {
      alert('Messages is not part of this demo.');
      return;
    }

    navigation.navigate(tab);
  };

  return (
    <View style={styles.container}>
      <FakeStatusBar />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>
            Hi Dianne, need some help today?
          </Text>

          <Image
            source={require('../../assets/avatar_profile.png')}
            style={styles.avatar}
          />
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.navy}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search for a service"
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              loadProducts(text);
            }}
          />

          <Ionicons
            name="options-outline"
            size={20}
            color={theme.colors.navy}
          />
        </View>

        {/* Promo banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTag}>
              A FRESH START FOR LESS
            </Text>

            <Text style={styles.bannerTitle}>
              Full Pack 50% OFF
            </Text>

            <Text style={styles.bannerSub}>
              Save on your first home clean.
            </Text>
          </View>

          <Image
            source={require('../../assets/promo_woman.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={styles.category}
              onPress={() => {
                setSearch(cat.label);
                loadProducts(cat.label);
              }}
            >
              <View style={styles.categoryCircle}>
                {cat.mcIcon ? (
                  <MaterialCommunityIcons
                    name={cat.mcIcon}
                    size={24}
                    color={theme.colors.indigo}
                  />
                ) : (
                  <Ionicons
                    name={cat.icon}
                    size={24}
                    color={theme.colors.indigo}
                  />
                )}
              </View>

              <Text style={styles.categoryLabel}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Experts Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Our Experts
          </Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.seeAll}>
              + Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* Products / Experts from SQLite */}
        <View style={styles.expertRow}>
          {products.map((product) => {
            const expert = {
              id: String(product.id),
              name: product.name,
              service: product.category,
              price: `$${Number(product.price).toFixed(2)}/day`,
              rating: '4.9',
              image:
                EXPERT_IMAGES[product.category] ||
                require('../../assets/expert_maya_card.png'),
              stock: product.stock,
            };

            return (
              <TouchableOpacity
                key={product.id}
                style={styles.expertCard}
                onPress={() =>
                  navigation.navigate('ExpertProfile', {
                    expert,
                  })
                }
              >
                <Image
                  source={expert.image}
                  style={styles.expertImage}
                />

                <View style={styles.expertInfo}>
                  <View style={styles.expertNameRow}>
                    <Text
                      style={styles.expertName}
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>

                    <VerifiedBadge size={16} />
                  </View>

                  <Text style={styles.expertService}>
                    {product.category}
                  </Text>

                  <Text style={styles.expertMeta}>
                    {expert.price} ·{' '}
                    <Ionicons
                      name="star"
                      size={12}
                      color={theme.colors.orange}
                    />{' '}
                    {expert.rating}
                  </Text>

                  <Text style={styles.stockText}>
                    Stock: {product.stock} units
                  </Text>

                  {/* Delete */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      handleDeleteProduct(
                        product.id,
                        product.name
                      )
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color="#DC2626"
                    />

                    <Text style={styles.deleteText}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty result */}
        {products.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={36}
              color={theme.colors.textMuted}
            />

            <Text style={styles.emptyText}>
              No services found.
            </Text>
          </View>
        )}
      </ScrollView>

      <TabBar
        active="Home"
        onNavigate={onTab}
      />

      {/* Add Product Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Add New Item
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Product Name"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              placeholderTextColor={theme.colors.textMuted}
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />

            <TextInput
              style={styles.input}
              placeholder="Initial Stock"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
              value={stock}
              onChangeText={setStock}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setName('');
                  setCategory('Home');
                  setPrice('');
                  setStock('');
                }}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.saveButtonText}>
                  Save to SQLite
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.navy,
    flex: 1,
    paddingRight: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 18,
  },

  searchInput: {
    flex: 1,
    color: theme.colors.navy,
    fontSize: 14,
    paddingVertical: 6,
  },

  banner: {
    backgroundColor: theme.colors.lavender,
    borderRadius: 24,
    marginTop: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 130,
  },

  bannerText: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },

  bannerTag: {
    color: theme.colors.navy,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },

  bannerTitle: {
    color: theme.colors.navy,
    fontWeight: '800',
    fontSize: 22,
    marginTop: 4,
  },

  bannerSub: {
    color: theme.colors.navy,
    fontSize: 12,
    marginTop: 6,
    opacity: 0.8,
  },

  bannerImage: {
    width: 150,
    alignSelf: 'flex-end',
  },

  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  category: {
    alignItems: 'center',
  },

  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryLabel: {
    marginTop: 8,
    color: theme.colors.navy,
    fontSize: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.navy,
  },

  seeAll: {
    color: theme.colors.indigo,
    fontWeight: '600',
    fontSize: 13,
  },

  expertRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 14,
  },

  expertCard: {
    width: '47%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },

  expertImage: {
    width: '100%',
    height: 110,
  },

  expertInfo: {
    padding: 12,
  },

  expertNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  expertName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.navy,
    flex: 1,
  },

  expertService: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  expertMeta: {
    color: theme.colors.navy,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },

  stockText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },

  deleteText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    marginTop: 10,
    color: theme.colors.textMuted,
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.navy,
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
    color: theme.colors.navy,
    backgroundColor: '#FFFFFF',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },

  cancelButton: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },

  cancelButtonText: {
    color: theme.colors.textMuted,
    fontWeight: '700',
  },

  saveButton: {
    backgroundColor: theme.colors.indigo,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});