import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchProducts } from '../app/api/products';
import ProductCard from '../components/shop/ProductCard';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/agrinest';
import type { ProductItem, ProductsPagination } from '../types/product';
import type { MainStackParamList } from './HomeScreen';
import IMG from '../utils/images';
import { ROUTES, showError, showSuccess } from '../utils';

const PAGE_LIMIT = 9;

type ShopNav = StackNavigationProp<MainStackParamList, 'Shop'>;

export default function ShopScreen() {
  const navigation = useNavigation<ShopNav>();
  const insets = useSafeAreaInsets();
  const { cart, addProduct, refreshCart } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [pagination, setPagination] = useState<ProductsPagination | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (opts?: { page?: number; q?: string; refresh?: boolean }) => {
      const nextPage = opts?.page ?? page;
      const nextQuery = opts?.q ?? activeQuery;
      const isRefresh = opts?.refresh ?? false;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await fetchProducts({
          page: nextPage,
          limit: PAGE_LIMIT,
          q: nextQuery,
        });
        setProducts(response.data.items);
        setPagination(response.data.pagination);
        setPage(response.data.pagination.page);
        setActiveQuery(response.data.filters.q ?? nextQuery);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Could not load products.';
        setError(message);
        setProducts([]);
        setPagination(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeQuery, page],
  );

  useEffect(() => {
    void loadProducts({ page: 1, q: '' });
    // Initial catalog load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshCart();
    }, [refreshCart]),
  );

  const handleAddToCart = async (productId: number) => {
    try {
      await addProduct(productId, 1);
      showSuccess('Cart', 'Added to cart.');
      await loadProducts({ page, q: activeQuery, refresh: true });
    } catch (err: unknown) {
      showError(
        'Cart',
        err instanceof Error ? err.message : 'Could not add to cart.',
      );
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadProducts({ page: 1, q: searchInput.trim() });
  };

  const goToPage = (nextPage: number) => {
    if (!pagination) {
      return;
    }
    if (nextPage < 1 || nextPage > pagination.totalPages) {
      return;
    }
    loadProducts({ page: nextPage, q: activeQuery });
  };

  const onRefresh = () => {
    loadProducts({ page, q: activeQuery, refresh: true });
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>
        <View style={styles.topNavRight}>
          <TouchableOpacity
            style={styles.cartNavBtn}
            onPress={() => navigation.navigate(ROUTES.CART)}
          >
            <Text style={styles.navLink}>Cart</Text>
            {cart.totalItems > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.totalItems}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.PROFILE)}>
            <Text style={styles.navLink}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.brandRow}>
        <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
        <View style={styles.brandTextWrap}>
          <Text style={styles.brandTitle}>AgriNest</Text>
          <Text style={styles.brandSubtitle}>Fresh poultry products</Text>
        </View>
      </View>

      <View style={styles.heroBanner}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>WELCOME TO THE SHOP</Text>
          <Text style={styles.heroTitle}>Browse our catalog</Text>
          <Text style={styles.heroText}>
            Chicks, eggs, and poultry items with live stock and pricing from
            your store.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop</Text>
        <Text style={styles.sectionSubtitle}>
          Search by name or category, then explore what is in stock.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search by name or category…"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              loadProducts({ page: 1, q: activeQuery });
            }}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  const renderFooter = () => {
    if (!pagination || pagination.total === 0) {
      return null;
    }

    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);

    return (
      <View style={styles.footer}>
        <Text style={styles.pageInfo}>
          Showing {start} to {end} of {pagination.total} entries
        </Text>
        {pagination.totalPages > 1 ? (
          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[
                styles.pageBtn,
                pagination.page <= 1 && styles.pageBtnDisabled,
              ]}
              disabled={pagination.page <= 1}
              onPress={() => goToPage(pagination.page - 1)}
            >
              <Text style={styles.pageBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.pageCurrent}>
              Page {pagination.page} / {pagination.totalPages}
            </Text>
            <TouchableOpacity
              style={[
                styles.pageBtn,
                pagination.page >= pagination.totalPages &&
                  styles.pageBtnDisabled,
              ]}
              disabled={pagination.page >= pagination.totalPages}
              onPress={() => goToPage(pagination.page + 1)}
            >
              <Text style={styles.pageBtnText}>›</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  if (loading && products.length === 0 && !error) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Image source={IMG.LOGO} style={styles.logoLoading} resizeMode="contain" />
        <ActivityIndicator size="large" color={colors.gradientOrangeStart} />
        <Text style={styles.loadingText}>Loading products…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.emptyText}>No products found.</Text>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard product={item} onAddToCart={handleAddToCart} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  logoLoading: {
    width: 120,
    height: 72,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cartBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.price,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  navLink: {
    color: colors.brandBrown,
    fontWeight: '700',
    fontSize: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  logo: {
    width: 72,
    height: 56,
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.brandOrange,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  heroBanner: {
    borderRadius: 22,
    minHeight: 160,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: colors.heroOverlay,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 44, 29, 0.72)',
  },
  heroContent: {
    padding: 18,
    zIndex: 1,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 21,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.brandBrown,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: colors.gradientOrangeStart,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  gridRow: {
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  errorBox: {
    backgroundColor: colors.stockOutBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: colors.stockOutText,
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandBrown,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
    marginVertical: 24,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    alignItems: 'center',
  },
  pageInfo: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.badgeBg,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.brandBrown,
  },
  pageCurrent: {
    fontWeight: '700',
    color: colors.brandBrown,
  },
});
