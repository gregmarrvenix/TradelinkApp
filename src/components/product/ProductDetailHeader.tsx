import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import PriceTag from '../common/PriceTag';
import StockBadge from './StockBadge';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export default function ProductDetailHeader({ product }: Props) {
  return (
    <View>
      <View style={styles.imageBox}>
        <MaterialIcons name="inventory-2" size={64} color={Colors.text.tertiary} />
      </View>
      <View style={styles.info}>
        <Text style={[Typography.overline, { color: Colors.brand.blue }]}>{product.brand}</Text>
        <Text style={[Typography.h1, styles.name]}>{product.name}</Text>
        <Text style={[Typography.caption, styles.sku]}>SKU: {product.sku}</Text>
        <View style={styles.priceRow}>
          <PriceTag tradePrice={product.price} rrp={product.rrp} size="lg" showSavings />
        </View>
        <View style={styles.stockRow}>
          <StockBadge status={product.stockStatus} qty={product.stockQty} />
          <Text style={[Typography.caption, styles.unit]}>per {product.unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    height: 220,
    backgroundColor: Colors.light.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.lg,
  },
  info: {
    paddingHorizontal: Spacing.screen,
  },
  name: {
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  sku: {
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  priceRow: {
    marginTop: Spacing.lg,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  unit: {
    color: Colors.text.tertiary,
  },
});
