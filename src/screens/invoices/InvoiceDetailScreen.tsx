import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useInvoice } from '../../hooks/useInvoices';
import StatusPill from '../../components/common/StatusPill';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { InvoiceDetailScreenProps } from '../../navigation/types';

function formatCurrency(n: number) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function InvoiceDetailScreen({ route, navigation }: InvoiceDetailScreenProps) {
  const { invoiceId } = route.params;
  const colors = useThemeStore((s) => s.colors)();
  const { data: invoice, isLoading } = useInvoice(invoiceId);

  const isOverdue = invoice?.status === 'unpaid' && new Date(invoice.dueDate) < new Date();
  const subtotal = invoice?.total ? invoice.total / 1.1 : 0;
  const gst = invoice?.total ? invoice.total - subtotal : 0;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.content}>
          <LoadingSkeleton variant="card" count={3} />
        </View>
      </View>
    );
  }

  if (!invoice) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <EmptyState icon="error-outline" title="Invoice Not Found" />
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
          {invoice.invoiceNumber}
        </Text>
        <StatusPill status={isOverdue ? 'overdue' : invoice.status} size="md" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }}>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Date Issued</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{formatDate(invoice.issuedAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Due Date</Text>
              <Text style={[Typography.body, { color: isOverdue ? Colors.error : colors.textPrimary }]}>
                {formatDate(invoice.dueDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Branch</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>Alexandria</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>Order</Text>
              <Text style={[Typography.body, { color: Colors.brand.red }]}>ORD-{invoiceId.slice(-4)}</Text>
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }}>
            <Text style={[Typography.label, { color: colors.textSecondary, marginBottom: Spacing.sm }]}>Job Name</Text>
            <Text style={[Typography.h3, { color: colors.textPrimary }]}>
              42 Smith St Renovation
            </Text>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.md }]}>
            Line Items
          </Text>
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }} noPadding>
            <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Text style={[Typography.labelSm, { color: colors.textSecondary, flex: 1 }]}>Description</Text>
              <Text style={[Typography.labelSm, { color: colors.textSecondary, width: 40, textAlign: 'center' }]}>Qty</Text>
              <Text style={[Typography.labelSm, { color: colors.textSecondary, width: 70, textAlign: 'right' }]}>Price</Text>
              <Text style={[Typography.labelSm, { color: colors.textSecondary, width: 80, textAlign: 'right' }]}>Total</Text>
            </View>
            {[
              { desc: 'Copper Pipe 15mm x 3m', qty: 10, price: 18.50 },
              { desc: 'Elbow 90 15mm Solder', qty: 20, price: 2.80 },
              { desc: 'Flux Paste 100g', qty: 2, price: 12.50 },
              { desc: 'Silver Solder 2mm 250g', qty: 1, price: 45.00 },
            ].map((line, idx) => (
              <View
                key={idx}
                style={[styles.tableRow, { borderBottomColor: colors.borderFaint }, idx === 3 && { borderBottomWidth: 0 }]}
              >
                <Text style={[Typography.bodySm, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
                  {line.desc}
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary, width: 40, textAlign: 'center' }]}>
                  {line.qty}
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textSecondary, width: 70, textAlign: 'right' }]}>
                  {formatCurrency(line.price)}
                </Text>
                <Text style={[Typography.bodySm, { color: colors.textPrimary, width: 80, textAlign: 'right', fontWeight: '600' }]}>
                  {formatCurrency(line.price * line.qty)}
                </Text>
              </View>
            ))}
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.md }}>
            <View style={styles.priceRow}>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>GST (10%)</Text>
              <Text style={[Typography.body, { color: colors.textPrimary }]}>{formatCurrency(gst)}</Text>
            </View>
            <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />
            <View style={styles.priceRow}>
              <Text style={[Typography.h3, { color: colors.textPrimary }]}>Total</Text>
              <Text style={[Typography.price, { color: Colors.brand.red, fontWeight: '800' }]}>
                {formatCurrency(invoice.total)}
              </Text>
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}>
            <View style={styles.statusIndicator}>
              {invoice.status === 'paid' ? (
                <>
                  <View style={[styles.statusIcon, { backgroundColor: Colors.successBg }]}>
                    <MaterialIcons name="check-circle" size={32} color={Colors.success} />
                  </View>
                  <Text style={[Typography.h3, { color: Colors.success, marginTop: Spacing.sm }]}>Paid</Text>
                </>
              ) : (
                <>
                  <View style={[styles.statusIcon, { backgroundColor: isOverdue ? Colors.errorBg : Colors.warningBg }]}>
                    <MaterialIcons
                      name={isOverdue ? 'error' : 'schedule'}
                      size={32}
                      color={isOverdue ? Colors.error : Colors.warning}
                    />
                  </View>
                  <Text
                    style={[
                      Typography.h3,
                      { color: isOverdue ? Colors.error : Colors.warning, marginTop: Spacing.sm },
                    ]}
                  >
                    Payment Due: {formatDate(invoice.dueDate)}
                  </Text>
                </>
              )}
            </View>
          </Card>
        </MotiView>

        <View style={styles.actionButtons}>
          <Button
            label="View Order"
            variant="secondary"
            onPress={() =>
              Toast.show({ type: 'info', text1: 'View Order', text2: 'Navigating to order...' })
            }
            fullWidth
            icon={<MaterialIcons name="local-shipping" size={18} color={colors.textPrimary} />}
          />
          <View style={{ height: Spacing.sm }} />
          <Button
            label="Download PDF"
            variant="outline"
            onPress={() =>
              Toast.show({ type: 'info', text1: 'Download', text2: 'PDF download coming soon' })
            }
            fullWidth
            icon={<MaterialIcons name="picture-as-pdf" size={18} color={Colors.brand.red} />}
          />
        </View>

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
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  totalDivider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  statusIndicator: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    marginBottom: Spacing.xl,
  },
});
