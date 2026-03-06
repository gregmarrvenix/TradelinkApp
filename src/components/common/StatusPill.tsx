import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  enroute: { label: 'En Route', color: Colors.success, bg: Colors.successBg },
  'en-route': { label: 'En Route', color: Colors.success, bg: Colors.successBg },
  dispatched: { label: 'Dispatched', color: Colors.info, bg: Colors.infoBg },
  scheduled: { label: 'Scheduled', color: Colors.warning, bg: Colors.warningBg },
  delivered: { label: 'Delivered', color: Colors.success, bg: Colors.successBg },
  processing: { label: 'Processing', color: '#6B5B95', bg: '#F0EDF5' },
  cancelled: { label: 'Cancelled', color: Colors.error, bg: Colors.errorBg },
  pickup: { label: 'Ready for Pickup', color: '#2B8F8F', bg: '#E6F3F3' },
  unpaid: { label: 'Unpaid', color: Colors.warning, bg: Colors.warningBg },
  paid: { label: 'Paid', color: Colors.success, bg: Colors.successBg },
  pending: { label: 'Pending', color: Colors.warning, bg: Colors.warningBg },
  accepted: { label: 'Accepted', color: Colors.success, bg: Colors.successBg },
  expired: { label: 'Expired', color: Colors.text.tertiary, bg: Colors.light.surface3 },
  overdue: { label: 'Overdue', color: Colors.error, bg: Colors.errorBg },
};

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusPill({ status, size = 'sm' }: Props) {
  const config = STATUS_MAP[status] ?? { label: status, color: '#5C6B7F', bg: '#F0F2F5' };
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
