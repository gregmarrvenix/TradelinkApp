import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { triggerHaptic } from '../../utils/haptics';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useList } from '../../hooks/useLists';
import ListItemRow from '../../components/lists/ListItemRow';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { ListDetailScreenProps } from '../../navigation/types';
import type { CartItem } from '../../types';

function formatCurrency(n: number) {
  return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function ListDetailScreen({ route, navigation }: ListDetailScreenProps) {
  const { listId } = route.params;
  const colors = useThemeStore((s) => s.colors)();
  const { data: list, isLoading } = useList(listId);
  const addItem = useCartStore((s) => s.addItem);

  const estimatedTotal = list?.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  ) ?? 0;

  const handleAddAllToCart = useCallback(() => {
    if (!list) return;
    triggerHaptic('notificationSuccess');
    list.items.forEach((item) => addItem(item.product, item.quantity));
    Toast.show({ type: 'success', text1: 'Added to Cart', text2: `${list.items.length} items added` });
  }, [list, addItem]);

  const handleOrderAll = useCallback(() => {
    if (!list) return;
    triggerHaptic('notificationSuccess');
    list.items.forEach((item) => addItem(item.product, item.quantity));
    Toast.show({ type: 'success', text1: 'Added to Cart', text2: 'Redirecting to cart...' });
    navigation.navigate('Cart');
  }, [list, addItem, navigation]);

  const renderItem = useCallback(
    ({ item, index }: { item: CartItem; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateX: -12 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 300, delay: index * 50 }}
      >
        <ListItemRow item={item} />
      </MotiView>
    ),
    [],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.content}>
          <LoadingSkeleton variant="listItem" count={6} />
        </View>
      </View>
    );
  }

  if (!list) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <EmptyState icon="error-outline" title="List Not Found" subtitle="This list may have been deleted" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, flex: 1, marginHorizontal: Spacing.md }]} numberOfLines={1}>
          {list.name}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => Toast.show({ type: 'info', text1: 'Share', text2: 'Sharing coming soon' })}
        >
          <MaterialIcons name="share" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ marginLeft: Spacing.md }}
          onPress={() => Toast.show({ type: 'info', text1: 'Edit', text2: 'Editing coming soon' })}
        >
          <MaterialIcons name="edit" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.summaryItem}>
          <Text style={[Typography.label, { color: colors.textSecondary }]}>Items</Text>
          <Text style={[Typography.h3, { color: colors.textPrimary }]}>{list.itemCount}</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[Typography.label, { color: colors.textSecondary }]}>Est. Total</Text>
          <Text style={[Typography.h3, { color: Colors.brand.blue }]}>
            {formatCurrency(estimatedTotal)}
          </Text>
        </View>
      </View>

      <FlatList
        data={list.items}
        keyExtractor={(item) => item.productId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="playlist-add"
            title="Empty List"
            subtitle="Add products to this list from the catalogue"
          />
        }
      />

      {list.items.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Button
            label="Add All to Cart"
            variant="secondary"
            onPress={handleAddAllToCart}
            style={{ flex: 1 }}
            icon={<MaterialIcons name="add-shopping-cart" size={18} color={colors.textPrimary} />}
          />
          <View style={{ width: Spacing.md }} />
          <Button
            label="Order All"
            onPress={handleOrderAll}
            style={{ flex: 1 }}
            icon={<MaterialIcons name="shopping-cart" size={18} color={Colors.white} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  summaryBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.screen,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, marginHorizontal: Spacing.md },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    ...Shadows.md,
  },
});
