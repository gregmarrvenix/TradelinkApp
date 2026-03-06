import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AccountStackParamList } from './types';
import AccountScreen from '../screens/account/AccountScreen';
import SettingsScreen from '../screens/account/SettingsScreen';
import InvoicesScreen from '../screens/invoices/InvoicesScreen';
import InvoiceDetailScreen from '../screens/invoices/InvoiceDetailScreen';
import QuotesScreen from '../screens/quotes/QuotesScreen';
import QuoteDetailScreen from '../screens/quotes/QuoteDetailScreen';
import ListsScreen from '../screens/lists/ListsScreen';
import ListDetailScreen from '../screens/lists/ListDetailScreen';
import BranchFinderScreen from '../screens/branches/BranchFinderScreen';
import TeamScreen from '../screens/team/TeamScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Invoices" component={InvoicesScreen} />
      <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
      <Stack.Screen name="Quotes" component={QuotesScreen} />
      <Stack.Screen name="QuoteDetail" component={QuoteDetailScreen} />
      <Stack.Screen name="Lists" component={ListsScreen} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} />
      <Stack.Screen name="BranchFinder" component={BranchFinderScreen} />
      <Stack.Screen name="Team" component={TeamScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
