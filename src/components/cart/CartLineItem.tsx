import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { CartItem } from '../../types';

interface Props {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

function formatCurrency(n: number) {
  return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function CartLineItem({ item, onIncrement, onDecrement, onRemove }: Props) {
  const lineTotal = item.product.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <MaterialIcons name="inventory-2" size={28} color={Colors.text.tertiary} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameBox}>
            <Text style={[Typography.body, styles.name]} numberOfLines={2}>
              {item.product.name}
            </Text>
            <Text style={[Typography.caption, styles.sku]}>SKU: {item.product.sku}</Text>
          </View>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="delete-outline" size={20} color={Colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.qtyControls}>
            <TouchableOpacity
              onPress={onDecrement}
              style={styles.qtyBtn}
              disabled={item.quantity <= 1}
            >
              <MaterialIcons
                name="remove"
                size={16}
                color={item.quantity <= 1 ? Colors.text.tertiary : Colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={[Typography.h4, styles.qtyText]}>{item.quantity}</Text>
            <TouchableOpacity onPress={onIncrement} style={styles.qtyBtn}>
              <MaterialIcons name="add" size={16} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.priceCol}>
            <Text style={[Typography.caption, styles.unitPrice]}>
              {formatCurrency(item.product.price)} ea
            </Text>
            <Text style={[Typography.h4, { color: Colors.brand.blue }]}>
              {formatCurrency(lineTotal)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.borderFaint,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  imageBox: {
    width: 64,
    backgroundColor: Colors.light.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameBox: { flex: 1, marginRight: Spacing.sm },
  name: { color: Colors.text.primary },
  sku: { color: Colors.text.secondary, marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: Colors.text.primary,
    minWidth: 28,
    textAlign: 'center',
  },
  priceCol: { alignItems: 'flex-end' },
  unitPrice: { color: Colors.text.secondary },
});
