import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Colors } from '../theme/colors';
import type { RootStackParamList } from './types';
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';

const Root = createNativeStackNavigator<RootStackParamList>();

const TradelinkDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.brand.blue,
    background: Colors.dark.bg,
    card: Colors.dark.surface,
    text: Colors.text.primaryD,
    border: Colors.dark.border,
    notification: Colors.brand.blue,
  },
};

const TradelinkLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.brand.blue,
    background: Colors.light.bg,
    card: Colors.light.surface,
    text: Colors.text.primary,
    border: Colors.light.border,
    notification: Colors.brand.blue,
  },
};

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isDark = useThemeStore((s) => s.isDark)();

  return (
    <NavigationContainer theme={isDark ? TradelinkDarkTheme : TradelinkLightTheme}>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Root.Screen name="Main" component={BottomTabNavigator} />
        ) : (
          <Root.Screen name="Auth" component={AuthStack} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
