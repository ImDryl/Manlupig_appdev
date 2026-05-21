import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import type { RootState } from '../app/reducers';
import { resetLogin } from '../app/reducers/auth';
import { colors } from '../theme/agrinest';
import type { MainStackParamList } from './HomeScreen';
import IMG from '../utils/images';
import { ROUTES, showConfirm, showSuccess } from '../utils';
import { getAuthUser } from '../utils/authToken';
import { signOutGoogle } from '../utils/firebase';

type ProfileNav = StackNavigationProp<MainStackParamList, 'Profile'>;

type MenuItem = {
  key: string;
  label: string;
  hint: string;
  onPress: () => void;
  badge?: number;
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNav>();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { cart, clearAll } = useCart();
  const user = useSelector((state: RootState) => getAuthUser(state));

  const email = user?.email ?? 'Signed in';
  const initial = (email.charAt(0) || 'A').toUpperCase();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate(ROUTES.SHOP);
  };

  const handleLogout = () => {
    showConfirm(
      'Log Out',
      'Are you sure you want to log out?',
      async () => {
        try {
          await clearAll();
        } catch {
          // Ignore if cart already empty or token expired
        }
        await signOutGoogle();
        dispatch(resetLogin());
        showSuccess('Logged Out', 'You have been signed out successfully.');
      },
      { confirmText: 'Log Out', destructive: true },
    );
  };

  const menuItems: MenuItem[] = [
    {
      key: 'shop',
      label: 'Continue Shopping',
      hint: 'Browse products and add to cart',
      onPress: () => navigation.navigate(ROUTES.SHOP),
    },
    {
      key: 'cart',
      label: 'My Cart',
      hint:
        cart.totalItems > 0
          ? `${cart.totalItems} item(s) · ${formatTotal(cart.total)}`
          : 'Your cart is empty',
      onPress: () => navigation.navigate(ROUTES.CART),
      badge: cart.totalItems > 0 ? cart.totalItems : undefined,
    },
    {
      key: 'home',
      label: 'Home',
      hint: 'AgriNest welcome and overview',
      onPress: () => navigation.navigate(ROUTES.HOME),
    },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>My Profile</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileHeadings}>
              <Text style={styles.profileName} numberOfLines={1}>
                {email.split('@')[0]}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuRow,
                index < menuItems.length - 1 && styles.menuRowBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuTextWrap}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuHint}>{item.hint}</Text>
              </View>
              {item.badge ? (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              ) : (
                <Text style={styles.menuChevron}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

function formatTotal(total: number): string {
  return `₱${total.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default ProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
    paddingVertical: 6,
  },
  backIcon: {
    fontSize: 22,
    color: colors.brandBrown,
    fontWeight: '700',
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.brandBrown,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.title,
  },
  topSpacer: {
    minWidth: 72,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  logo: {
    width: 100,
    height: 64,
    alignSelf: 'center',
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    marginBottom: 20,
    shadowColor: colors.brandOrange,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.badgeBg,
    borderWidth: 2,
    borderColor: colors.badgeBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.brandBrown,
  },
  profileHeadings: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.title,
    textTransform: 'capitalize',
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.brandBrown,
    marginBottom: 10,
    marginLeft: 2,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  menuTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.title,
  },
  menuHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
  menuChevron: {
    fontSize: 22,
    color: colors.brandBrown,
    fontWeight: '700',
  },
  menuBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.price,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
