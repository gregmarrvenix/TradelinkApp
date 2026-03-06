import React, { useRef } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void;
  onScanPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value, onChangeText, onSubmit, onScanPress,
  placeholder = 'Search 77,000+ products...', autoFocus,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color={Colors.text.tertiary} style={styles.icon} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.tertiary}
        style={styles.input}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
          <MaterialIcons name="close" size={18} color={Colors.text.secondary} />
        </TouchableOpacity>
      )}
      {onScanPress && (
        <TouchableOpacity onPress={onScanPress} style={styles.scanBtn}>
          <MaterialIcons name="qr-code-scanner" size={22} color={Colors.brand.blue} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  clearBtn: { padding: 4, marginLeft: 4 },
  scanBtn: {
    padding: 4,
    marginLeft: Spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.border,
    paddingLeft: Spacing.md,
  },
});
