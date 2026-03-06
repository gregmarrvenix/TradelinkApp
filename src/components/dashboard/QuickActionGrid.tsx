import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

interface QuickAction {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

interface Props {
  actions: QuickAction[];
}

function ActionButton({ icon, label, color, onPress }: QuickAction) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={[Typography.caption, styles.label]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function QuickActionGrid({ actions }: Props) {
  return (
    <View style={styles.grid}>
      {actions.map((action, i) => (
        <ActionButton key={i} {...action} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btn: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
