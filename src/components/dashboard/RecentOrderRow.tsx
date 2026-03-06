import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import StatusPill from '../common/StatusPill';
import type { Order } from '../../types';

interface Props {
  order: Order;
  onPress: () => void;
}

function formatCurrency(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function RecentOrderRow({ order, onPress }: Props) {
  const itemCount = order.items.length;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconBox}>
        <MaterialIcons
          name={order.deliveryMethod === 'pickup' ? 'store' : 'local-shipping'}
          size={20}
          color={Colors.brand.red}
        />
      </View>
      <View style={styles.content}>
        <Text style={[Typography.h4, styles.orderNumber]}>{order.orderNumber}</Text>
        <Text style={[Typography.caption, styles.meta]}>
          {itemCount} item{itemCount !== 1 ? 's' : ''} | {formatCurrency(order.grandTotal)}
        </Text>
      </View>
      <StatusPill status={order.status} />
    </TouchableOpacity>
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
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: { flex: 1, marginRight: Spacing.sm },
  orderNumber: { color: Colors.text.primary },
  meta: { color: Colors.text.secondary, marginTop: 2 },
});
