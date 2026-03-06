import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MotiView } from 'moti';
import Toast from 'react-native-toast-message';
import { triggerHaptic } from '../../utils/haptics';
import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useProduct } from '../../hooks/useProducts';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import ProductDetailHeader from '../../components/product/ProductDetailHeader';
import BranchStockList from '../../components/product/BranchStockList';
import Chip from '../../components/common/Chip';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import type { CatalogueProductDetailScreenProps } from '../../navigation/types';

const MOCK_BRANCHES = [
  { branchId: 'b1', branchName: 'Alexandria', status: 'in-stock', qty: 45 },
  { branchId: 'b2', branchName: 'Penrith', status: 'in-stock', qty: 22 },
  { branchId: 'b3', branchName: 'Campbelltown', status: 'low-stock', qty: 3 },
  { branchId: 'b4', branchName: 'Blacktown', status: 'out-of-stock', qty: 0 },
  { branchId: 'b5', branchName: 'Newcastle', status: 'in-stock', qty: 18 },
];

export default function ProductDetailScreen({ navigation, route }: CatalogueProductDetailScreenProps) {
  const { productId } = route.params;
  const colors = useThemeStore((s) => s.colors)();
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const insets = useSafeAreaInsets();

  const { data: product, isLoading, isError } = useProduct(productId);
  const [qty, setQty] = useState(1);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product, qty);
    triggerHaptic('notificationSuccess');
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${qty}x ${product.name}`,
      visibilityTime: 2000,
    });
  }, [product, qty, addItem]);

  const handleShare = useCallback(async () => {
    if (!product) return;
    await Share.share({
      message: `Check out ${product.name} (SKU: ${product.sku}) - $${product.price.toFixed(2)}`,
    });
  }, [product]);

  const totalPrice = product ? qty * product.price : 0;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
        <View style={styles.loadingWrap}>
          <LoadingSkeleton variant="card" count={3} />
        </View>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.errorBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <EmptyState
          icon="error-outline"
          title="Product not found"
          subtitle="This product may no longer be available"
        />
      </View>
    );
  }

  const specs = Object.entries(product.specifications ?? {});
  const tags = [product.category, product.subCategory, product.brand].filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[Typography.overline, { color: Colors.brand.red }]}>{product.brand}</Text>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
          <MaterialIcons name="share" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <ProductDetailHeader product={product} />

          {/* SKU & Unit */}
          <View style={styles.section}>
            <Text style={[Typography.mono, { color: colors.textSecondary }]}>
              SKU: {product.sku}  |  Unit: {product.unit}
            </Text>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>
                Description
              </Text>
              <Text style={[Typography.body, { color: colors.textSecondary, lineHeight: 22 }]}>
                {product.description}
              </Text>
            </View>
          )}

          {/* Specifications table */}
          {specs.length > 0 && (
            <View style={styles.section}>
              <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
                Specifications
              </Text>
              {specs.map(([key, value], index) => (
                <View
                  key={key}
                  style={[
                    styles.specRow,
                    { backgroundColor: index % 2 === 0 ? colors.surface : colors.surface2 },
                  ]}
                >
                  <Text style={[Typography.bodySm, { color: colors.textSecondary, flex: 1 }]}>
                    {key}
                  </Text>
                  <Text style={[Typography.bodySm, { color: colors.textPrimary, flex: 1, textAlign: 'right' }]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Branch stock */}
          <View style={styles.section}>
            <BranchStockList
              branches={MOCK_BRANCHES}
              homeBranchId={user?.branchId ?? 'b1'}
            />
          </View>

          {/* Tags */}
          {tags.length > 0 && (
            <View style={[styles.section, styles.tagsRow]}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          )}

          <View style={{ height: 120 }} />
        </MotiView>
      </ScrollView>

      {/* Bottom fixed bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom || Spacing.lg }]}>
        {/* Qty selector */}
        <View style={styles.qtySelector}>
          <TouchableOpacity
            onPress={() => setQty((q) => Math.max(1, q - 1))}
            style={[styles.qtyBtn, { backgroundColor: colors.surface2 }]}
          >
            <MaterialIcons name="remove" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[Typography.h4, { color: colors.textPrimary, minWidth: 32, textAlign: 'center' }]}>
            {qty}
          </Text>
          <TouchableOpacity
            onPress={() => setQty((q) => Math.min(99, q + 1))}
            style={[styles.qtyBtn, { backgroundColor: colors.surface2 }]}
          >
            <MaterialIcons name="add" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Add to cart */}
        <TouchableOpacity
          style={[styles.addToCartBtn, Shadows.red]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add-shopping-cart" size={20} color={Colors.white} />
          <Text style={[Typography.h4, { color: Colors.white, marginLeft: Spacing.sm }]}>
            Add to Cart
          </Text>
          <Text style={[Typography.h4, { color: Colors.white, marginLeft: Spacing.sm }]}>
            ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.sm,
  },
  headerBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center' },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  section: {
    paddingHorizontal: Spacing.screen,
    marginTop: Spacing.xl,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.red,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  loadingWrap: {
    padding: Spacing.screen,
  },
  errorBack: {
    padding: Spacing.screen,
  },
});
