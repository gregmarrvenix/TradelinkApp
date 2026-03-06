import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeStore } from '../store/themeStore';
import { Colors } from '../theme/colors';
import type { BottomTabParamList } from './types';
import HomeStack from './HomeStack';
import CatalogueStack from './CatalogueStack';
import OrdersStack from './OrdersStack';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabIcon({ name, focused, badgeCount }: { name: string; focused: boolean; badgeCount?: number }) {
  const colors = useThemeStore((s) => s.colors)();

  return (
    <View style={iconStyles.container}>
      <MaterialIcons
        name={name}
        size={24}
        color={focused ? Colors.brand.red : colors.textSecondary}
      />
      {badgeCount ? (
        <View style={iconStyles.badge}>
          <Text style={iconStyles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.brand.red,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
});

export default function BottomTabNavigator() {
  const isDark = useThemeStore((s) => s.isDark)();
  const colors = useThemeStore((s) => s.colors)();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
          borderTopColor: isDark ? Colors.dark.border : Colors.light.border,
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 60 : 80,
          paddingBottom: Platform.OS === 'android' ? 8 : 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.brand.red,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CatalogueTab"
        component={CatalogueStack}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="local-shipping" focused={focused} badgeCount={1} />
          ),
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
