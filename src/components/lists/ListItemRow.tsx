import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import type { CartItem } from '../../types';

interface Props {
  item: CartItem;
}

function formatCurrency(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function ListItemRow({ item }: Props) {
  const lineTotal = item.product.price * item.quantity;

  return (
    <View style={styles.row}>
      <View style={styles.imageBox}>
        <MaterialIcons name="inventory-2" size={20} color={Colors.text.tertiary} />
      </View>
      <View style={styles.content}>
        <Text style={[Typography.body, styles.name]} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={[Typography.caption, styles.sku]}>SKU: {item.product.sku}</Text>
      </View>
      <View style={styles.qtyCol}>
        <Text style={[Typography.caption, styles.qtyLabel]}>Qty</Text>
        <Text style={[Typography.h4, styles.qty]}>{item.quantity}</Text>
      </View>
      <View style={styles.priceCol}>
        <Text style={[Typography.h4, { color: Colors.brand.red }]}>
          {formatCurrency(lineTotal)}
        </Text>
        <Text style={[Typography.caption, styles.unitPrice]}>
          {formatCurrency(item.product.price)} ea
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderFaint,
  },
  imageBox: {
    width: 40,
    height: 40,
    backgroundColor: Colors.dark.surface2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: { flex: 1 },
  name: { color: Colors.text.primary },
  sku: { color: Colors.text.secondary, marginTop: 2 },
  qtyCol: { alignItems: 'center', marginHorizontal: Spacing.md },
  qtyLabel: { color: Colors.text.tertiary },
  qty: { color: Colors.text.primary },
  priceCol: { alignItems: 'flex-end', minWidth: 70 },
  unitPrice: { color: Colors.text.secondary, marginTop: 2 },
});
