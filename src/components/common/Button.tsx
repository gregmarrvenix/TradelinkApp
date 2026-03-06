import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export default function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, fullWidth, icon, style,
}: Props) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radius.sm },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: Radius.md },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: Radius.lg },
  }[size];

  const textSize = { sm: Typography.body, md: Typography.h4, lg: Typography.h3 }[size];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#AAB0B8', '#969DA6'] : [Colors.brand.blueLight, Colors.brand.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            sizeStyles,
            !isDisabled && {
              shadowColor: Colors.brand.blue,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <View style={styles.row}>
              {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
              <Text style={[textSize, styles.textPrimary]}>{label}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyle = {
    secondary: { backgroundColor: Colors.light.surface2, borderWidth: 0 },
    ghost: { backgroundColor: Colors.transparent, borderWidth: 0 },
    danger: { backgroundColor: Colors.error, borderWidth: 0 },
    outline: { backgroundColor: Colors.transparent, borderWidth: 1.5, borderColor: Colors.brand.blue },
  }[variant];

  const textColor = {
    secondary: Colors.text.primary,
    ghost: Colors.brand.blue,
    danger: Colors.white,
    outline: Colors.brand.blue,
  }[variant as Exclude<Variant, 'primary'>];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base, sizeStyles, variantStyle,
        isDisabled && styles.disabled,
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={[textSize, { color: textColor, fontWeight: '600' }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  textPrimary: { color: Colors.white, fontWeight: '700' },
  disabled: { opacity: 0.45 },
});
