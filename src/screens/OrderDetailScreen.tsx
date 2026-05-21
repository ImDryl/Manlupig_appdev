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
import { fetchOrder } from '../app/api/orders';
import type { RootState } from '../app/reducers';
import { colors } from '../theme/agrinest';
import type { OrderDetail } from '../types/order';
import type { MainStackParamList } from './HomeScreen';
import { showError } from '../utils';
import { getAuthToken } from '../utils/authToken';

type Nav = StackNavigationProp<MainStackParamList, 'OrderDetail'>;
type Route = RouteProp<MainStackParamList, 'OrderDetail'>;

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

export default function OrderDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const token = useSelector((state: RootState) => getAuthToken(state));
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchOrder(token, route.params.orderId);
      setOrder(data);
    } catch (err: unknown) {
      showError(
        'Order',
        err instanceof Error ? err.message : 'Could not load order.',
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [route.params.orderId, token]);

  React.useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Order Details</Text>
        <View style={styles.topSpacer} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brandOrange} />
        </View>
      ) : !order ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Order not found.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        >
          <View style={styles.card}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.meta}>{formatDate(order.orderDate)}</Text>
            <Text style={styles.status}>
              {order.status}
              {order.paymentMethod ? ` · ${order.paymentMethod}` : ''}
            </Text>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>

          <Text style={styles.section}>Customer</Text>
          <View style={styles.card}>
            <Text style={styles.line}>{order.customerName}</Text>
            <Text style={styles.lineMuted}>{order.customerEmail}</Text>
            <Text style={styles.lineMuted}>{order.customerPhone}</Text>
          </View>

          <Text style={styles.section}>Items</Text>
          {order.items.map((item, index) => (
            <View key={`${item.productId}-${index}`} style={styles.itemCard}>
              <View style={styles.itemRow}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                ) : (
                  <View style={styles.thumbPlaceholder}>
                    <Text style={styles.thumbPlaceholderText}>—</Text>
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>
                    {item.quantity} × {formatPrice(item.price)}
                  </Text>
                  <Text style={styles.itemSubtotal}>{formatPrice(item.subtotal)}</Text>
                </View>
              </View>
            </View>
          ))}
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
  emptyText: { textAlign: 'center', color: colors.textMuted },
  content: { padding: 16 },
  section: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.brandBrown,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  orderNumber: { fontSize: 18, fontWeight: '900', color: colors.title },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  status: { fontSize: 14, fontWeight: '700', color: colors.brandBrown, marginTop: 8 },
  totalLabel: { fontSize: 13, color: colors.textMuted, marginTop: 12 },
  totalValue: { fontSize: 22, fontWeight: '900', color: colors.price },
  line: { fontSize: 15, fontWeight: '700', color: colors.title },
  lineMuted: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    marginBottom: 10,
  },
  itemRow: { flexDirection: 'row', gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  thumbPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.mediaBgStart,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholderText: { color: colors.textMuted },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '800', fontSize: 15, color: colors.title },
  itemQty: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  itemSubtotal: { fontSize: 14, fontWeight: '800', color: colors.price, marginTop: 4 },
});
