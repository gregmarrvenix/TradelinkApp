import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { SavedList } from '../../types';

interface Props {
  list: SavedList;
  onPress: () => void;
}

function formatCurrency(n: number) {
  return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function ListCard({ list, onPress }: Props) {
  const estimatedTotal = list.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const dateStr = new Date(list.updatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconBox}>
        <MaterialIcons name="list-alt" size={24} color={Colors.brand.blue} />
      </View>
      <View style={styles.content}>
        <Text style={[Typography.h4, styles.name]}>{list.name}</Text>
        <Text style={[Typography.caption, styles.meta]}>
          {list.itemCount} item{list.itemCount !== 1 ? 's' : ''} | Est. {formatCurrency(estimatedTotal)}
        </Text>
        <Text style={[Typography.caption, styles.date]}>Updated {dateStr}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.text.tertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.borderFaint,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brand.blueFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: { flex: 1 },
  name: { color: Colors.text.primary },
  meta: { color: Colors.text.secondary, marginTop: 2 },
  date: { color: Colors.text.tertiary, marginTop: 2 },
});
