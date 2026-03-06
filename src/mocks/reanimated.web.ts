import { View, Text, Image, ScrollView } from 'react-native';

const Animated = {
  View,
  Text,
  Image,
  ScrollView,
  createAnimatedComponent: (comp: any) => comp,
};

export default Animated;

export const useSharedValue = (init: any) => ({ value: init });
export const useAnimatedStyle = (cb: any) => cb();
export const withTiming = (val: any) => val;
export const withSpring = (val: any) => val;
export const withRepeat = (val: any) => val;
export const withSequence = (...args: any[]) => args[0];
export const withDelay = (_: any, val: any) => val;
export const useAnimatedRef = () => ({ current: null });
export const useDerivedValue = (cb: any) => ({ value: cb() });
export const runOnJS = (fn: any) => fn;
export const runOnUI = (fn: any) => fn;
export const interpolate = (val: any) => val;
export const Extrapolate = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
export const Extrapolation = Extrapolate;
export const Easing = {
  linear: (t: number) => t,
  ease: (t: number) => t,
  bezier: () => (t: number) => t,
  inOut: () => (t: number) => t,
};
export const cancelAnimation = () => {};
export const FadeIn = { duration: () => FadeIn };
export const FadeOut = { duration: () => FadeOut };
export const SlideInRight = { duration: () => SlideInRight };
export const SlideOutLeft = { duration: () => SlideOutLeft };
export const Layout = { duration: () => Layout };
