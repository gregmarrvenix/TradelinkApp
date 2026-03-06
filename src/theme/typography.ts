import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  // Display
  display1: { fontSize: 40, fontWeight: '800', letterSpacing: -1.5, lineHeight: 44 },
  display2: { fontSize: 32, fontWeight: '800', letterSpacing: -1, lineHeight: 36 },

  // Headings
  h1: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: 32 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2, lineHeight: 24 },
  h4: { fontSize: 16, fontWeight: '600', letterSpacing: 0, lineHeight: 22 },

  // Body
  bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySm: { fontSize: 13, fontWeight: '400', lineHeight: 18 },

  // Labels & UI
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' as const },
  labelSm: { fontSize: 11, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' as const },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  overline: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' as const },

  // Price display
  priceLg: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  price: { fontSize: 20, fontWeight: '700' },
  priceSm: { fontSize: 16, fontWeight: '600' },

  // Special
  mono: { fontSize: 13, fontFamily: 'monospace', letterSpacing: 0.3 },
});
