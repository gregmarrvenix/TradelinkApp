import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function Card({ children, style, noPadding }: Props) {
  return (
    <View style={[styles.card, !noPadding && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Shadows.sm,
  },
  padded: {
    padding: Spacing.lg,
  },
});
