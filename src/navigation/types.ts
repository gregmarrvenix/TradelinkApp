import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  BiometricPrompt: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  ProductDetail: { productId: string };
  TrackingScreen: { orderId: string };
  BarcodeScan: undefined;
};

export type CatalogueStackParamList = {
  Catalogue: undefined;
  SearchResults: { query?: string; category?: string };
  ProductDetail: { productId: string };
  BarcodeScan: undefined;
};

export type OrdersStackParamList = {
  Orders: undefined;
  OrderDetail: { orderId: string };
  TrackingScreen: { orderId: string };
};

export type AccountStackParamList = {
  Account: undefined;
  Settings: undefined;
  Invoices: undefined;
  InvoiceDetail: { invoiceId: string };
  Quotes: undefined;
  QuoteDetail: { quoteId: string };
  Lists: undefined;
  ListDetail: { listId: string };
  BranchFinder: undefined;
  Team: undefined;
  Cart: undefined;
  Checkout: undefined;
};

export type BottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CatalogueTab: NavigatorScreenParams<CatalogueStackParamList>;
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
  AccountTab: NavigatorScreenParams<AccountStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<BottomTabParamList>;
};

// Auth screen props
export type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, 'Splash'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type BiometricPromptScreenProps = NativeStackScreenProps<AuthStackParamList, 'BiometricPrompt'>;

// Home stack screen props
export type DashboardScreenProps = NativeStackScreenProps<HomeStackParamList, 'Dashboard'>;
export type NotificationsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Notifications'>;
export type HomeProductDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;
export type HomeTrackingScreenProps = NativeStackScreenProps<HomeStackParamList, 'TrackingScreen'>;
export type HomeBarcodeScanScreenProps = NativeStackScreenProps<HomeStackParamList, 'BarcodeScan'>;

// Catalogue stack screen props
export type CatalogueScreenProps = NativeStackScreenProps<CatalogueStackParamList, 'Catalogue'>;
export type SearchResultsScreenProps = NativeStackScreenProps<CatalogueStackParamList, 'SearchResults'>;
export type CatalogueProductDetailScreenProps = NativeStackScreenProps<CatalogueStackParamList, 'ProductDetail'>;
export type CatalogueBarcodeScanScreenProps = NativeStackScreenProps<CatalogueStackParamList, 'BarcodeScan'>;

// Orders stack screen props
export type OrdersScreenProps = NativeStackScreenProps<OrdersStackParamList, 'Orders'>;
export type OrderDetailScreenProps = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;
export type OrdersTrackingScreenProps = NativeStackScreenProps<OrdersStackParamList, 'TrackingScreen'>;

// Account stack screen props
export type AccountScreenProps = NativeStackScreenProps<AccountStackParamList, 'Account'>;
export type SettingsScreenProps = NativeStackScreenProps<AccountStackParamList, 'Settings'>;
export type InvoicesScreenProps = NativeStackScreenProps<AccountStackParamList, 'Invoices'>;
export type InvoiceDetailScreenProps = NativeStackScreenProps<AccountStackParamList, 'InvoiceDetail'>;
export type QuotesScreenProps = NativeStackScreenProps<AccountStackParamList, 'Quotes'>;
export type QuoteDetailScreenProps = NativeStackScreenProps<AccountStackParamList, 'QuoteDetail'>;
export type ListsScreenProps = NativeStackScreenProps<AccountStackParamList, 'Lists'>;
export type ListDetailScreenProps = NativeStackScreenProps<AccountStackParamList, 'ListDetail'>;
export type BranchFinderScreenProps = NativeStackScreenProps<AccountStackParamList, 'BranchFinder'>;
export type TeamScreenProps = NativeStackScreenProps<AccountStackParamList, 'Team'>;
export type CartScreenProps = NativeStackScreenProps<AccountStackParamList, 'Cart'>;
export type CheckoutScreenProps = NativeStackScreenProps<AccountStackParamList, 'Checkout'>;
