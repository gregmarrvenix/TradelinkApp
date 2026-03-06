import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { triggerHaptic } from '../../utils/haptics';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useBranches } from '../../hooks/useBranches';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SuccessAnimation from '../../components/common/SuccessAnimation';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { CheckoutScreenProps, AccountStackParamList, BottomTabParamList } from '../../navigation/types';

type CheckoutNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<AccountStackParamList, 'Checkout'>,
  BottomTabNavigationProp<BottomTabParamList>
>;

function formatCurrency(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const nav = useNavigation<CheckoutNavProp>();
  const colors = useThemeStore((s) => s.colors)();

  const items = useCartStore((s) => s.items);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const selectedBranchId = useCartStore((s) => s.selectedBranchId);
  const jobReference = useCartStore((s) => s.jobReference);
  const subtotal = useCartStore((s) => s.subtotal);
  const gst = useCartStore((s) => s.gst);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);

  const { data: branches } = useBranches();
  const selectedBranch = branches?.find((b) => b.id === selectedBranchId);

  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('14 Kerr St, Parramatta NSW 2150');

  const handlePlaceOrder = useCallback(async () => {
    triggerHaptic('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setPlacing(true);

    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    setPlacing(false);
    setShowSuccess(true);

    setTimeout(() => {
      clearCart();
      nav.navigate('OrdersTab', { screen: 'Orders' });
      Toast.show({
        type: 'success',
        text1: 'Order placed successfully!',
        text2: 'You can track your order in the Orders tab',
        visibilityTime: 3000,
      });
    }, 2000);
  }, [clearCart, nav]);

  if (showSuccess) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <SuccessAnimation />
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 600 }}
        >
          <Text style={[Typography.h2, { color: colors.textPrimary, marginTop: Spacing.xl, textAlign: 'center' }]}>
            Order Placed!
          </Text>
          <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.sm, textAlign: 'center' }]}>
            Redirecting to your orders...
          </Text>
        </MotiView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Method Section */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name={deliveryMethod === 'delivery' ? 'local-shipping' : 'store'}
                size={20}
                color={Colors.brand.red}
              />
              <Text style={[Typography.h4, { color: colors.textPrimary, marginLeft: Spacing.sm }]}>
                {deliveryMethod === 'delivery' ? 'Delivery' : 'Click & Collect'}
              </Text>
            </View>
            {deliveryMethod === 'delivery' ? (
              <View style={styles.addressSection}>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>
                  Delivery Address
                </Text>
                <TextInput
                  style={[
                    styles.addressInput,
                    {
                      backgroundColor: colors.surface2,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                />
              </View>
            ) : (
              <View style={styles.branchDetails}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Pickup Branch</Text>
                <Text style={[Typography.body, { color: colors.textPrimary, marginTop: 2 }]}>
                  {selectedBranch?.name ?? 'No branch selected'}
                </Text>
                {selectedBranch && (
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {selectedBranch.address}
                  </Text>
                )}
              </View>
            )}
            {jobReference ? (
              <View style={{ marginTop: Spacing.md }}>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>Job Reference</Text>
                <Text style={[Typography.body, { color: colors.textPrimary, marginTop: 2 }]}>
                  {jobReference}
                </Text>
              </View>
            ) : null}
          </Card>
        </MotiView>

        {/* Items Summary */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 80 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.md }}>
            <TouchableOpacity
              style={styles.itemsHeader}
              onPress={() => setItemsExpanded(!itemsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={[Typography.h4, { color: colors.textPrimary }]}>
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Text>
              <MaterialIcons
                name={itemsExpanded ? 'expand-less' : 'expand-more'}
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            {itemsExpanded &&
              items.map((item) => (
                <View key={item.productId} style={[styles.itemRow, { borderTopColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.body, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                      Qty: {item.quantity} x {formatCurrency(item.product.price)}
                    </Text>
                  </View>
                  <Text style={[Typography.h4, { color: colors.textPrimary }]}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </Text>
                </View>
              ))}
          </Card>
        </MotiView>

        {/* Pricing */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 160 }}
          style={{ marginTop: Spacing.md }}
        >
          <CartSummary subtotal={subtotal} gst={gst} deliveryFee={deliveryFee} total={total} />
        </MotiView>

        {/* Payment Info */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300, delay: 240 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginTop: Spacing.md }}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="credit-card" size={20} color={Colors.brand.red} />
              <Text style={[Typography.h4, { color: colors.textPrimary, marginLeft: Spacing.sm }]}>
                Payment
              </Text>
            </View>
            <Text style={[Typography.body, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
              Account: TL-88421 — Credit
            </Text>
            <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              Remaining credit: {formatCurrency(25000 - 8432.5)}
            </Text>
          </Card>
        </MotiView>

        {/* Terms */}
        <Text
          style={[
            Typography.caption,
            { color: colors.textTertiary, textAlign: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md },
          ]}
        >
          By placing this order you agree to Tradelink's Terms of Trade
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <Button
          label="Place Order"
          onPress={handlePlaceOrder}
          variant="primary"
          size="lg"
          fullWidth
          loading={placing}
          disabled={items.length === 0}
        />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressSection: {
    marginTop: Spacing.md,
  },
  addressInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    minHeight: 48,
  },
  branchDetails: {
    marginTop: Spacing.md,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
    borderTopWidth: 1,
  },
});
