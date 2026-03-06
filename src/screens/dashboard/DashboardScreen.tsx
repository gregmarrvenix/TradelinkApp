import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useThemeStore } from '../../store/themeStore';
import { useUser } from '../../hooks/useUser';
import { useOrders } from '../../hooks/useOrders';
import { usePromotions } from '../../hooks/usePromotions';
import { useNotifications } from '../../hooks/useNotifications';
import ActiveDeliveryCard from '../../components/dashboard/ActiveDeliveryCard';
import QuickActionGrid from '../../components/dashboard/QuickActionGrid';
import RecentOrderRow from '../../components/dashboard/RecentOrderRow';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import SearchBar from '../../components/common/SearchBar';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { DashboardScreenProps } from '../../navigation/types';
import type {
  HomeStackParamList,
  BottomTabParamList,
} from '../../navigation/types';

type DashboardNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>,
  BottomTabNavigationProp<BottomTabParamList>
>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROMO_CARD_WIDTH = SCREEN_WIDTH - Spacing.screen * 2 - 32;
const PROMO_SNAP_INTERVAL = PROMO_CARD_WIDTH + Spacing.md;

function AnimatedSection({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 80 }}
    >
      {children}
    </MotiView>
  );
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const nav = useNavigation<DashboardNavProp>();
  const colors = useThemeStore((s) => s.colors)();
  const isDark = useThemeStore((s) => s.isDark)();

  const { data: user, isLoading: userLoading, refetch: refetchUser } = useUser();
  const { data: orders, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useOrders();
  const { data: promotions, isLoading: promosLoading, refetch: refetchPromos } = usePromotions();
  const { data: notifications, refetch: refetchNotifications } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promosExpanded, setPromosExpanded] = useState(() => {
    try { return localStorage.getItem('promos_expanded') !== 'false'; } catch { return true; }
  });
  const togglePromos = useCallback(() => {
    setPromosExpanded((v) => {
      const next = !v;
      try { localStorage.setItem('promos_expanded', String(next)); } catch {}
      return next;
    });
  }, []);

  const isLoading = userLoading || ordersLoading || promosLoading;
  const isError = ordersError;

  const unreadCount = useMemo(
    () => notifications?.filter((n) => !n.read).length ?? 0,
    [notifications],
  );

  const activeDelivery = useMemo(
    () => orders?.find((o) => o.status === 'en-route' || o.status === 'enroute'),
    [orders],
  );

  const recentOrders = useMemo(
    () => orders?.slice(0, 3) ?? [],
    [orders],
  );

  const firstName = useMemo(() => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchUser(), refetchOrders(), refetchPromos(), refetchNotifications()]);
    setRefreshing(false);
  }, [refetchUser, refetchOrders, refetchPromos, refetchNotifications]);

  const quickActions = useMemo(
    () => [
      {
        icon: 'add-shopping-cart',
        label: 'New Order',
        color: Colors.brand.accent,
        onPress: () => nav.navigate('CatalogueTab', { screen: 'Catalogue' }),
      },
      {
        icon: 'qr-code-scanner',
        label: 'Scan',
        color: Colors.brand.blueLight,
        onPress: () => navigation.navigate('BarcodeScan'),
      },
      {
        icon: 'list-alt',
        label: 'My Lists',
        color: Colors.brand.blue,
        onPress: () => nav.navigate('AccountTab', { screen: 'Lists' }),
      },
      {
        icon: 'request-quote',
        label: 'Quotes',
        color: Colors.brand.blueDark,
        onPress: () => nav.navigate('AccountTab', { screen: 'Quotes' }),
      },
      {
        icon: 'receipt-long',
        label: 'Invoices',
        color: Colors.brand.blueLight,
        onPress: () => nav.navigate('AccountTab', { screen: 'Invoices' }),
      },
      {
        icon: 'store',
        label: 'Branches',
        color: Colors.brand.blue,
        onPress: () => nav.navigate('AccountTab', { screen: 'BranchFinder' }),
      },
    ],
    [nav, navigation],
  );

  const onPromoScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / PROMO_SNAP_INTERVAL);
      setPromoIndex(idx);
    },
    [],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.content}>
          <LoadingSkeleton variant="card" count={3} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.error} />
        <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: Spacing.md }]}>
          Something went wrong
        </Text>
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
          Could not load dashboard data
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={onRefresh}
          activeOpacity={0.8}
        >
          <Text style={[Typography.label, { color: Colors.white }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand.blue}
            colors={[Colors.brand.blue]}
          />
        }
      >
        {/* Header */}
        <AnimatedSection index={0}>
          <View style={styles.header}>
            <Text style={[Typography.h1, { color: colors.textPrimary }]}>
              G'day, {firstName}
            </Text>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="notifications"
                size={26}
                color={colors.textPrimary}
              />
              <View style={styles.badgePos}>
                <Badge count={unreadCount} />
              </View>
            </TouchableOpacity>
          </View>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection index={1}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => nav.navigate('CatalogueTab', { screen: 'Catalogue' })}
            style={styles.searchWrap}
          >
            <View pointerEvents="none">
              <SearchBar
                value=""
                onChangeText={() => {}}
                onScanPress={() => navigation.navigate('BarcodeScan')}
              />
            </View>
          </TouchableOpacity>
        </AnimatedSection>

        {/* Active Delivery */}
        {activeDelivery && (
          <AnimatedSection index={2}>
            <View style={styles.section}>
              <ActiveDeliveryCard
                orderNumber={activeDelivery.orderNumber}
                status={activeDelivery.status}
                eta={activeDelivery.eta ?? activeDelivery.estimatedDelivery}
                deliveryMethod={activeDelivery.deliveryMethod}
                onPress={() =>
                  navigation.navigate('TrackingScreen', { orderId: activeDelivery.id })
                }
                onTrack={() =>
                  navigation.navigate('TrackingScreen', { orderId: activeDelivery.id })
                }
              />
            </View>
          </AnimatedSection>
        )}

        {/* Quick Actions */}
        <AnimatedSection index={3}>
          <View style={styles.section}>
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <QuickActionGrid actions={quickActions} />
            </Card>
          </View>
        </AnimatedSection>

        {/* Promotions Accordion */}
        {promotions && promotions.length > 0 && (
          <AnimatedSection index={4}>
            <View style={styles.section}>
              <TouchableOpacity
                onPress={togglePromos}
                activeOpacity={0.7}
                style={styles.sectionHeader}
              >
                <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                  Promotions
                </Text>
                <MaterialIcons
                  name={promosExpanded ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              {promosExpanded && (
                <>
                  <FlatList
                    data={promotions}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={PROMO_SNAP_INTERVAL}
                    decelerationRate="fast"
                    onScroll={onPromoScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingRight: Spacing.screen }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          styles.promoCard,
                          { backgroundColor: Colors.brand.blue },
                        ]}
                      >
                        <Text style={[Typography.h3, { color: Colors.white }]}>
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            Typography.body,
                            { color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
                          ]}
                        >
                          {item.subtitle ?? item.description}
                        </Text>
                        <TouchableOpacity
                          style={styles.promoCta}
                          activeOpacity={0.8}
                          onPress={() =>
                            nav.navigate('CatalogueTab', { screen: 'Catalogue' })
                          }
                        >
                          <Text style={[Typography.label, { color: Colors.brand.blue }]}>
                            Shop Now
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {promotions.length > 1 && (
                    <View style={styles.dots}>
                      {promotions.map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.dot,
                            {
                              backgroundColor:
                                i === promoIndex ? Colors.brand.blue : colors.border,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          </AnimatedSection>
        )}

        {/* Recent Orders */}
        <AnimatedSection index={5}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>
                Recent Orders
              </Text>
              <TouchableOpacity
                onPress={() => nav.navigate('OrdersTab', { screen: 'Orders' })}
                activeOpacity={0.7}
              >
                <Text style={[Typography.label, { color: Colors.brand.blueLight }]}>
                  View All &rarr;
                </Text>
              </TouchableOpacity>
            </View>
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <RecentOrderRow
                    key={order.id}
                    order={order}
                    onPress={() =>
                      nav.navigate('OrdersTab', {
                        screen: 'OrderDetail',
                        params: { orderId: order.id },
                      })
                    }
                  />
                ))
              ) : (
                <View style={styles.emptyOrders}>
                  <Text style={[Typography.body, { color: colors.textSecondary }]}>
                    No recent orders
                  </Text>
                </View>
              )}
            </Card>
          </View>
        </AnimatedSection>

        {/* Account Summary */}
        <AnimatedSection index={6}>
          <View style={styles.section}>
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <Text style={[Typography.label, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
                Account: {user?.accountNumber ?? 'TL-88421'}
              </Text>
              <Text style={[Typography.h4, { color: colors.textPrimary }]}>
                Balance: $8,432.50 / $25,000.00
              </Text>
              <View style={styles.progressWrap}>
                <Progress.Bar
                  progress={8432.5 / 25000}
                  width={null}
                  height={8}
                  borderRadius={4}
                  color={Colors.brand.blue}
                  unfilledColor={colors.surface2}
                  borderWidth={0}
                />
              </View>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                {((8432.5 / 25000) * 100).toFixed(0)}% credit used
              </Text>
            </Card>
          </View>
        </AnimatedSection>

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bellBtn: {
    position: 'relative',
    padding: Spacing.xs,
  },
  badgePos: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  searchWrap: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  promoCard: {
    width: PROMO_CARD_WIDTH,
    minHeight: 160,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginRight: Spacing.md,
    justifyContent: 'space-between',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  promoCta: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    marginTop: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  retryBtn: {
    backgroundColor: Colors.brand.blue,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.xl,
  },
  emptyOrders: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  progressWrap: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
});
