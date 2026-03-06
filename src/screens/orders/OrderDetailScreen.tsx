import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemeStore } from '../../store/themeStore';
import { useOrder } from '../../hooks/useOrders';
import OrderTimeline from '../../components/orders/OrderTimeline';
import StatusPill from '../../components/common/StatusPill';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { OrderDetailScreenProps } from '../../navigation/types';
import type { OrderStatus } from '../../types';

function formatCurrency(n: number) {
  return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const STATUS_BANNER: Record<string, { icon: string; message: string; color: string }> = {
  'en-route': { icon: 'local-shipping', message: 'Your order is on its way!', color: Colors.success },
  delivered: { icon: 'check-circle', message: 'Delivered successfully', color: Colors.success },
  pickup: { icon: 'store', message: 'Ready for pickup', color: Colors.status.pickup },
  dispatched: { icon: 'inventory', message: 'Order has been dispatched', color: Colors.info },
  scheduled: { icon: 'schedule', message: 'Delivery is scheduled', color: Colors.warning },
  processing: { icon: 'hourglass-empty', message: 'Order is being processed', color: Colors.status.processing },
  cancelled: { icon: 'cancel', message: 'Order has been cancelled', color: Colors.error },
};

function buildTimelineSteps(status: OrderStatus, events: { timestamp: string; status: OrderStatus; description: string }[]) {
  const ORDER_FLOW: { status: OrderStatus; label: string }[] = [
    { status: 'processing', label: 'Order Placed' },
    { status: 'scheduled', label: 'Scheduled' },
    { status: 'dispatched', label: 'Dispatched' },
    { status: 'en-route', label: 'En Route' },
    { status: 'delivered', label: 'Delivered' },
  ];

  const statusIndex = ORDER_FLOW.findIndex((s) => s.status === status);

  return ORDER_FLOW.map((step, i) => {
    const event = events.find((e) => e.status === step.status);
    let state: 'completed' | 'current' | 'pending';
    if (i < statusIndex) state = 'completed';
    else if (i === statusIndex) state = 'current';
    else state = 'pending';

    return {
      label: step.label,
      description: event?.description,
      timestamp: event
        ? new Date(event.timestamp).toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : undefined,
      state,
    };
  });
}

// Mock driver info for en-route orders
const MOCK_DRIVER = { name: 'Michael T.', phone: '0412 345 678' };

export default function OrderDetailScreen({ route, navigation }: OrderDetailScreenProps) {
  const { orderId } = route.params;
  const colors = useThemeStore((s) => s.colors)();

  const { data: order, isLoading, isError } = useOrder(orderId);

  const timelineSteps = useMemo(() => {
    if (!order) return [];
    return buildTimelineSteps(order.status, order.timeline ?? order.trackingEvents ?? []);
  }, [order]);

  const dateStr = useMemo(() => {
    if (!order) return '';
    return new Date(order.date).toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
          Could not load order
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

  const banner = STATUS_BANNER[order.status] ?? STATUS_BANNER.processing;
  const isEnRoute = order.status === 'en-route';
  const isDelivery = order.deliveryMethod === 'delivery';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 350 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View style={styles.bannerRow}>
              <View style={[styles.bannerIcon, { backgroundColor: banner.color + '20' }]}>
                <MaterialIcons name={banner.icon} size={28} color={banner.color} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={[Typography.h3, { color: colors.textPrimary }]}>{banner.message}</Text>
                <StatusPill status={order.status} size="md" />
              </View>
            </View>
          </Card>
        </MotiView>

        {/* Track Button */}
        {isEnRoute && (
          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300, delay: 100 }}
            style={{ marginTop: Spacing.md }}
          >
            <Button
              label="Track Delivery"
              onPress={() => navigation.navigate('TrackingScreen', { orderId: order.id })}
              variant="primary"
              size="lg"
              fullWidth
              icon={<MaterialIcons name="gps-fixed" size={20} color={Colors.white} />}
            />
          </MotiView>
        )}

        {/* Order Timeline */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 150 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>
              Order Timeline
            </Text>
            <OrderTimeline steps={timelineSteps} />
          </Card>
        </MotiView>

        {/* Items Section */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 220 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
              Items ({order.items.length})
            </Text>
            {order.items.map((item, i) => (
              <View
                key={item.productId + i}
                style={[styles.itemRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.body, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </Text>
                </View>
                <Text style={[Typography.h4, { color: colors.textPrimary }]}>
                  {formatCurrency(item.total)}
                </Text>
              </View>
            ))}
          </Card>
        </MotiView>

        {/* Pricing Breakdown */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 290 }}
          style={{ marginTop: Spacing.md }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <PricingRow label="Subtotal" value={formatCurrency(order.total)} colors={colors} />
            <PricingRow label="GST (10%)" value={formatCurrency(order.gst)} colors={colors} />
            <PricingRow
              label="Delivery"
              value={isDelivery ? '$20.00' : 'FREE'}
              colors={colors}
            />
            <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
            <View style={styles.pricingRow}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>Total (inc. GST)</Text>
              <Text style={[Typography.h3, { color: Colors.brand.blue }]}>
                {formatCurrency(order.total)}
              </Text>
            </View>
          </Card>
        </MotiView>

        {/* Delivery Details */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 360 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
              {isDelivery ? 'Delivery Details' : 'Pickup Details'}
            </Text>
            {isDelivery ? (
              <>
                <DetailRow icon="place" label="Address" value={order.deliveryAddress ?? '14 Kerr St, Parramatta NSW 2150'} colors={colors} />
                {isEnRoute && (
                  <>
                    <DetailRow icon="person" label="Driver" value={MOCK_DRIVER.name} colors={colors} />
                    <TouchableOpacity
                      style={styles.phoneRow}
                      onPress={() => Linking.openURL(`tel:${MOCK_DRIVER.phone.replace(/\s/g, '')}`)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="phone" size={16} color={Colors.info} />
                      <Text style={[Typography.body, { color: Colors.info, marginLeft: Spacing.sm }]}>
                        {MOCK_DRIVER.phone}
                      </Text>
                    </TouchableOpacity>
                    {order.estimatedDelivery && (
                      <DetailRow icon="schedule" label="ETA" value={order.estimatedDelivery} colors={colors} />
                    )}
                  </>
                )}
              </>
            ) : (
              <DetailRow icon="store" label="Branch" value={order.branchId ?? 'Parramatta'} colors={colors} />
            )}
          </Card>
        </MotiView>

        {/* Order Info */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 430 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
              Order Information
            </Text>
            <DetailRow icon="label" label="Order Number" value={order.orderNumber} colors={colors} />
            <DetailRow icon="calendar-today" label="Placed" value={dateStr} colors={colors} />
          </Card>
        </MotiView>

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </View>
  );
}

function PricingRow({ label, value, colors }: { label: string; value: string; colors: { textPrimary: string; textSecondary: string } }) {
  return (
    <View style={styles.pricingRow}>
      <Text style={[Typography.body, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[Typography.body, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: string; label: string; value: string; colors: { textPrimary: string; textSecondary: string } }) {
  return (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={16} color={colors.textSecondary} />
      <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
        <Text style={[Typography.caption, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[Typography.body, { color: colors.textPrimary }]}>{value}</Text>
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
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceDivider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm + 16,
  },
});
