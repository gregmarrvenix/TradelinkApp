import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface Props {
  label?: string;
  spacing?: number;
}

export default function Divider({ label, spacing = Spacing.lg }: Props) {
  if (label) {
    return (
      <View style={[styles.row, { marginVertical: spacing }]}>
        <View style={styles.line} />
        <Text style={[Typography.caption, styles.label]}>{label}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.line, { marginVertical: spacing }]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  label: {
    color: Colors.text.tertiary,
    marginHorizontal: 12,
  },
});
