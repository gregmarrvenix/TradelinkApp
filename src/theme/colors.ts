export const Colors = {
  // Brand
  brand: {
    blue: '#003087',        // Tradelink primary blue
    blueDark: '#002060',    // Darker shade for emphasis
    blueLight: '#1A5DAB',   // Lighter interactive blue
    blueFaded: '#E8EEF7',   // Very subtle blue tint for backgrounds
    accent: '#E8443A',      // Red-coral accent for primary CTAs
    accentDark: '#C93830',  // Darker accent
    accentLight: '#FF6B5E', // Lighter accent
  },

  // Light Theme (default)
  light: {
    bg: '#F4F6F9',          // Warm light gray-blue
    surface: '#FFFFFF',     // White cards
    surface2: '#F0F2F5',    // Slightly darker surface
    surface3: '#E6E9EE',    // Even darker for contrast
    border: '#DDE1E8',      // Subtle border
    borderFaint: '#ECEEF2', // Very faint border
  },

  // Dark Theme
  dark: {
    bg: '#0C1B2A',
    surface: '#152538',
    surface2: '#1E3048',
    surface3: '#283C55',
    border: '#354D68',
    borderFaint: '#253750',
  },

  // Text
  text: {
    primary: '#1A2B3D',      // Near-black for primary text
    secondary: '#5C6B7F',    // Mid-gray for secondary
    tertiary: '#8E99A8',     // Light gray for hints
    primaryD: '#EEF2F6',     // Light text for dark theme
    secondaryD: '#9CAAB8',   // Secondary for dark theme
    inverse: '#FFFFFF',      // White text on dark backgrounds
  },

  // Semantic - these are the ONLY non-blue colors allowed
  success: '#2E8B57',       // Sea green - for success/delivered
  successBg: '#EDF7F1',     // Light green bg
  warning: '#D4891C',       // Warm amber - for warnings
  warningBg: '#FDF3E3',     // Light amber bg
  error: '#D94343',         // Red - for errors
  errorBg: '#FCEAEA',       // Light red bg
  info: '#1A5DAB',          // Blue - for info (matches brand light)
  infoBg: '#E8EEF7',        // Light blue bg (matches brand faded)

  // Delivery status
  status: {
    scheduled: '#D4891C',    // Amber
    dispatched: '#1A5DAB',   // Blue
    enroute: '#2E8B57',      // Green
    delivered: '#2E8B57',    // Green
    processing: '#6B5B95',   // Muted purple
    cancelled: '#D94343',    // Red
    pickup: '#2B8F8F',       // Teal
  },

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(12, 27, 42, 0.5)',
  overlayLight: 'rgba(12, 27, 42, 0.08)',
};

export const C = Colors;
