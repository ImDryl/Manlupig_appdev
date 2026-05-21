import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/agrinest';
import type { CartLineItem } from '../types/cart';
import type { MainStackParamList } from './HomeScreen';
import IMG from '../utils/images';
import { ROUTES, showConfirm, showError, showSuccess } from '../utils';

type CartNav = StackNavigationProp<MainStackParamList, 'Cart'>;

function formatPrice(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function CartLine({
  item,
  onUpdateQty,
  onRemove,
  busy,
}: {
  item: CartLineItem;
  onUpdateQty: (productId: number, qty: number) => void;
  onRemove: (productId: number) => void;
  busy: boolean;
}) {
  const maxQty = item.quantity + item.availableStock;

  return (
    <View style={styles.lineCard}>
      <View style={styles.lineTop}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbPlaceholderText}>—</Text>
          </View>
        )}
        <View style={styles.lineInfo}>
          <Text style={styles.lineName}>{item.name}</Text>
          <Text style={styles.linePrice}>{formatPrice(item.price)} each</Text>
          <Text style={styles.lineSubtotal}>
            Subtotal: {formatPrice(item.subtotal)}
          </Text>
        </View>
      </View>

      <View style={styles.lineActions}>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            disabled={busy || item.quantity <= 1}
            onPress={() => onUpdateQty(item.productId, item.quantity - 1)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.qtyInput}
            keyboardType="number-pad"
            value={String(item.quantity)}
            editable={!busy}
            onSubmitEditing={e => {
              const next = parseInt(e.nativeEvent.text, 10);
              if (!Number.isNaN(next)) {
                onUpdateQty(item.productId, Math.min(maxQty, Math.max(0, next)));
              }
            }}
          />
          <TouchableOpacity
            style={styles.qtyBtn}
            disabled={busy || item.quantity >= maxQty}
            onPress={() => onUpdateQty(item.productId, item.quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          disabled={busy}
          onPress={() => onRemove(item.productId)}
        >
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const navigation = useNavigation<CartNav>();
  const insets = useSafeAreaInsets();
  const { cart, loading, refreshCart, updateQuantity, removeProduct, clearAll } =
    useCart();
  const [busyId, setBusyId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      void refreshCart();
    }, [refreshCart]),
  );

  const handleUpdate = async (productId: number, quantity: number) => {
    setBusyId(productId);
    try {
      await updateQuantity(productId, quantity);
    } catch (err: unknown) {
      showError(
        'Cart',
        err instanceof Error ? err.message : 'Could not update quantity.',
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = (productId: number) => {
    showConfirm('Remove item', 'Remove this product from your cart?', async () => {
      setBusyId(productId);
      try {
        await removeProduct(productId);
        showSuccess('Cart', 'Item removed.');
      } catch (err: unknown) {
        showError(
          'Cart',
          err instanceof Error ? err.message : 'Could not remove item.',
        );
      } finally {
        setBusyId(null);
      }
    });
  };

  const handleClear = () => {
    showConfirm('Clear cart', 'Return all reserved stock and empty your cart?', async () => {
      try {
        await clearAll();
        showSuccess('Cart', 'Cart cleared.');
      } catch (err: unknown) {
        showError(
          'Cart',
          err instanceof Error ? err.message : 'Could not clear cart.',
        );
      }
    });
  };

  if (loading && cart.items.length === 0) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.gradientOrangeStart} />
        <Text style={styles.loadingText}>Loading cart…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>My Cart</Text>
      <Text style={styles.subtitle}>
        Review your items, adjust quantities, and proceed to checkout.
      </Text>

      {cart.items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Your cart is empty.</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(ROUTES.SHOP)}
          >
            <Text style={styles.primaryBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cart.items.map(item => (
            <CartLine
              key={item.productId}
              item={item}
              busy={busyId === item.productId}
              onUpdateQty={handleUpdate}
              onRemove={handleRemove}
            />
          ))}

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(cart.total)}</Text>
            <Text style={styles.totalItems}>{cart.totalItems} item(s)</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate(ROUTES.CHECKOUT)}
          >
            <Text style={styles.primaryBtnText}>Proceed to Checkout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleClear}>
            <Text style={styles.secondaryBtnText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: { marginTop: 12, color: colors.textMuted },
  logo: { width: 100, height: 64, alignSelf: 'center', marginBottom: 10 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.brandBrown,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 18,
    lineHeight: 20,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 16,
  },
  lineCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  lineTop: { flexDirection: 'row', gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  thumbPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholderText: { color: '#9ca3af' },
  lineInfo: { flex: 1 },
  lineName: { fontWeight: '800', fontSize: 15, color: colors.title },
  linePrice: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  lineSubtotal: {
    color: colors.price,
    fontWeight: '800',
    marginTop: 6,
    fontSize: 14,
  },
  lineActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.badgeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: colors.brandBrown },
  qtyInput: {
    minWidth: 44,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingVertical: 4,
    fontWeight: '700',
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.stockOutBg,
  },
  removeBtnText: { color: colors.stockOutText, fontWeight: '700' },
  totalCard: {
    marginTop: 8,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.mediaBgStart,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  totalLabel: { fontSize: 14, color: colors.textMuted },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.price,
    marginTop: 4,
  },
  totalItems: { marginTop: 4, color: colors.brandBrown, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: colors.gradientOrangeStart,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { color: colors.brandBrown, fontWeight: '700' },
});
