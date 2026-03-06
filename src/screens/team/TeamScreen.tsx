import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
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
import { useTeam } from '../../hooks/useTeam';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import type { TeamScreenProps } from '../../navigation/types';
import type { TeamMember } from '../../types';

const ROLE_COLORS: Record<string, string> = {
  admin: Colors.brand.blue,
  buyer: Colors.info,
  viewer: Colors.text.tertiary,
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamScreen({ navigation, ..._props }: TeamScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const currentUser = useAuthStore((s) => s.user);
  const { data: team, isLoading } = useTeam();

  const [permissions, setPermissions] = useState<
    Record<string, { canOrder: boolean; canViewCosts: boolean; canManage: boolean }>
  >({});

  const getPerms = useCallback(
    (member: TeamMember) =>
      permissions[member.id] ?? {
        canOrder: member.role !== 'viewer',
        canViewCosts: member.role !== 'viewer',
        canManage: member.role === 'admin',
      },
    [permissions],
  );

  const togglePerm = useCallback(
    (memberId: string, perm: 'canOrder' | 'canViewCosts' | 'canManage', current: boolean) => {
      triggerHaptic('impactLight');
      setPermissions((prev) => ({
        ...prev,
        [memberId]: {
          ...(prev[memberId] ?? { canOrder: true, canViewCosts: true, canManage: false }),
          [perm]: !current,
        },
      }));
    },
    [],
  );

  const handleInvite = useCallback(() => {
    triggerHaptic('notificationSuccess');
    Toast.show({ type: 'success', text1: 'Invite Sent', text2: 'Team invitation has been sent' });
  }, []);

  const isCurrentUserAdmin = currentUser?.role === 'admin';

  const renderItem = useCallback(
    ({ item, index }: { item: TeamMember; index: number }) => {
      const isYou = item.id === currentUser?.id || index === 0;
      const perms = getPerms(item);
      const roleColor = ROLE_COLORS[item.role] ?? Colors.text.tertiary;

      return (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 350, delay: index * 80 }}
        >
          <View style={[styles.memberCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.memberHeader}>
              <View style={[styles.avatar, { backgroundColor: roleColor + '33' }]}>
                <Text style={[Typography.h4, { color: roleColor }]}>{getInitials(item.name)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[Typography.h4, { color: colors.textPrimary }]}>{item.name}</Text>
                  {isYou && (
                    <View style={styles.youBadge}>
                      <Text style={[Typography.overline, { color: Colors.white }]}>YOU</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.roleBadge, { backgroundColor: roleColor + '22' }]}>
                  <Text style={[Typography.labelSm, { color: roleColor }]}>
                    {item.role.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <MaterialIcons name="email" size={14} color={colors.textTertiary} />
                <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: Spacing.xs }]}>
                  {item.email}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <MaterialIcons name="access-time" size={14} color={colors.textTertiary} />
                <Text style={[Typography.caption, { color: colors.textSecondary, marginLeft: Spacing.xs }]}>
                  Active {item.status === 'active' ? 'today' : item.status}
                </Text>
              </View>
            </View>

            <View style={[styles.permDivider, { backgroundColor: colors.border }]} />

            <View style={styles.permRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Can Place Orders</Text>
              <Switch
                value={perms.canOrder}
                onValueChange={() => togglePerm(item.id, 'canOrder', perms.canOrder)}
                disabled={isYou || !isCurrentUserAdmin}
                trackColor={{ false: colors.surface3, true: Colors.brand.blue + '88' }}
                thumbColor={perms.canOrder ? Colors.brand.blue : colors.textTertiary}
              />
            </View>
            <View style={styles.permRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Can View Costs</Text>
              <Switch
                value={perms.canViewCosts}
                onValueChange={() => togglePerm(item.id, 'canViewCosts', perms.canViewCosts)}
                disabled={isYou || !isCurrentUserAdmin}
                trackColor={{ false: colors.surface3, true: Colors.brand.blue + '88' }}
                thumbColor={perms.canViewCosts ? Colors.brand.blue : colors.textTertiary}
              />
            </View>
            <View style={styles.permRow}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Can Manage Team</Text>
              <Switch
                value={perms.canManage}
                onValueChange={() => togglePerm(item.id, 'canManage', perms.canManage)}
                disabled={isYou || !isCurrentUserAdmin}
                trackColor={{ false: colors.surface3, true: Colors.brand.blue + '88' }}
                thumbColor={perms.canManage ? Colors.brand.blue : colors.textTertiary}
              />
            </View>
          </View>
        </MotiView>
      );
    },
    [colors, currentUser, isCurrentUserAdmin, getPerms, togglePerm],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.loadContent}>
          <LoadingSkeleton variant="listItem" count={4} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, flex: 1 }]}>Team</Text>
        <TouchableOpacity
          style={[styles.inviteBtn, { backgroundColor: Colors.brand.blue }]}
          onPress={handleInvite}
          activeOpacity={0.8}
        >
          <MaterialIcons name="person-add" size={18} color={Colors.white} />
          <Text style={[Typography.label, { color: Colors.white, marginLeft: Spacing.xs }]}>Invite</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={team}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="group"
            title="No Team Members"
            subtitle="Invite team members to manage your account"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadContent: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.huge,
  },
  memberCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youBadge: {
    backgroundColor: Colors.brand.blue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  contactInfo: {
    marginTop: Spacing.md,
    gap: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
});
