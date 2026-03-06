import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props {
  count: number;
  color?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ count, color = Colors.brand.accent, size = 'sm' }: Props) {
  if (count <= 0) return null;

  const label = count > 99 ? '99+' : String(count);
  const isMd = size === 'md';

  return (
    <View style={[styles.badge, { backgroundColor: color }, isMd && styles.badgeMd]}>
      <Text style={[styles.text, isMd && styles.textMd]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeMd: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
  },
  text: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  textMd: {
    fontSize: 12,
  },
});
