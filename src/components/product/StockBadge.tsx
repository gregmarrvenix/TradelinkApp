import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface Props {
  status: string;
  qty?: number;
}

export default function StockBadge({ status, qty }: Props) {
  const cfg = {
    'In Stock': { color: Colors.success, label: qty !== undefined ? `${qty} in stock` : 'In Stock' },
    'in-stock': { color: Colors.success, label: qty !== undefined ? `${qty} in stock` : 'In Stock' },
    'Low Stock': { color: Colors.warning, label: qty !== undefined ? `Only ${qty} left` : 'Low Stock' },
    'low-stock': { color: Colors.warning, label: qty !== undefined ? `Only ${qty} left` : 'Low Stock' },
    'Out of Stock': { color: Colors.error, label: 'Out of Stock' },
    'out-of-stock': { color: Colors.error, label: 'Out of Stock' },
    'special-order': { color: Colors.info, label: 'Special Order' },
    unknown: { color: Colors.text.tertiary, label: '\u2014' },
  }[status] ?? { color: Colors.text.tertiary, label: status };

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text style={[Typography.caption, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
