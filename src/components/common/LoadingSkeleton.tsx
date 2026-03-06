import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';

type SkeletonVariant = 'card' | 'listItem' | 'productCard';

interface Props {
  variant: SkeletonVariant;
  count?: number;
}

function CardSkeleton() {
  return (
    <SkeletonPlaceholder
      backgroundColor={Colors.light.surface2}
      highlightColor={Colors.light.surface3}
    >
      <View style={skeletonStyles.card}>
        <View style={skeletonStyles.cardImage} />
        <View style={skeletonStyles.cardBody}>
          <View style={skeletonStyles.lineShort} />
          <View style={skeletonStyles.lineMedium} />
          <View style={skeletonStyles.lineLong} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}

function ListItemSkeleton() {
  return (
    <SkeletonPlaceholder
      backgroundColor={Colors.light.surface2}
      highlightColor={Colors.light.surface3}
    >
      <View style={skeletonStyles.listItem}>
        <View style={skeletonStyles.listAvatar} />
        <View style={skeletonStyles.listContent}>
          <View style={skeletonStyles.lineMedium} />
          <View style={skeletonStyles.lineShort} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}

function ProductCardSkeleton() {
  return (
    <SkeletonPlaceholder
      backgroundColor={Colors.light.surface2}
      highlightColor={Colors.light.surface3}
    >
      <View style={skeletonStyles.productCard}>
        <View style={skeletonStyles.productImage} />
        <View style={skeletonStyles.productBody}>
          <View style={skeletonStyles.lineShort} />
          <View style={skeletonStyles.lineMedium} />
          <View style={skeletonStyles.lineShort} />
          <View style={skeletonStyles.priceRow}>
            <View style={skeletonStyles.priceBox} />
            <View style={skeletonStyles.stockDot} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}

const VARIANT_MAP: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  listItem: ListItemSkeleton,
  productCard: ProductCardSkeleton,
};

export default function LoadingSkeleton({ variant, count = 1 }: Props) {
  const Component = VARIANT_MAP[variant];
  return (
    <View>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ marginBottom: Spacing.sm }}>
          <Component />
        </View>
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
    borderRadius: Radius.md,
  },
  cardBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  lineShort: { width: '40%', height: 12, borderRadius: 4 },
  lineMedium: { width: '70%', height: 14, borderRadius: 4 },
  lineLong: { width: '90%', height: 12, borderRadius: 4 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  listAvatar: { width: 44, height: 44, borderRadius: 22 },
  listContent: { flex: 1, gap: Spacing.sm },
  productCard: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  productImage: { width: 80, height: 90 },
  productBody: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  priceBox: { width: 60, height: 16, borderRadius: 4 },
  stockDot: { width: 50, height: 12, borderRadius: 4 },
});
