import { useState, useEffect } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export function useBiometrics() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string | undefined>();

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      setIsAvailable(available);
      setBiometryType(biometryType);
    } catch {
      setIsAvailable(false);
    }
  };

  const authenticate = async (promptMessage = 'Confirm your identity'): Promise<boolean> => {
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch {
      return false;
    }
  };

  return { isAvailable, biometryType, authenticate };
}
