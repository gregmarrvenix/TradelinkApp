import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useBiometrics } from '../../hooks/useBiometrics';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import type { BiometricPromptScreenProps } from '../../navigation/types';

export default function BiometricPromptScreen({
  navigation,
}: BiometricPromptScreenProps) {
  const { authenticate } = useBiometrics();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    attemptBiometric();
  }, []);

  const attemptBiometric = async () => {
    const success = await authenticate('Sign in to Tradelink');
    if (success) {
      try {
        await login('jake.morrisson@morrissonplumbing.com.au', 'demo1234');
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Authentication failed',
          text2: 'Please sign in with your password.',
        });
        navigation.replace('Login');
      }
    }
  };

  const handleUsePassword = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <MaterialIcons
          name="fingerprint"
          size={80}
          color={Colors.brand.red}
        />
        <Text style={[Typography.h2, styles.heading]}>
          Use Biometrics to Sign In
        </Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Touch the sensor to verify
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button
          label="Use Password Instead"
          onPress={handleUsePassword}
          variant="ghost"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
  },
  heading: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  subtitle: {
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },
});
