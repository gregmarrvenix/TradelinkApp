import { Platform } from 'react-native';

export const Shadows = {
  sm: Platform.select({
    android: { elevation: 1 },
    ios: { shadowColor: '#1A2B3D', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  }),
  md: Platform.select({
    android: { elevation: 3 },
    ios: { shadowColor: '#1A2B3D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  }),
  lg: Platform.select({
    android: { elevation: 6 },
    ios: { shadowColor: '#1A2B3D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  }),
  blue: Platform.select({
    android: { elevation: 4 },
    ios: { shadowColor: '#1B4F7C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  }),
  card: Platform.select({
    android: { elevation: 2 },
    ios: { shadowColor: '#1A2B3D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  }),
};
