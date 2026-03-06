import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemeStore } from '../../store/themeStore';
import { useOrder } from '../../hooks/useOrders';
import TrackingMap from '../../components/orders/TrackingMap';
import OrderTimeline from '../../components/orders/OrderTimeline';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { OrdersTrackingScreenProps } from '../../navigation/types';
import type { OrderStatus } from '../../types';

const MOCK_DRIVER = { name: 'Michael T.', phone: '0412 345 678' };
const MOCK_ETA = '10:30am Today';

function buildCompactTimeline(status: OrderStatus) {
  const steps: { label: string; state: 'completed' | 'current' | 'pending' }[] = [];
  const flow: { status: OrderStatus; label: string }[] = [
    { status: 'dispatched', label: 'Dispatched' },
    { status: 'en-route', label: 'En Route' },
    { status: 'delivered', label: 'Delivered' },
  ];

  const idx = flow.findIndex((s) => s.status === status);
  return flow.map((step, i) => ({
    label: step.label,
    state: i < idx ? ('completed' as const) : i === idx ? ('current' as const) : ('pending' as const),
  }));
}

export default function TrackingScreen({ route, navigation }: OrdersTrackingScreenProps) {
  const { orderId } = route.params;
  const colors = useThemeStore((s) => s.colors)();

  const { data: order, isLoading, isError } = useOrder(orderId);

  const compactTimeline = useMemo(() => {
    if (!order) return [];
    return buildCompactTimeline(order.status);
  }, [order]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={Colors.brand.blue} />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.error} />
        <Text style={[Typography.h3, { color: colors.textPrimary, marginTop: Spacing.md }]}>
          Could not load tracking info
        </Text>
        <Button
          label="Go Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          size="md"
          style={{ marginTop: Spacing.xl }}
        />
      </View>
    );
  }

  const destination = order.deliveryAddress ?? '14 Kerr St, Parramatta NSW 2150';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Map Area (top 60%) */}
      <View style={styles.mapArea}>
        <TrackingMap
          driverName={MOCK_DRIVER.name}
          eta={MOCK_ETA}
          destination={destination}
        />
        {/* ETA Overlay */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={[styles.etaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <MaterialIcons name="schedule" size={18} color={Colors.success} />
          <Text style={[Typography.h4, { color: colors.textPrimary, marginLeft: Spacing.sm }]}>
            ETA: {MOCK_ETA}
          </Text>
        </MotiView>
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          {/* Order subtitle */}
          <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.md }]}>
            Order {order.orderNumber}
          </Text>

          {/* Driver Info */}
          <View style={styles.driverRow}>
            <View style={[styles.driverAvatar, { backgroundColor: colors.surface2 }]}>
              <MaterialIcons name="person" size={24} color={colors.textSecondary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={[Typography.h4, { color: colors.textPrimary }]}>{MOCK_DRIVER.name}</Text>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Delivery Driver</Text>
            </View>
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: Colors.success + '20' }]}
              onPress={() => Linking.openURL(`tel:${MOCK_DRIVER.phone.replace(/\s/g, '')}`)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="phone" size={20} color={Colors.success} />
            </TouchableOpacity>
          </View>

          {/* Delivery Address */}
          <View style={styles.addressRow}>
            <MaterialIcons name="place" size={18} color={Colors.brand.blue} />
            <Text style={[Typography.body, { color: colors.textPrimary, marginLeft: Spacing.sm, flex: 1 }]}>
              {destination}
            </Text>
          </View>

          {/* Compact Timeline */}
          <View style={styles.timelineSection}>
            <OrderTimeline steps={compactTimeline} />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              label="Call Driver"
              onPress={() => Linking.openURL(`tel:${MOCK_DRIVER.phone.replace(/\s/g, '')}`)}
              variant="secondary"
              size="md"
              fullWidth
              icon={<MaterialIcons name="phone" size={18} color={colors.textPrimary} />}
            />
            <View style={{ height: Spacing.sm }} />
            <Button
              label="View Order Details"
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
              variant="ghost"
              size="md"
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
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
  mapArea: {
    flex: 6,
    position: 'relative',
  },
  etaCard: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.screen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    ...Shadows.md,
  },
  bottomSheet: {
    flex: 4,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    marginTop: -Radius.xl,
  },
  sheetContent: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.xl,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  timelineSection: {
    marginBottom: Spacing.md,
  },
  actions: {
    marginTop: Spacing.sm,
  },
});
