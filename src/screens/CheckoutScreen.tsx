import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { checkoutCart } from '../app/api/cart';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { useCart } from '../context/CartContext';
import type { RootState } from '../app/reducers';
import { colors } from '../theme/agrinest';
import type { MainStackParamList } from './HomeScreen';
import IMG from '../utils/images';
import { ROUTES, showError, showSuccess } from '../utils';
import { getAuthToken, getAuthUserEmail } from '../utils/authToken';

type CheckoutNav = StackNavigationProp<MainStackParamList, 'Checkout'>;

function formatPrice(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutNav>();
  const insets = useSafeAreaInsets();
  const token = useSelector((state: RootState) => getAuthToken(state));
  const defaultEmail = useSelector((state: RootState) =>
    getAuthUserEmail(state),
  );
  const { cart, refreshCart } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!token) {
      showError('Checkout', 'Please log in again.');
      return;
    }
    if (cart.items.length === 0) {
      showError('Checkout', 'Your cart is empty.');
      navigation.navigate(ROUTES.SHOP);
      return;
    }

    setSubmitting(true);
    try {
      const result = await checkoutCart(token, {
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
      });
      if (!result.success) {
        const msg =
          result.errors?.join('\n') ?? result.message ?? 'Checkout failed.';
        showError('Checkout', msg);
        return;
      }
      await refreshCart();
      showSuccess('Order placed', result.message, () => {
        navigation.navigate(ROUTES.SHOP);
      });
    } catch (err: unknown) {
      showError(
        'Checkout',
        err instanceof Error ? err.message : 'Could not place order.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
        <CustomButton
          label="Back to Shop"
          onPress={() => navigation.navigate(ROUTES.SHOP)}
        />
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
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.subtitle}>Complete your details to place your order.</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryHeading}>Order Summary</Text>
        {cart.items.map(item => (
          <View key={item.productId} style={styles.summaryRow}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.summaryPrice}>{formatPrice(item.subtotal)}</Text>
          </View>
        ))}
        <View style={styles.summaryTotalRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>{formatPrice(cart.total)}</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formHeading}>Customer Details</Text>
        <CustomTextInput label="Full Name" value={name} onChangeText={setName} />
        <CustomTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <CustomButton
          label="Place Order"
          onPress={handlePlaceOrder}
          loading={submitting}
          containerStyle={styles.submitBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.textMuted,
    fontSize: 16,
  },
  logo: { width: 90, height: 58, alignSelf: 'center', marginBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.brandBrown,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 16,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  summaryHeading: {
    fontWeight: '800',
    fontSize: 16,
    color: colors.title,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  summaryName: { flex: 1, color: colors.text, fontSize: 14 },
  summaryPrice: { fontWeight: '700', color: colors.price },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  summaryTotalLabel: { fontWeight: '800', fontSize: 16 },
  summaryTotalValue: { fontWeight: '900', fontSize: 18, color: colors.price },
  formCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
  },
  formHeading: {
    fontWeight: '800',
    fontSize: 16,
    color: colors.title,
    marginBottom: 8,
  },
  submitBtn: { marginTop: 8 },
});
