import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUser } from '../../hooks/useUser';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { AccountScreenProps } from '../../navigation/types';

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  badge?: number;
  onPress?: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AccountScreen({ navigation }: AccountScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const { data: user } = useUser();
  const authUser = useAuthStore((s) => s.user);
  const cartItemCount = useCartStore((s) => s.items.length);

  const displayUser = user ?? authUser;
  const initials = displayUser ? getInitials(displayUser.name) : 'TL';

  const menuSections: { title: string; items: MenuItem[] }[] = useMemo(
    () => [
      {
        title: 'Orders & Shopping',
        items: [
          { icon: 'local-shipping', label: 'Orders', route: 'Orders' },
          { icon: 'shopping-cart', label: 'Cart', route: 'Cart', badge: cartItemCount },
          { icon: 'list-alt', label: 'My Lists', route: 'Lists' },
        ],
      },
      {
        title: 'Financial',
        items: [
          { icon: 'receipt-long', label: 'Invoices', route: 'Invoices' },
          { icon: 'request-quote', label: 'Quotes', route: 'Quotes' },
        ],
      },
      {
        title: 'Business',
        items: [
          { icon: 'group', label: 'Team', route: 'Team' },
          { icon: 'store', label: 'Find a Branch', route: 'BranchFinder' },
        ],
      },
      {
        title: 'App',
        items: [
          { icon: 'settings', label: 'Settings', route: 'Settings' },
          {
            icon: 'help-outline',
            label: 'Help & Support',
            onPress: () =>
              Toast.show({ type: 'info', text1: 'Help & Support', text2: 'Call 1300 TRADELINK' }),
          },
        ],
      },
    ],
    [cartItemCount],
  );

  const handleNavigate = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      navigation.navigate(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <View style={styles.profileSection}>
            <View style={[styles.avatar, { backgroundColor: Colors.brand.red + '33' }]}>
              <Text style={[Typography.display2, { color: Colors.brand.red }]}>{initials}</Text>
            </View>
            <Text style={[Typography.h2, { color: colors.textPrimary, marginTop: Spacing.md }]}>
              {displayUser?.name ?? 'Trade User'}
            </Text>
            <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
              {displayUser?.company ?? 'Tradelink'}
            </Text>
            <Text style={[Typography.mono, { color: colors.textTertiary, marginTop: Spacing.xs }]}>
              Account: {displayUser?.accountNumber ?? 'TL-88421'}
            </Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 80 }}
        >
          <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, marginBottom: Spacing.xl }}>
            <View style={styles.creditHeader}>
              <Text style={[Typography.label, { color: colors.textSecondary }]}>Credit</Text>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                $8,432.50 of $25,000.00 used
              </Text>
            </View>
            <View style={styles.progressWrap}>
              <Progress.Bar
                progress={8432.5 / 25000}
                width={null}
                height={8}
                borderRadius={4}
                color={Colors.brand.red}
                unfilledColor={colors.surface2}
                borderWidth={0}
              />
            </View>
          </Card>
        </MotiView>

        {menuSections.map((section, sIdx) => (
          <MotiView
            key={section.title}
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 160 + sIdx * 60 }}
          >
            <Text
              style={[
                Typography.label,
                { color: colors.textSecondary, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
              ]}
            >
              {section.title}
            </Text>
            <Card
              noPadding
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                marginBottom: Spacing.xl,
              }}
            >
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuRow,
                    idx < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.borderFaint,
                    },
                  ]}
                  onPress={() => handleNavigate(item)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name={item.icon as any} size={22} color={colors.textSecondary} />
                  <Text
                    style={[
                      Typography.body,
                      { color: colors.textPrimary, flex: 1, marginLeft: Spacing.md },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.badge != null && item.badge > 0 && <Badge count={item.badge} />}
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={colors.textTertiary}
                    style={{ marginLeft: Spacing.sm }}
                  />
                </TouchableOpacity>
              ))}
            </Card>
          </MotiView>
        ))}

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressWrap: {
    marginTop: Spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 56,
  },
});
