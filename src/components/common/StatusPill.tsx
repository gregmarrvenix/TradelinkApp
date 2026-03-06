import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  enroute: { label: 'En Route', color: Colors.status.enroute, bg: Colors.successBg },
  'en-route': { label: 'En Route', color: Colors.status.enroute, bg: Colors.successBg },
  dispatched: { label: 'Dispatched', color: Colors.status.dispatched, bg: Colors.infoBg },
  scheduled: { label: 'Scheduled', color: Colors.status.scheduled, bg: Colors.warningBg },
  delivered: { label: 'Delivered', color: Colors.status.delivered, bg: Colors.successBg },
  processing: { label: 'Processing', color: Colors.status.processing, bg: '#1A0A2A' },
  cancelled: { label: 'Cancelled', color: Colors.status.cancelled, bg: Colors.errorBg },
  pickup: { label: 'Ready Pickup', color: Colors.status.pickup, bg: '#0A2020' },
  unpaid: { label: 'Unpaid', color: Colors.warning, bg: Colors.warningBg },
  paid: { label: 'Paid', color: Colors.success, bg: Colors.successBg },
  pending: { label: 'Pending', color: Colors.warning, bg: Colors.warningBg },
  accepted: { label: 'Accepted', color: Colors.success, bg: Colors.successBg },
  expired: { label: 'Expired', color: Colors.text.tertiary, bg: Colors.dark.surface3 },
  overdue: { label: 'Overdue', color: Colors.error, bg: Colors.errorBg },
};

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'sm' }: Props) {
  const config = STATUS_MAP[status] ?? { label: status, color: '#888', bg: '#222' };
  return (
    <View style={[styles.pill, { backgroundColor: config.bg }, size === 'md' && styles.pillMd]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[Typography.labelSm, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 5,
    alignSelf: 'flex-start',
  },
  pillMd: { paddingHorizontal: 12, paddingVertical: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
