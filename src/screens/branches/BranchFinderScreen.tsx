import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemeStore } from '../../store/themeStore';
import { useBranches } from '../../hooks/useBranches';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { BranchFinderScreenProps } from '../../navigation/types';
import type { Branch } from '../../types';

// No hardcoded home branch ID - use isHomeBranch from API

function getDistance(lat: number, lng: number): number {
  const baseLat = -33.8688;
  const baseLng = 151.2093;
  const R = 6371;
  const dLat = ((lat - baseLat) * Math.PI) / 180;
  const dLng = ((lng - baseLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((baseLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isOpen(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 17;
}

export default function BranchFinderScreen({ navigation, ..._props }: BranchFinderScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const { data: branches, isLoading } = useBranches();
  const [search, setSearch] = useState('');
  const open = isOpen();

  const sorted = useMemo(() => {
    if (!branches) return [];
    let result = branches.map((b) => ({ ...b, distance: getDistance(b.lat, b.lng) }));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((b) => b.name.toLowerCase().includes(q));
    }
    result.sort((a, b) => a.distance - b.distance);
    return result;
  }, [branches, search]);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  }, []);

  const handleDirections = useCallback((address: string) => {
    const encoded = encodeURIComponent(address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Branch & { distance: number }; index: number }) => {
      const isHome = (item as any).isHomeBranch;
      return (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 350, delay: index * 60 }}
        >
          <View style={[styles.branchCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.branchHeader}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Typography.h4, { color: colors.textPrimary }]}>{item.name}</Text>
                {isHome && (
                  <View style={styles.homeBadge}>
                    <MaterialIcons name="star" size={10} color={Colors.white} />
                    <Text style={[Typography.overline, { color: Colors.white, marginLeft: 2 }]}>HOME</Text>
                  </View>
                )}
              </View>
              <View style={styles.statusDot}>
                <View style={[styles.dot, { backgroundColor: open ? Colors.success : Colors.error }]} />
                <Text style={[Typography.labelSm, { color: open ? Colors.success : Colors.error }]}>
                  {open ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>

            {item.services && item.services.length > 0 && (
              <Text style={[Typography.caption, { color: Colors.brand.blue, marginBottom: Spacing.xs }]}>
                {item.services.join(' + ')}
              </Text>
            )}
            {item.type && !item.services && (
              <Text style={[Typography.caption, { color: Colors.brand.blue, marginBottom: Spacing.xs }]}>
                {item.type}
              </Text>
            )}

            <TouchableOpacity onPress={() => handleDirections(item.address)} activeOpacity={0.7}>
              <View style={styles.infoRow}>
                <MaterialIcons name="place" size={16} color={colors.textTertiary} />
                <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: Spacing.xs, flex: 1 }]}>
                  {item.address}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCall(item.phone)} activeOpacity={0.7}>
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={16} color={colors.textTertiary} />
                <Text style={[Typography.bodySm, { color: Colors.brand.blue, marginLeft: Spacing.xs }]}>
                  {item.phone}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={16} color={colors.textTertiary} />
              <Text style={[Typography.bodySm, { color: colors.textSecondary, marginLeft: Spacing.xs }]}>
                {item.hours}
              </Text>
            </View>

            <View style={styles.distanceRow}>
              <MaterialIcons name="near-me" size={14} color={colors.textTertiary} />
              <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: Spacing.xs }]}>
                {(parseFloat(item.distance) || 0).toFixed(1)} km away
              </Text>
            </View>
          </View>
        </MotiView>
      );
    },
    [colors, open, handleCall, handleDirections],
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
        <Text style={[Typography.h2, { color: colors.textPrimary }]}>Find a Branch</Text>
      </View>

      <View style={[styles.mapPlaceholder, { backgroundColor: '#E8EDF3', borderColor: colors.border }]}>
        {/* Simulated street grid */}
        <View style={[styles.mapRoad, styles.mapRoadH, { top: '25%' }]} />
        <View style={[styles.mapRoad, styles.mapRoadH, { top: '50%' }]} />
        <View style={[styles.mapRoad, styles.mapRoadH, { top: '75%' }]} />
        <View style={[styles.mapRoad, styles.mapRoadV, { left: '20%' }]} />
        <View style={[styles.mapRoad, styles.mapRoadV, { left: '45%' }]} />
        <View style={[styles.mapRoad, styles.mapRoadV, { left: '70%' }]} />
        {sorted.slice(0, 4).map((b, i) => {
          const isHome = (b as any).isHomeBranch;
          const positions = [
            { top: '20%', left: '25%' },
            { top: '40%', left: '55%' },
            { top: '60%', left: '35%' },
            { top: '30%', left: '75%' },
          ];
          const pos = positions[i] ?? positions[0];
          return (
            <View key={b.id} style={[styles.branchMarker, pos, isHome && styles.homeMarker]}>
              <MaterialIcons name={isHome ? 'star' : 'store'} size={14} color={Colors.white} />
            </View>
          );
        })}
        <View style={styles.mapLabel}>
          <Text style={[Typography.caption, { color: colors.textSecondary }]}>
            {sorted.length} branch{sorted.length !== 1 ? 'es' : ''} nearby
          </Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search branches..."
        />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="store" title="No Branches Found" subtitle="Try a different search" />
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
  mapPlaceholder: {
    marginHorizontal: Spacing.screen,
    height: 180,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#D0D8E2',
  },
  mapRoadH: {
    left: 0,
    right: 0,
    height: 2,
  },
  mapRoadV: {
    top: 0,
    bottom: 0,
    width: 2,
  },
  branchMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  homeMarker: {
    backgroundColor: Colors.brand.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  mapLabel: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.huge,
  },
  branchCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  homeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.blue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderFaint,
  },
});
