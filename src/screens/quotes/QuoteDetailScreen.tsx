import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { triggerHaptic } from '../../utils/haptics';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useCartStore } from '../../store/cartStore';
import { useQuote } from '../../hooks/useQuotes';
import StatusPill from '../../components/common/StatusPill';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { QuoteDetailScreenProps } from '../../navigation/types';
import type { OrderItem } from '../../types';

function formatCurrency(n: number) {
  return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function QuoteDetailScreen({ route, navigation }: QuoteDetailScreenProps) {
  const { quoteId } = route.params;
  const colors = useThemeStore((s) => s.colors)();
  const { data: quote, isLoading } = useQuote(quoteId);

  const rrpTotal = (quote?.items ?? []).reduce(
    (sum, item) => sum + item.unitPrice * 1.3 * item.quantity,
    0,
  );
  const tradeTotal = quote?.total ?? 0;
  const savings = rrpTotal - tradeTotal;
  const savingsPct = rrpTotal > 0 ? Math.round((savings / rrpTotal) * 100) : 0;

  const handleAccept = useCallback(() => {
    triggerHaptic('notificationSuccess');
    Toast.show({ type: 'success', text1: 'Quote Accepted', text2: 'Your quote has been accepted' });
  }, []);

  const handleDecline = useCallback(() => {
    triggerHaptic('notificationWarning');
    Toast.show({ type: 'warning', text1: 'Quote Declined', text2: 'Your quote has been declined' });
  }, []);

  const handleOrderFromQuote = useCallback(() => {
    triggerHaptic('notificationSuccess');
    Toast.show({ type: 'success', text1: 'Added to Cart', text2: 'Quote items added to cart' });
    navigation.navigate('Cart');
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.content}>
          <LoadingSkeleton variant="card" count={3} />
        </View>
      </View>
    );
  }

  if (!quote) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <EmptyState icon="error-outline" title="Quote Not Found" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, flex: 1, marginHorizontal: Spacing.md }]}>
          {quote.quoteNumber}
        </Text>
        <StatusPill status={quote.status} size="md" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }}>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Created</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{formatDate(quote.createdAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Expires</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{formatDate(quote.validUntil)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Created By</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>Branch Representative</Text>
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
            Items ({quote.items.length})
          </Text>
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }} noPadding>
            {quote.items.map((item: OrderItem, idx: number) => (
              <View
                key={item.productId + idx}
                style={[
                  styles.itemRow,
                  { borderBottomColor: colors.borderFaint },
                  idx === quote.items.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.body, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                    SKU: {item.sku} | Qty: {item.quantity}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[Typography.h4, { color: Colors.brand.blue }]}>
                    {formatCurrency(item.total)}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                    {formatCurrency(item.unitPrice)} ea
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }}>
            <View style={styles.priceRow}>
              <Text style={[Typography.h4, { color: colors.textPrimary }]}>Trade Total</Text>
              <Text style={[Typography.price, { color: Colors.brand.blue, fontWeight: '800' }]}>
                {formatCurrency(tradeTotal)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[Typography.body, { color: colors.textTertiary }]}>RRP Total</Text>
              <Text style={[Typography.body, { color: colors.textTertiary, textDecorationLine: 'line-through' }]}>
                {formatCurrency(rrpTotal)}
              </Text>
            </View>
            <View style={[styles.savingsRow, { backgroundColor: Colors.successBg }]}>
              <MaterialIcons name="savings" size={18} color={Colors.success} />
              <Text style={[Typography.h4, { color: Colors.success, marginLeft: Spacing.sm }]}>
                You Save: {formatCurrency(savings)} ({savingsPct}%)
              </Text>
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}>
            <Text style={[Typography.label, { color: colors.textSecondary, marginBottom: Spacing.xs }]}>Notes</Text>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>
              Trade pricing valid for account holders. Prices exclude GST. Contact your branch for bulk discounts.
            </Text>
          </Card>
        </MotiView>

        {quote.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              label="Accept Quote"
              onPress={handleAccept}
              fullWidth
              icon={<MaterialIcons name="check" size={18} color={Colors.white} />}
            />
            <Button
              label="Decline"
              variant="ghost"
              onPress={handleDecline}
              fullWidth
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        )}

        {quote.status === 'accepted' && (
          <Button
            label="Order from Quote"
            onPress={handleOrderFromQuote}
            fullWidth
            icon={<MaterialIcons name="shopping-cart" size={18} color={Colors.white} />}
          />
        )}

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  actionButtons: {
    marginBottom: Spacing.xl,
  },
});
