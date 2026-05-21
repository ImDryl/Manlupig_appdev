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
import CustomButton from '../components/CustomButton';
import { colors } from '../theme/agrinest';
import { IMG, ROUTES } from '../utils';

export type MainStackParamList = {
  Shop: undefined;
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const TRUST_CARDS = [
  {
    title: '1,000+ Orders Served',
    text: 'Families, resellers, and farm partners choose AgriNest for reliable poultry supply.',
  },
  {
    title: 'Quality Checked Daily',
    text: 'Fresh handling, clear categories, and stock visibility for better buying decisions.',
  },
  {
    title: 'Supplier to Customer Flow',
    text: 'From listing to checkout, AgriNest helps connect sellers and buyers faster.',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.brandRow}>
        <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandTitle}>AgriNest</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome to AgriNest</Text>
        <Text style={styles.heroSubtitle}>
          Your trusted source for fresh eggs, healthy chicks, and poultry products
        </Text>
        <CustomButton
          label="Shop Now"
          onPress={() => navigation.navigate(ROUTES.SHOP)}
          containerStyle={styles.heroButton}
        />
      </View>

      <View style={styles.trustGrid}>
        {TRUST_CARDS.map(card => (
          <View key={card.title} style={styles.trustCard}>
            <Text style={styles.trustTitle}>{card.title}</Text>
            <Text style={styles.trustText}>{card.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <CustomButton
          label="Browse Products"
          onPress={() => navigation.navigate(ROUTES.SHOP)}
        />
        <TouchableOpacity
          style={styles.profileLink}
          onPress={() => navigation.navigate(ROUTES.PROFILE)}
        >
          <Text style={styles.profileLinkText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  brandRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 90,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.brandOrange,
  },
  hero: {
    backgroundColor: colors.mediaBgStart,
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.brandBrown,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 18,
  },
  heroButton: {
    marginTop: 4,
  },
  trustGrid: {
    gap: 12,
    marginBottom: 24,
  },
  trustCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.title,
    marginBottom: 6,
  },
  trustText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  profileLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileLinkText: {
    color: colors.brandBrown,
    fontWeight: '700',
    fontSize: 15,
  },
});
