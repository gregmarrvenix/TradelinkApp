import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CatalogueStackParamList } from './types';
import CatalogueScreen from '../screens/catalogue/CatalogueScreen';
import SearchResultsScreen from '../screens/catalogue/SearchResultsScreen';
import ProductDetailScreen from '../screens/catalogue/ProductDetailScreen';
import BarcodeScanScreen from '../screens/catalogue/BarcodeScanScreen';

const Stack = createNativeStackNavigator<CatalogueStackParamList>();

export default function CatalogueStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Catalogue" component={CatalogueScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="BarcodeScan" component={BarcodeScanScreen} />
    </Stack.Navigator>
  );
}
