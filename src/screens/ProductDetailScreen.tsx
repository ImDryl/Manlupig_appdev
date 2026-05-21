import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { fetchProduct } from '../app/api/products';
import CustomButton from '../components/CustomButton';
import type { RootState } from '../app/reducers';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/agrinest';
import type { ProductItem } from '../types/product';
import type { MainStackParamList } from './HomeScreen';
import IMG from '../utils/images';
import { ROUTES, showError, showSuccess } from '../utils';
import { getAuthToken } from '../utils/authToken';

type Nav = StackNavigationProp<MainStackParamList, 'ProductDetail'>;
type Route = RouteProp<MainStackParamList, 'ProductDetail'>;

function formatPrice(price: number | null): string {
  if (price === null) {
    return '—';
  }
  return `₱${price.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ProductDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const token = useSelector((state: RootState) => getAuthToken(state));
  const { addProduct } = useCart();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProduct(route.params.productId);
      setProduct(data);
    } catch (err: unknown) {
      showError(
        'Product',
        err instanceof Error ? err.message : 'Could not load product.',
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [route.params.productId]);

  React.useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAdd = async () => {
    if (!product || !token) {
      return;
    }
    setAdding(true);
    try {
      await addProduct(product.id, 1);
      showSuccess('Added', `${product.name} added to cart.`);
    } catch (err: unknown) {
      showError(
        'Cart',
        err instanceof Error ? err.message : 'Could not add to cart.',
      );
    } finally {
      setAdding(false);
    }
  };

  const inStock = (product?.quantity ?? 0) > 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Product</Text>
        <View style={styles.topSpacer} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brandOrange} />
        </View>
      ) : !product ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Product not found.</Text>
          <CustomButton label="Back to Shop" onPress={() => navigation.navigate(ROUTES.SHOP)} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
          <View style={styles.media}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="contain" />
            ) : (
              <Text style={styles.noImage}>No image</Text>
            )}
          </View>
          {product.category ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
          ) : null}
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.stock}>
            {inStock ? `${product.quantity} in stock` : 'Out of stock'}
          </Text>
          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : (
            <Text style={styles.descriptionMuted}>No description provided.</Text>
          )}
          <CustomButton
            label={inStock ? 'Add to Cart' : 'Unavailable'}
            onPress={handleAdd}
            loading={adding}
            disabled={!inStock}
            containerStyle={styles.addBtn}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 72 },
  backIcon: { fontSize: 22, color: colors.brandBrown, fontWeight: '700' },
  backText: { fontSize: 15, fontWeight: '700', color: colors.brandBrown },
  topTitle: { fontSize: 17, fontWeight: '800', color: colors.title },
  topSpacer: { minWidth: 72 },
  centered: { flex: 1, justifyContent: 'center', padding: 24 },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginBottom: 16 },
  content: { paddingHorizontal: 18, paddingTop: 12 },
  logo: { width: 90, height: 58, alignSelf: 'center', marginBottom: 12 },
  media: {
    height: 220,
    borderRadius: 16,
    backgroundColor: colors.mediaBgStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  image: { width: '100%', height: '100%' },
  noImage: { color: colors.textMuted, fontWeight: '600' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    backgroundColor: colors.badgeBg,
    marginBottom: 10,
  },
  badgeText: { color: colors.brandBrown, fontWeight: '700', fontSize: 12 },
  title: { fontSize: 24, fontWeight: '900', color: colors.title, marginBottom: 8 },
  price: { fontSize: 22, fontWeight: '900', color: colors.price, marginBottom: 6 },
  stock: { fontSize: 14, fontWeight: '700', color: colors.brandBrown, marginBottom: 14 },
  description: { fontSize: 15, lineHeight: 22, color: colors.text, marginBottom: 20 },
  descriptionMuted: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  addBtn: { marginTop: 4 },
});
