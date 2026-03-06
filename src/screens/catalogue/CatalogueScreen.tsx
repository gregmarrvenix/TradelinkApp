import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MotiView } from 'moti';
import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import ProductCard from '../../components/product/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import type { CatalogueScreenProps } from '../../navigation/types';
import type { Product } from '../../types';

export default function CatalogueScreen({ navigation }: CatalogueScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const addItem = useCartStore((s) => s.addItem);
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: products, isLoading: prodLoading } = useProducts();

  const popularProducts = (products ?? []).slice(0, 4);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  }, [navigation]);

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product);
  }, [addItem]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { paddingTop: useSafeAreaInsets().top + Spacing.md }]}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>Shop</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search bar (touchable, navigates to SearchResults) */}
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: Colors.white, borderColor: colors.border }]}
          onPress={() => navigation.navigate('SearchResults', {})}
          activeOpacity={0.7}
        >
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <Text style={[Typography.bodyLg, { color: colors.textTertiary, flex: 1, marginLeft: Spacing.sm }]}>
            Search 77,000+ products...
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('BarcodeScan')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.scanBtn, { borderLeftColor: colors.border }]}
          >
            <MaterialIcons name="qr-code-scanner" size={22} color={Colors.brand.blue} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Categories Grid */}
        <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: Spacing.xxl, marginBottom: Spacing.md }]}>
          Categories
        </Text>

        {catLoading ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : (
          <View style={styles.categoriesGrid}>
            {(categories ?? []).map((cat, index) => (
              <MotiView
                key={cat.id}
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 350, delay: index * 80 }}
                style={styles.categoryCardWrapper}
              >
                <TouchableOpacity
                  style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => navigation.navigate('SearchResults', { category: cat.name })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: colors.surface2 }]}>
                    <MaterialIcons name={cat.icon as string} size={28} color={Colors.brand.blue} />
                  </View>
                  <Text style={[Typography.h4, { color: colors.textPrimary, marginTop: Spacing.sm }]} numberOfLines={1}>
                    {cat.name}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {cat.productCount} products
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        )}

        {/* Popular Products */}
        <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: Spacing.xxl, marginBottom: Spacing.md }]}>
          Popular Products
        </Text>

        {prodLoading ? (
          <LoadingSkeleton variant="productCard" count={2} />
        ) : (
          <FlatList
            data={popularProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: Spacing.sm }}
            renderItem={({ item, index }) => (
              <MotiView
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 350, delay: index * 100 }}
                style={{ width: 170 }}
              >
                <ProductCard
                  product={item}
                  layout="grid"
                  onPress={() => handleProductPress(item)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              </MotiView>
            )}
          />
        )}

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
  },
  scanBtn: {
    padding: 4,
    marginLeft: Spacing.sm,
    borderLeftWidth: 1,
    paddingLeft: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryCardWrapper: {
    width: '48%',
  },
  categoryCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
