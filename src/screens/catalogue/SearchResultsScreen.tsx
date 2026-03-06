import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MotiView } from 'moti';
import Toast from 'react-native-toast-message';
import { triggerHaptic } from '../../utils/haptics';
import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import SearchBar from '../../components/common/SearchBar';
import Chip from '../../components/common/Chip';
import ProductCard from '../../components/product/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import type { SearchResultsScreenProps } from '../../navigation/types';
import type { Product } from '../../types';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'brand-az';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'price-asc', label: 'Price: Low \u2192 High' },
  { key: 'price-desc', label: 'Price: High \u2192 Low' },
  { key: 'brand-az', label: 'Brand: A \u2192 Z' },
];

export default function SearchResultsScreen({ navigation, route }: SearchResultsScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const addItem = useCartStore((s) => s.addItem);
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState(route.params?.query ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(route.params?.category);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');

  const { data: categories } = useCategories();
  const { data: products, isLoading, refetch, isRefetching } = useProducts(
    query || undefined,
    selectedCategory,
  );

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'brand-az':
        sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
    }
    return sorted;
  }, [products, sortBy]);

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product);
    triggerHaptic('impactMedium');
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${product.name} added`,
      visibilityTime: 2000,
    });
  }, [addItem]);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      {/* Header with search */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBarWrap}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onScanPress={() => navigation.navigate('BarcodeScan')}
            autoFocus
          />
        </View>
      </View>

      {/* Category filter chips */}
      <View style={styles.filterBar}>
        <FlatList
          data={[{ id: undefined, name: 'All' }, ...(categories ?? []).map((c) => ({ id: c.id, name: c.name }))]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id ?? 'all'}
          contentContainerStyle={{ paddingHorizontal: Spacing.screen, gap: Spacing.sm }}
          renderItem={({ item }) => (
            <Chip
              label={item.name}
              selected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
            />
          )}
        />
      </View>

      {/* Sort + Layout toggle */}
      <View style={styles.controlsRow}>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>
          {sortedProducts.length} products found
        </Text>
        <View style={styles.controlsRight}>
          <TouchableOpacity
            style={[styles.sortBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <MaterialIcons name="sort" size={16} color={colors.textSecondary} />
            <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLayoutMode(layoutMode === 'list' ? 'grid' : 'list')}
            style={styles.layoutBtn}
          >
            <MaterialIcons
              name={layoutMode === 'list' ? 'grid-view' : 'view-list'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort dropdown */}
      {showSortMenu && (
        <View style={[styles.sortMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortMenuItem, sortBy === opt.key && { backgroundColor: colors.surface2 }]}
              onPress={() => { setSortBy(opt.key); setShowSortMenu(false); }}
            >
              <Text style={[Typography.body, { color: sortBy === opt.key ? Colors.brand.red : colors.textPrimary }]}>
                {opt.label}
              </Text>
              {sortBy === opt.key && <MaterialIcons name="check" size={16} color={Colors.brand.red} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results list */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <LoadingSkeleton variant="productCard" count={6} />
        </View>
      ) : sortedProducts.length === 0 ? (
        <EmptyState
          icon="search-off"
          title="No products found"
          subtitle={query ? `No results for "${query}"` : 'Try adjusting your filters'}
        />
      ) : (
        <FlatList
          data={sortedProducts}
          key={layoutMode}
          numColumns={layoutMode === 'grid' ? 2 : 1}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: Spacing.screen, paddingBottom: Spacing.huge }}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: Math.min(index * 60, 600) }}
              style={layoutMode === 'grid' ? { flex: 1 } : undefined}
            >
              <ProductCard
                product={item}
                layout={layoutMode}
                onPress={() => handleProductPress(item)}
                onAddToCart={() => handleAddToCart(item)}
              />
            </MotiView>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: { padding: 4 },
  searchBarWrap: { flex: 1 },
  filterBar: { marginVertical: Spacing.sm },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.sm,
  },
  controlsRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  layoutBtn: { padding: 4 },
  sortMenu: {
    position: 'absolute',
    top: 140,
    right: Spacing.screen,
    zIndex: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  loadingWrap: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
});
