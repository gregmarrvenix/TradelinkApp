import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import PriceTag from '../common/PriceTag';
import StockBadge from './StockBadge';
import type { Product } from '../../types';

interface Props {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, onPress, onAddToCart, layout = 'list' }: Props) {
  const isInStock = product.stockStatus !== 'out-of-stock';

  if (layout === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.listImageBox}>
          <MaterialIcons name="inventory-2" size={32} color={Colors.text.tertiary} />
        </View>
        <View style={styles.listContent}>
          <Text style={[Typography.overline, { color: Colors.brand.blueLight }]}>{product.brand}</Text>
          <Text style={[Typography.h4, { color: Colors.text.primary, marginTop: 2 }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[Typography.caption, { color: Colors.text.secondary, marginTop: 2 }]}>
            SKU: {product.sku}
          </Text>
          <View style={styles.listBottom}>
            <PriceTag tradePrice={product.price} rrp={product.rrp} size="sm" />
            <StockBadge status={product.stockStatus} qty={product.stockQty} />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, !isInStock && styles.addBtnDisabled]}
          onPress={onAddToCart}
          disabled={!isInStock}
        >
          <MaterialIcons name="add-shopping-cart" size={20} color={isInStock ? Colors.white : Colors.text.tertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.gridImageBox}>
        <MaterialIcons name="inventory-2" size={40} color={Colors.text.tertiary} />
      </View>
      <View style={{ padding: Spacing.md }}>
        <Text style={[Typography.overline, { color: Colors.brand.blueLight }]}>{product.brand}</Text>
        <Text style={[Typography.body, { color: Colors.text.primary, marginTop: 4 }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={{ marginTop: Spacing.sm }}>
          <PriceTag tradePrice={product.price} size="sm" />
          <StockBadge status={product.stockStatus} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.borderFaint,
    ...Shadows.card,
  },
  listImageBox: {
    width: 80,
    backgroundColor: Colors.light.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { flex: 1, padding: Spacing.md },
  listBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  addBtn: {
    width: 48,
    backgroundColor: Colors.brand.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: Colors.light.surface3 },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.borderFaint,
    margin: 4,
    ...Shadows.card,
  },
  gridImageBox: {
    height: 100,
    backgroundColor: Colors.light.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
