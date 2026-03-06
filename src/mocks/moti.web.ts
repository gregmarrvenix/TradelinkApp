import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

export const MotiView = View;
export const MotiText = Text;
export const MotiImage = Image;
export const MotiPressable = Pressable;
export const AnimatePresence = ({ children }: any) => children;

export const useAnimationState = (states: any) => ({
  current: 'from',
  transitionTo: () => {},
  ...states,
});

export const motify = (comp: any) => comp;
