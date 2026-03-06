import { Platform } from 'react-native';

export const Shadows = {
  sm: Platform.select({
    android: { elevation: 2 },
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3 },
  }),
  md: Platform.select({
    android: { elevation: 4 },
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
  }),
  lg: Platform.select({
    android: { elevation: 8 },
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12 },
  }),
  red: Platform.select({
    android: { elevation: 6 },
    ios: { shadowColor: '#D0021B', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8 },
  }),
};
