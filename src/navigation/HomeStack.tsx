import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import NotificationsScreen from '../screens/dashboard/NotificationsScreen';
import ProductDetailScreen from '../screens/catalogue/ProductDetailScreen';
import TrackingScreen from '../screens/orders/TrackingScreen';
import BarcodeScanScreen from '../screens/catalogue/BarcodeScanScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      <Stack.Screen name="BarcodeScan" component={BarcodeScanScreen} />
    </Stack.Navigator>
  );
}
