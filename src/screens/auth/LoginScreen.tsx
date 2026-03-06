import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { LoginScreenProps } from '../../navigation/types';

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen(_props: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'jake.morrisson@morrissonplumbing.com.au',
      password: 'demo1234',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: 'Please check your credentials and try again.',
      });
    }
  };

  const handleForgotPassword = () => {
    Toast.show({
      type: 'info',
      text1: 'Forgot password?',
      text2: 'Contact your branch for assistance.',
    });
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandSection}>
            <Text style={[Typography.display2, styles.brandText]}>TRADELINK</Text>
            <Text style={[Typography.body, styles.tagline]}>
              Save time. Plumb online.
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <Text style={[Typography.label, styles.fieldLabel]}>EMAIL</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.text.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[Typography.label, styles.fieldLabel]}>PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        errors.password && styles.inputError,
                      ]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.text.tertiary}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={22}
                    color={Colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            <Button
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            />

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={handleForgotPassword}
            >
              <Text style={[Typography.body, styles.forgotText]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[Typography.caption, styles.footerText]}>
            Trade account customers only
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.huge,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  brandText: {
    color: Colors.brand.blue,
    fontWeight: '800',
  },
  tagline: {
    color: Colors.text.secondary,
    opacity: 0.7,
    marginTop: Spacing.sm,
  },
  formSection: {
    gap: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    height: 48,
    paddingHorizontal: Spacing.lg,
    color: Colors.text.primary,
    fontSize: 14,
  },
  inputError: {
    borderColor: Colors.error,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 2,
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
  },
  forgotText: {
    color: Colors.brand.blueLight,
  },
  footerText: {
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },
});
