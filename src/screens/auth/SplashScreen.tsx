import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView, MotiText } from 'moti';
import type { SplashScreenProps } from '../../navigation/types';
import { Typography } from '../../theme/typography';

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#0F0F0F', '#1A0005', '#D0021B']}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <MotiView
        from={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { type: 'timing', duration: 700 },
          scale: { type: 'spring', damping: 18, stiffness: 120 },
        }}
        style={styles.logoArea}
      >
        <View>
          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 700 }}
            style={[Typography.display2, styles.brandText]}
          >
            TRADELINK
          </MotiText>
          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ type: 'timing', duration: 700, delay: 300 }}
            style={[Typography.body, styles.tagline]}
          >
            Save time. Plumb online.
          </MotiText>
        </View>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
  },
  brandText: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  tagline: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
});
