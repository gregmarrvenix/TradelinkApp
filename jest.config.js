module.exports = {
  preset: 'react-native',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['./__tests__/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-vector-icons|react-native-svg|nativewind|moti|@gorhom|react-native-modal|react-native-toast-message|react-native-linear-gradient|react-native-mmkv|react-native-haptic-feedback|react-native-vision-camera|react-native-progress|react-native-biometrics|react-native-skeleton-placeholder|@hookform|@tanstack|zustand|dayjs|lottie-react-native)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
    '\\.json$': '<rootDir>/__tests__/__mocks__/fileMock.js',
  },
};
