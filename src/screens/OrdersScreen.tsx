import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { fetchOrders } from '../app/api/orders';
import type { RootState } from '../app/reducers';
import { colors } from '../theme/agrinest';
import type { OrderSummary } from '../types/order';
import type { MainStackParamList } from './HomeScreen';
import { ROUTES, showError } from '../utils';
import { getAuthToken } from '../utils/authToken';

type Nav = StackNavigationProp<MainStackParamList, 'Orders'>;

function formatPrice(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function OrdersScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const token = useSelector((state: RootState) => getAuthToken(state));
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const items = await fetchOrders(token);
      setOrders(items);
    } catch (err: unknown) {
      showError(
        'Orders',
        err instanceof Error ? err.message : 'Could not load orders.',
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>My Orders</Text>
        <View style={styles.topSpacer} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brandOrange} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Place an order from checkout to see it here.</Text>
          <TouchableOpacity
            style={styles.shopLink}
            onPress={() => navigation.navigate(ROUTES.SHOP)}
          >
            <Text style={styles.shopLinkText}>Go to Shop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })
              }
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                <Text style={styles.total}>{formatPrice(item.total)}</Text>
              </View>
              <Text style={styles.meta}>
                {formatDate(item.orderDate)} · {item.itemCount} item(s)
              </Text>
              <Text style={styles.status}>
                {item.status}
                {item.paymentMethod ? ` · ${item.paymentMethod}` : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
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
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.title, textAlign: 'center' },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 8 },
  shopLink: { marginTop: 16, alignSelf: 'center' },
  shopLinkText: { color: colors.brandOrange, fontWeight: '800', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderNumber: { fontWeight: '800', fontSize: 15, color: colors.title },
  total: { fontWeight: '900', fontSize: 15, color: colors.price },
  meta: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  status: { fontSize: 13, fontWeight: '700', color: colors.brandBrown },
});
