import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { triggerHaptic } from '../../utils/haptics';

import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useBranches } from '../../hooks/useBranches';
import CartLineItem from '../../components/cart/CartLineItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { CartScreenProps, AccountStackParamList, BottomTabParamList } from '../../navigation/types';
import type { CartItem } from '../../types';

type CartNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<AccountStackParamList, 'Cart'>,
  BottomTabNavigationProp<BottomTabParamList>
>;

export default function CartScreen({ navigation }: CartScreenProps) {
  const nav = useNavigation<CartNavProp>();
  const colors = useThemeStore((s) => s.colors)();
  const isDark = useThemeStore((s) => s.isDark)();

  const items = useCartStore((s) => s.items);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const selectedBranchId = useCartStore((s) => s.selectedBranchId);
  const jobReference = useCartStore((s) => s.jobReference);
  const subtotal = useCartStore((s) => s.subtotal);
  const gst = useCartStore((s) => s.gst);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const total = useCartStore((s) => s.total);
  const itemCount = useCartStore((s) => s.itemCount);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);
  const setSelectedBranch = useCartStore((s) => s.setSelectedBranch);
  const setJobReference = useCartStore((s) => s.setJobReference);

  const { data: branches } = useBranches();
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const haptic = useCallback(() => {
    triggerHaptic('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }, []);

  const handleIncrement = useCallback(
    (productId: string, currentQty: number) => {
      haptic();
      updateQuantity(productId, currentQty + 1);
    },
    [updateQuantity, haptic],
  );

  const handleDecrement = useCallback(
    (productId: string, currentQty: number) => {
      if (currentQty > 1) {
        haptic();
        updateQuantity(productId, currentQty - 1);
      }
    },
    [updateQuantity, haptic],
  );

  const handleRemove = useCallback(
    (productId: string) => {
      haptic();
      removeItem(productId);
    },
    [removeItem, haptic],
  );

  const selectedBranch = branches?.find((b) => b.id === selectedBranchId);

  const renderItem = useCallback(
    ({ item, index }: { item: CartItem; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300, delay: index * 60 }}
      >
        <CartLineItem
          item={item}
          onIncrement={() => handleIncrement(item.productId, item.quantity)}
          onDecrement={() => handleDecrement(item.productId, item.quantity)}
          onRemove={() => handleRemove(item.productId)}
        />
      </MotiView>
    ),
    [handleIncrement, handleDecrement, handleRemove],
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[Typography.h2, { color: colors.textPrimary }]}>Cart</Text>
        </View>
        <EmptyState
          icon="shopping-cart"
          title="Your cart is empty"
          subtitle="Browse our catalogue to find what you need"
          action={
            <Button
              label="Start Shopping"
              onPress={() => nav.navigate('CatalogueTab', { screen: 'Catalogue' })}
              variant="primary"
              size="md"
            />
          }
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBadge}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 12 }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[Typography.h2, { color: colors.textPrimary }]}>Cart</Text>
            <Badge count={itemCount} />
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {/* Job Reference */}
            <View style={styles.section}>
              <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>
                Job Reference (optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                value={jobReference}
                onChangeText={setJobReference}
                placeholder="e.g. Walsh Ave Reno — Stage 2"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            {/* Delivery Method */}
            <View style={styles.section}>
              <Text style={[Typography.h4, { color: colors.textPrimary, marginBottom: Spacing.sm }]}>
                Delivery Method
              </Text>
              <View style={styles.deliveryToggle}>
                <TouchableOpacity
                  style={[
                    styles.deliveryOption,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    deliveryMethod === 'delivery' && styles.deliveryOptionActive,
                  ]}
                  onPress={() => {
                    haptic();
                    setDeliveryMethod('delivery');
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="local-shipping"
                    size={20}
                    color={deliveryMethod === 'delivery' ? Colors.white : colors.textSecondary}
                  />
                  <Text
                    style={[
                      Typography.h4,
                      {
                        color: deliveryMethod === 'delivery' ? Colors.white : colors.textSecondary,
                        marginLeft: Spacing.sm,
                      },
                    ]}
                  >
                    Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deliveryOption,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    deliveryMethod === 'click_and_collect' && styles.deliveryOptionActive,
                  ]}
                  onPress={() => {
                    haptic();
                    setDeliveryMethod('click_and_collect');
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name="store"
                    size={20}
                    color={deliveryMethod === 'click_and_collect' ? Colors.white : colors.textSecondary}
                  />
                  <Text
                    style={[
                      Typography.h4,
                      {
                        color: deliveryMethod === 'click_and_collect' ? Colors.white : colors.textSecondary,
                        marginLeft: Spacing.sm,
                      },
                    ]}
                  >
                    Click & Collect
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Branch Selector */}
              {deliveryMethod === 'click_and_collect' && (
                <MotiView
                  from={{ opacity: 0, scaleY: 0.95 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ type: 'timing', duration: 250 }}
                  style={styles.branchSection}
                >
                  <Text style={[Typography.body, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>
                    Select Branch
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.branchSelector,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                    onPress={() => setBranchDropdownOpen(!branchDropdownOpen)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        Typography.body,
                        { color: selectedBranch ? colors.textPrimary : colors.textTertiary, flex: 1 },
                      ]}
                    >
                      {selectedBranch ? selectedBranch.name : 'Choose a branch...'}
                    </Text>
                    <MaterialIcons
                      name={branchDropdownOpen ? 'expand-less' : 'expand-more'}
                      size={22}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                  {branchDropdownOpen && branches && (
                    <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      {branches.map((branch) => (
                        <TouchableOpacity
                          key={branch.id}
                          style={[
                            styles.dropdownItem,
                            { borderBottomColor: colors.border },
                            branch.id === selectedBranchId && { backgroundColor: colors.surface2 },
                          ]}
                          onPress={() => {
                            haptic();
                            setSelectedBranch(branch.id);
                            setBranchDropdownOpen(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                            {branch.name}
                          </Text>
                          <View style={styles.branchStatus}>
                            <View
                              style={[
                                styles.statusDot,
                                { backgroundColor: Colors.success },
                              ]}
                            />
                            <Text style={[Typography.caption, { color: Colors.success }]}>Open</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </MotiView>
              )}
            </View>

            {/* Cart Summary */}
            <View style={styles.section}>
              <CartSummary
                subtotal={subtotal}
                gst={gst}
                deliveryFee={deliveryFee}
                total={total}
              />
            </View>

            <View style={{ height: 100 }} />
          </View>
        }
      />

      {/* Bottom Fixed Bar */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <Button
          label="Proceed to Checkout"
          onPress={() => navigation.navigate('Checkout')}
          variant="primary"
          size="lg"
          fullWidth
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
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 14,
  },
  deliveryToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  deliveryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  deliveryOptionActive: {
    backgroundColor: Colors.brand.blue,
    borderColor: Colors.brand.blue,
  },
  branchSection: {
    marginTop: Spacing.md,
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: Radius.md,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  branchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
