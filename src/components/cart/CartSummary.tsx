import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

interface Props {
  subtotal: number;
  gst: number;
  deliveryFee: number;
  total: number;
}

function formatCurrency(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function SummaryRow({ label, value, bold, red }: { label: string; value: string; bold?: boolean; red?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[bold ? Typography.h4 : Typography.body, { color: Colors.text.secondary }]}>
        {label}
      </Text>
      <Text
        style={[
          bold ? Typography.h3 : Typography.body,
          { color: red ? Colors.brand.red : Colors.text.primary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function CartSummary({ subtotal, gst, deliveryFee, total }: Props) {
  return (
    <View style={styles.container}>
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
      <SummaryRow label="GST (10%)" value={formatCurrency(gst)} />
      <SummaryRow
        label="Delivery"
        value={deliveryFee > 0 ? formatCurrency(deliveryFee) : 'FREE'}
      />
      <View style={styles.divider} />
      <SummaryRow label="Total (inc. GST)" value={formatCurrency(total)} bold red />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: Spacing.xs,
  },
});
