import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { triggerHaptic } from '../../utils/haptics';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { SettingsScreenProps } from '../../navigation/types';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const isDark = useThemeStore((s) => s.isDark)();
  const toggleTheme = useThemeStore((s) => s.toggle);
  const logout = useAuthStore((s) => s.logout);

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotional, setPromotional] = useState(false);

  const toggleWithHaptic = (setter: (v: boolean) => void, current: boolean) => {
    triggerHaptic('impactLight');
    setter(!current);
  };

  const handleLogout = () => {
    triggerHaptic('notificationWarning');
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, marginLeft: Spacing.md }]}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text style={[Typography.label, styles.sectionLabel, { color: colors.textSecondary }]}>
            Appearance
          </Text>
          <Card
            noPadding
            style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}
          >
            <View style={[styles.settingRow, { borderBottomColor: colors.borderFaint }]}>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.body, { color: colors.textPrimary }]}>Dark Mode</Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  {isDark ? 'Dark' : 'Light'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={() => {
                  triggerHaptic('impactLight');
                  toggleTheme();
                }}
                trackColor={{ false: colors.surface3, true: Colors.brand.red + '88' }}
                thumbColor={isDark ? Colors.brand.red : colors.textTertiary}
              />
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 80 }}
        >
          <Text style={[Typography.label, styles.sectionLabel, { color: colors.textSecondary }]}>
            Security
          </Text>
          <Card
            noPadding
            style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}
          >
            <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderFaint }]}>
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Biometric Login
              </Text>
              <Switch
                value={biometricEnabled}
                onValueChange={() => toggleWithHaptic(setBiometricEnabled, biometricEnabled)}
                trackColor={{ false: colors.surface3, true: Colors.brand.red + '88' }}
                thumbColor={biometricEnabled ? Colors.brand.red : colors.textTertiary}
              />
            </View>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() =>
                Toast.show({ type: 'info', text1: 'Change Password', text2: 'Contact your branch to change password' })
              }
              activeOpacity={0.7}
            >
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Change Password
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 160 }}
        >
          <Text style={[Typography.label, styles.sectionLabel, { color: colors.textSecondary }]}>
            Notifications
          </Text>
          <Card
            noPadding
            style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}
          >
            <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderFaint }]}>
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Push Notifications
              </Text>
              <Switch
                value={pushEnabled}
                onValueChange={() => toggleWithHaptic(setPushEnabled, pushEnabled)}
                trackColor={{ false: colors.surface3, true: Colors.brand.red + '88' }}
                thumbColor={pushEnabled ? Colors.brand.red : colors.textTertiary}
              />
            </View>
            <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderFaint }]}>
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Order Updates
              </Text>
              <Switch
                value={orderUpdates}
                onValueChange={() => toggleWithHaptic(setOrderUpdates, orderUpdates)}
                trackColor={{ false: colors.surface3, true: Colors.brand.red + '88' }}
                thumbColor={orderUpdates ? Colors.brand.red : colors.textTertiary}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Promotional
              </Text>
              <Switch
                value={promotional}
                onValueChange={() => toggleWithHaptic(setPromotional, promotional)}
                trackColor={{ false: colors.surface3, true: Colors.brand.red + '88' }}
                thumbColor={promotional ? Colors.brand.red : colors.textTertiary}
              />
            </View>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 240 }}
        >
          <Text style={[Typography.label, styles.sectionLabel, { color: colors.textSecondary }]}>
            About
          </Text>
          <Card
            noPadding
            style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}
          >
            <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderFaint }]}>
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>Version</Text>
              <Text style={[Typography.body, { color: colors.textSecondary }]}>1.0.0 (Build 1)</Text>
            </View>
            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.borderFaint }]}
              onPress={() => Toast.show({ type: 'info', text1: 'Terms', text2: 'Opening terms...' })}
              activeOpacity={0.7}
            >
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Terms of Trade
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Toast.show({ type: 'info', text1: 'Privacy', text2: 'Opening privacy...' })}
              activeOpacity={0.7}
            >
              <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]}>
                Privacy Policy
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </Card>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 320 }}
        >
          <Text style={[Typography.label, styles.sectionLabel, { color: colors.textSecondary }]}>
            Account
          </Text>
          <Button
            label="Sign Out"
            variant="danger"
            onPress={handleLogout}
            fullWidth
            icon={<MaterialIcons name="logout" size={18} color={Colors.white} />}
          />
        </MotiView>

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 56,
  },
});
