import { Platform } from 'react-native';

let HapticFeedback: any = null;

if (Platform.OS !== 'web') {
  try {
    HapticFeedback = require('react-native-haptic-feedback').default;
  } catch {
    // not available
  }
}

export function triggerHaptic(
  type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError' = 'impactLight',
  options?: { enableVibrateFallback?: boolean; ignoreAndroidSystemSettings?: boolean },
) {
  try {
    HapticFeedback?.trigger(type, options);
  } catch {
    // silently fail on unsupported platforms
  }
}
