import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/agrinest';
import type { ProductItem } from '../../types/product';

type ProductCardProps = {
  product: ProductItem;
  onAddToCart?: (productId: number) => Promise<void>;
};

function formatPrice(price: number | null): string {
  if (price === null) {
    return '—';
  }
  return `₱${price.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inStock = product.quantity > 0;
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!onAddToCart || !inStock || adding) {
      return;
    }
    setAdding(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.noImage}>No Image</Text>
        )}
      </View>

      <View style={styles.body}>
        {product.category ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.category}</Text>
          </View>
        ) : null}

        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        <View
          style={[
            styles.stockBadge,
            inStock ? styles.stockOk : styles.stockOut,
          ]}
        >
          <Text
            style={[
              styles.stockText,
              inStock ? styles.stockOkText : styles.stockOutText,
            ]}
          >
            {inStock
              ? `${product.quantity} in stock`
              : 'Out of stock'}
          </Text>
        </View>

        {onAddToCart ? (
          <TouchableOpacity
            style={[
              styles.addButton,
              (!inStock || adding) && styles.addButtonDisabled,
            ]}
            onPress={handleAdd}
            disabled={!inStock || adding}
          >
            {adding ? (
              <ActivityIndicator color="#1a1308" size="small" />
            ) : (
              <Text style={styles.addButtonText}>
                {inStock ? 'Add to Cart' : 'Unavailable'}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: colors.brandOrange,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  media: {
    height: 150,
    backgroundColor: colors.mediaBgStart,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    color: '#888',
    fontWeight: '600',
  },
  body: {
    padding: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    backgroundColor: colors.badgeBg,
    marginBottom: 8,
  },
  badgeText: {
    color: colors.brandBrown,
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.title,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.price,
    marginBottom: 8,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  stockOk: {
    backgroundColor: colors.stockOkBg,
  },
  stockOut: {
    backgroundColor: colors.stockOutBg,
  },
  stockText: {
    fontWeight: '700',
    fontSize: 12,
  },
  stockOkText: {
    color: colors.stockOkText,
  },
  stockOutText: {
    color: colors.stockOutText,
  },
  addButton: {
    backgroundColor: colors.gradientOrangeStart,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#e8e8e8',
  },
  addButtonText: {
    color: '#1a1308',
    fontWeight: '800',
    fontSize: 13,
  },
});
