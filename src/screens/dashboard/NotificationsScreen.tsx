import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useThemeStore } from '../../store/themeStore';
import { useNotifications } from '../../hooks/useNotifications';
import EmptyState from '../../components/common/EmptyState';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import type { NotificationsScreenProps, HomeStackParamList, BottomTabParamList } from '../../navigation/types';

type NotifNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Notifications'>,
  BottomTabNavigationProp<BottomTabParamList>
>;

const ICON_MAP: Record<string, string> = {
  delivery: 'local-shipping',
  order: 'local-shipping',
  quote: 'description',
  invoice: 'receipt',
  promotion: 'local-offer',
  system: 'info',
};

function getIcon(type: string): string {
  return ICON_MAP[type] ?? 'notifications';
}

function timeAgo(time: string): string {
  const diff = Date.now() - new Date(time).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  orderId?: string;
}

export default function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const nav = useNavigation<NotifNavProp>();
  const colors = useThemeStore((s) => s.colors)();
  const { data: notifications, isLoading } = useNotifications();

  const onPress = useCallback(
    (item: NotificationItem) => {
      if (item.orderId) {
        if (item.type === 'delivery' || item.type === 'order') {
          navigation.navigate('TrackingScreen', { orderId: item.orderId });
        } else if (item.type === 'quote') {
          nav.navigate('AccountTab', {
            screen: 'QuoteDetail',
            params: { quoteId: item.orderId },
          });
        } else if (item.type === 'invoice') {
          nav.navigate('AccountTab', {
            screen: 'InvoiceDetail',
            params: { invoiceId: item.orderId },
          });
        }
      }
    },
    [navigation, nav],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: NotificationItem; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300, delay: index * 60 }}
      >
        <TouchableOpacity
          style={[
            styles.row,
            { borderBottomColor: colors.borderFaint },
            !item.read && { backgroundColor: colors.surface2 },
          ]}
          activeOpacity={0.7}
          onPress={() => onPress(item)}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.surface3 },
            ]}
          >
            <MaterialIcons
              name={getIcon(item.type)}
              size={22}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  Typography.h4,
                  { color: colors.textPrimary, flex: 1 },
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text
              style={[Typography.body, { color: colors.textSecondary, marginTop: 2 }]}
              numberOfLines={2}
            >
              {item.body}
            </Text>
            <Text style={[Typography.caption, { color: colors.textTertiary, marginTop: 4 }]}>
              {timeAgo(item.time)}
            </Text>
          </View>
        </TouchableOpacity>
      </MotiView>
    ),
    [colors, onPress],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <FlatList
        data={notifications ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          (!notifications || notifications.length === 0) ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="notifications-none"
              title="No Notifications"
              subtitle="You're all caught up"
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand.red,
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
