/* eslint-disable @typescript-eslint/no-empty-function */
import 'react-native-gesture-handler/jestSetup';

// react-native-reanimated mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

// react-native-linear-gradient
jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return View;
});

// react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    delete: jest.fn(),
  }),
}));

// react-native-haptic-feedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
  HapticFeedbackTypes: {},
}));

// react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevices: jest.fn(() => ({ back: null, front: null })),
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(),
}));

// @react-navigation/native
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      reset: mockReset,
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {},
      key: 'test-route',
      name: 'TestScreen',
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

// react-native-toast-message
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

// moti
jest.mock('moti', () => {
  const { View } = require('react-native');
  return {
    MotiView: View,
    MotiText: require('react-native').Text,
    MotiImage: require('react-native').Image,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// react-native-progress
jest.mock('react-native-progress', () => {
  const { View } = require('react-native');
  return {
    Bar: View,
    Circle: View,
    Pie: View,
  };
});

// lottie-react-native
jest.mock('lottie-react-native', () => 'LottieView');

// react-native-skeleton-placeholder
jest.mock('react-native-skeleton-placeholder', () => {
  const { View } = require('react-native');
  const SkeletonPlaceholder = ({ children }: { children: React.ReactNode }) => children;
  SkeletonPlaceholder.Item = View;
  return SkeletonPlaceholder;
});

// react-native-biometrics
jest.mock('react-native-biometrics', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn().mockResolvedValue({ available: false }),
    simplePrompt: jest.fn().mockResolvedValue({ success: false }),
  })),
}));

// @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { View, FlatList } = require('react-native');
  return {
    __esModule: true,
    default: View,
    BottomSheetModal: View,
    BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => children,
    BottomSheetFlatList: FlatList,
    BottomSheetScrollView: View,
    BottomSheetBackdrop: View,
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Export navigation mocks for test assertions
export { mockNavigate, mockGoBack, mockReset };
