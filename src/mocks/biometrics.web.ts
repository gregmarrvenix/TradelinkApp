export default class ReactNativeBiometrics {
  async isSensorAvailable() {
    return { available: false, biometryType: null };
  }
  async simplePrompt() {
    return { success: false };
  }
}
