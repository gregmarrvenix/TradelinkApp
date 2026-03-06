import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: string;
  onRemove?: () => void;
}

export default function Chip({ label, selected, onPress, icon, onRemove }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={14}
          color={selected ? Colors.white : Colors.text.secondary}
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[Typography.caption, { color: selected ? Colors.white : Colors.text.secondary }]}>
        {label}
      </Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
          <MaterialIcons name="close" size={14} color={selected ? Colors.white : Colors.text.tertiary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.dark.surface2,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipSelected: {
    backgroundColor: Colors.brand.red,
    borderColor: Colors.brand.red,
  },
});
