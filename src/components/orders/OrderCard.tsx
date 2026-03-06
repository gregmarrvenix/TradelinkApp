import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import StatusPill from '../common/StatusPill';
import type { Order } from '../../types';

interface Props {
  order: Order;
  onPress: () => void;
}

function formatCurrency(n: number) {
  return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function OrderCard({ order, onPress }: Props) {
  const itemCount = order.items.length;
  const dateStr = new Date(order.date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <View style={styles.orderInfo}>
          <Text style={[Typography.h4, styles.orderNumber]}>{order.orderNumber}</Text>
          <Text style={[Typography.caption, styles.date]}>{dateStr}</Text>
        </View>
        <StatusPill status={order.status} />
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.meta}>
          <MaterialIcons
            name={order.deliveryMethod === 'pickup' ? 'store' : 'local-shipping'}
            size={16}
            color={Colors.text.tertiary}
          />
          <Text style={[Typography.caption, styles.metaText]}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={[Typography.h4, { color: Colors.brand.blue }]}>
          {formatCurrency(order.total)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.borderFaint,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: { flex: 1 },
  orderNumber: { color: Colors.text.primary },
  date: { color: Colors.text.secondary, marginTop: 2 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: { color: Colors.text.secondary },
});
