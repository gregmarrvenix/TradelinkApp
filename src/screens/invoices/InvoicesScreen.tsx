import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';

import { useThemeStore } from '../../store/themeStore';
import { useInvoices } from '../../hooks/useInvoices';
import Card from '../../components/common/Card';
import Chip from '../../components/common/Chip';
import StatusPill from '../../components/common/StatusPill';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { InvoicesScreenProps } from '../../navigation/types';
import type { Invoice } from '../../types';

const FILTERS = ['All', 'Unpaid', 'Paid'] as const;
type FilterType = (typeof FILTERS)[number];

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

export default function InvoicesScreen({ navigation }: InvoicesScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const { data: invoices, isLoading, refetch } = useInvoices();
  const [filter, setFilter] = useState<FilterType>('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (!invoices) return [];
    let result = invoices;
    if (filter === 'Unpaid') result = result.filter((inv) => inv.status === 'unpaid' || inv.status === 'overdue');
    else if (filter === 'Paid') result = result.filter((inv) => inv.status === 'paid');
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q),
      );
    }
    return result;
  }, [invoices, filter, search]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = useCallback(
    ({ item, index }: { item: Invoice; index: number }) => {
      const isOverdue =
        item.status === 'unpaid' && new Date(item.dueDate) < new Date();
      return (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 350, delay: index * 60 }}
        >
          <TouchableOpacity
            style={[styles.invoiceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: item.id })}
            activeOpacity={0.8}
          >
            <View style={styles.invoiceHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h4, { color: colors.textPrimary }]}>
                  {item.invoiceNumber}
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  {formatDate(item.issuedAt)}
                </Text>
              </View>
              <StatusPill status={isOverdue ? 'overdue' : item.status} />
            </View>
            <View style={styles.invoiceFooter}>
              <View>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  Due: {formatDate(item.dueDate)}
                </Text>
                {isOverdue && (
                  <View style={styles.overdueTag}>
                    <MaterialIcons name="warning" size={12} color={Colors.error} />
                    <Text style={[Typography.labelSm, { color: Colors.error, marginLeft: 4 }]}>
                      OVERDUE
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[Typography.price, { color: Colors.brand.blue }]}>
                {formatCurrency(item.total)}
              </Text>
            </View>
          </TouchableOpacity>
        </MotiView>
      );
    },
    [colors, navigation],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.loadContent}>
          <LoadingSkeleton variant="card" count={4} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary }]}>Invoices</Text>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <View style={[styles.balanceCard, { borderColor: colors.border }]}>
          <Text style={[Typography.label, { color: Colors.text.secondary }]}>Account Balance</Text>
          <Text style={[Typography.priceLg, { color: Colors.brand.blue, marginTop: Spacing.xs }]}>
            $8,432.50
          </Text>
          <Text style={[Typography.caption, { color: Colors.text.secondary, marginTop: Spacing.xs }]}>
            Credit Limit: $25,000.00
          </Text>
          <View style={styles.progressWrap}>
            <Progress.Bar
              progress={8432.5 / 25000}
              width={null}
              height={8}
              borderRadius={4}
              color={Colors.brand.blue}
              unfilledColor={Colors.light.surface3}
              borderWidth={0}
            />
          </View>
          <Text style={[Typography.caption, { color: Colors.text.tertiary }]}>
            {((8432.5 / 25000) * 100).toFixed(0)}% credit used
          </Text>
        </View>
      </MotiView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {FILTERS.map((f) => (
          <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search invoices..."
        />
      </View>

      <FlatList
        data={filtered}
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
        ListEmptyComponent={
          <EmptyState
            icon="receipt-long"
            title="No Invoices"
            subtitle={filter === 'All' ? 'No invoices found' : `No ${filter.toLowerCase()} invoices`}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadContent: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  balanceCard: {
    marginHorizontal: Spacing.screen,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  progressWrap: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    paddingHorizontal: Spacing.screen,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.huge,
  },
  invoiceCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  overdueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
