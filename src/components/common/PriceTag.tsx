import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface Props {
  tradePrice: number;
  rrp?: number;
  size?: 'sm' | 'md' | 'lg';
  showSavings?: boolean;
}

function formatCurrency(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function PriceTag({ tradePrice, rrp, size = 'md', showSavings }: Props) {
  const savings = rrp ? rrp - tradePrice : 0;
  const savingsPct = rrp ? Math.round((savings / rrp) * 100) : 0;

  const priceStyle = {
    sm: Typography.priceSm,
    md: Typography.price,
    lg: Typography.priceLg,
  }[size];

  return (
    <View>
      <Text style={[priceStyle, { color: Colors.brand.red, fontWeight: '800' }]}>
        {formatCurrency(tradePrice)}
      </Text>
      {rrp != null && rrp > 0 && (
        <View style={styles.row}>
          <Text style={[Typography.caption, styles.rrp]}>RRP {formatCurrency(rrp)}</Text>
          {showSavings && savingsPct > 0 && (
            <View style={styles.savingsBadge}>
              <Text style={[Typography.overline, { color: Colors.success }]}>
                SAVE {savingsPct}%
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  rrp: { color: Colors.text.tertiary, textDecorationLine: 'line-through' },
  savingsBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
