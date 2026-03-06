import React from 'react';
import { View } from 'react-native';

export const SafeAreaProvider = ({ children }: any) => {
  return React.createElement(View, { style: { flex: 1 } }, children);
};

export const SafeAreaView = View;

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: 375,
  height: 812,
});

export const SafeAreaInsetsContext = React.createContext({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
