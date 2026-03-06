import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, CommonActions, useNavigationState } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeStore } from '../store/themeStore';
import { Colors } from '../theme/colors';
import FloatingCartButton from '../components/common/FloatingCartButton';
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
        color={focused ? Colors.brand.blue : colors.textSecondary}
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
    backgroundColor: Colors.brand.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
});

// Reset stack to root when tab is pressed while already focused
const resetTabListener = (rootScreen: string) => ({
  tabPress: (e: any) => {
    // We don't prevent default - just dispatch a reset if needed
  },
  focus: (e: any) => {
    // handled by initialRouteName
  },
});

export default function BottomTabNavigator() {
  const isDark = useThemeStore((s) => s.isDark)();
  const colors = useThemeStore((s) => s.colors)();
  const nav = useNavigation<NavigationProp<BottomTabParamList>>();

  // Detect if user is on Cart or Checkout screen
  const navState = useNavigationState((s) => s);
  const isOnCartScreen = React.useMemo(() => {
    try {
      const accountTab = navState?.routes?.find((r: any) => r.name === 'AccountTab');
      const nestedState = accountTab?.state;
      if (nestedState) {
        const currentRoute = nestedState.routes[nestedState.index ?? 0];
        return currentRoute?.name === 'Cart' || currentRoute?.name === 'Checkout';
      }
      return false;
    } catch { return false; }
  }, [navState]);

  // Web needs more bottom padding; platform-specific height
  const isWeb = Platform.OS === 'web';
  const tabHeight = isWeb ? 72 : Platform.OS === 'android' ? 60 : 80;
  const tabPaddingBottom = isWeb ? 12 : Platform.OS === 'android' ? 8 : 24;

  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
          borderTopColor: isDark ? Colors.dark.border : Colors.light.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.brand.blue,
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
        listeners={({ navigation: tabNav }) => ({
          tabPress: () => {
            tabNav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'HomeTab' }] }));
          },
        })}
      />
      <Tab.Screen
        name="CatalogueTab"
        component={CatalogueStack}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
        listeners={({ navigation: tabNav }) => ({
          tabPress: () => {
            tabNav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'CatalogueTab' }] }));
          },
        })}
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
        listeners={({ navigation: tabNav }) => ({
          tabPress: () => {
            tabNav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'OrdersTab' }] }));
          },
        })}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
        listeners={({ navigation: tabNav }) => ({
          tabPress: () => {
            tabNav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AccountTab' }] }));
          },
        })}
      />
    </Tab.Navigator>
    <FloatingCartButton
      onPress={() => nav.navigate('AccountTab', { screen: 'Cart' } as any)}
      hidden={isOnCartScreen}
    />
    </View>
  );
}
