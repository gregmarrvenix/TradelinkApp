import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeStore } from '../../store/themeStore';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/orders/OrderCard';
import Chip from '../../components/common/Chip';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import type { OrdersScreenProps, OrdersStackParamList } from '../../navigation/types';
import type { Order, OrderStatus } from '../../types';

type FilterKey = 'all' | 'active' | 'completed' | 'cancelled';

const ACTIVE_STATUSES: OrderStatus[] = ['en-route', 'dispatched', 'scheduled', 'processing'];
const COMPLETED_STATUSES: OrderStatus[] = ['delivered'];
const CANCELLED_STATUSES: OrderStatus[] = ['cancelled'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { data: orders, isLoading, refetch } = useOrders();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    switch (activeFilter) {
      case 'active':
        return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
      case 'completed':
        return orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
      case 'cancelled':
        return orders.filter((o) => CANCELLED_STATUSES.includes(o.status));
      default:
        return orders;
    }
  }, [orders, activeFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = useCallback(
    ({ item, index }: { item: Order; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300, delay: index * 60 }}
      >
        <OrderCard
          order={item}
          onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        />
        {item.status === 'en-route' && (
          <View style={styles.trackBtnWrap}>
            <Button
              label="Track"
              onPress={() => navigation.navigate('TrackingScreen', { orderId: item.id })}
              variant="outline"
              size="sm"
              icon={
                <View>
                  <Text style={{ color: Colors.brand.blue, fontSize: 14 }}>
                    {/* Icon handled by Button */}
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </MotiView>
    ),
    [navigation],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>Orders</Text>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTERS.map((filter) => (
            <Chip
              key={filter.key}
              label={filter.label}
              selected={activeFilter === filter.key}
              onPress={() => setActiveFilter(filter.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <LoadingSkeleton variant="card" count={4} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="receipt-long"
          title="No orders found"
          subtitle={
            activeFilter === 'all'
              ? 'Your orders will appear here'
              : `No ${activeFilter} orders`
          }
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.brand.blue}
              colors={[Colors.brand.blue]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  filterBar: {
    paddingBottom: Spacing.md,
  },
  filterContent: {
    paddingHorizontal: Spacing.screen,
    gap: Spacing.sm,
  },
  loadingWrap: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.huge,
  },
  trackBtnWrap: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg + Spacing.sm,
  },
});
