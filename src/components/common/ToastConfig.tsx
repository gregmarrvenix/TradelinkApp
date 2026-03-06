import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { BaseToastProps } from 'react-native-toast-message';

function TradelinkToast({
  text1,
  text2,
  icon,
  accentColor,
}: BaseToastProps & { icon: string; accentColor: string }) {
  return (
    <View style={[styles.container, { borderLeftColor: accentColor }, Shadows.md]}>
      <View style={[styles.iconBox, { backgroundColor: accentColor + '22' }]}>
        <MaterialIcons name={icon} size={20} color={accentColor} />
      </View>
      <View style={styles.textBox}>
        {text1 ? <Text style={[Typography.h4, styles.title]}>{text1}</Text> : null}
        {text2 ? <Text style={[Typography.body, styles.message]}>{text2}</Text> : null}
      </View>
    </View>
  );
}

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <TradelinkToast {...props} icon="check-circle" accentColor={Colors.success} />
  ),
  error: (props: BaseToastProps) => (
    <TradelinkToast {...props} icon="error" accentColor={Colors.error} />
  ),
  info: (props: BaseToastProps) => (
    <TradelinkToast {...props} icon="info" accentColor={Colors.info} />
  ),
  warning: (props: BaseToastProps) => (
    <TradelinkToast {...props} icon="warning" accentColor={Colors.warning} />
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: { flex: 1 },
  title: { color: Colors.text.primary },
  message: { color: Colors.text.secondary, marginTop: 2 },
});
