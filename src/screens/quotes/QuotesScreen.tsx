import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemeStore } from '../../store/themeStore';
import { useQuotes } from '../../hooks/useQuotes';
import Card from '../../components/common/Card';
import Chip from '../../components/common/Chip';
import StatusPill from '../../components/common/StatusPill';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { QuotesScreenProps } from '../../navigation/types';
import type { Quote } from '../../types';

const FILTERS = ['All', 'Pending', 'Accepted', 'Expired'] as const;
type FilterType = (typeof FILTERS)[number];

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

export default function QuotesScreen({ navigation }: QuotesScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const { data: quotes, isLoading } = useQuotes();
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = useMemo(() => {
    if (!quotes) return [];
    if (filter === 'All') return quotes;
    return quotes.filter((q) => q.status === filter.toLowerCase());
  }, [quotes, filter]);

  const renderItem = useCallback(
    ({ item, index }: { item: Quote; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 350, delay: index * 60 }}
      >
        <TouchableOpacity
          style={[styles.quoteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('QuoteDetail', { quoteId: item.id })}
          activeOpacity={0.8}
        >
          <View style={styles.quoteHeader}>
            <Text style={[Typography.h4, { color: colors.textPrimary }]}>
              {item.quoteNumber}
            </Text>
            <StatusPill status={item.status} />
          </View>
          <View style={styles.quoteBody}>
            <View style={styles.quoteRow}>
              <MaterialIcons name="event" size={14} color={colors.textTertiary} />
              <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <View style={styles.quoteRow}>
              <MaterialIcons name="schedule" size={14} color={colors.textTertiary} />
              <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: 4 }]}>
                Expires {formatDate(item.validUntil)}
              </Text>
            </View>
          </View>
          <View style={styles.quoteFooter}>
            <Text style={[Typography.price, { color: Colors.brand.red }]}>
              {formatCurrency(item.total)}
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
      </MotiView>
    ),
    [colors, navigation],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.content}>
          <LoadingSkeleton variant="card" count={4} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: colors.textPrimary }]}>Quotes</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            selected={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="request-quote"
            title="No Quotes"
            subtitle={filter === 'All' ? 'You have no quotes yet' : `No ${filter.toLowerCase()} quotes`}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.xl },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  chipRow: {
    paddingHorizontal: Spacing.screen,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.huge,
  },
  quoteCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quoteBody: {
    gap: 4,
    marginBottom: Spacing.md,
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
