import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { triggerHaptic } from '../../utils/haptics';
import { useThemeStore, type ThemeColors } from '../../store/themeStore';
import { useProducts } from '../../hooks/useProducts';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import Button from '../../components/common/Button';
import type { CatalogueBarcodeScanScreenProps } from '../../navigation/types';

let Camera: any = null;
let useCameraDevice: any = null;
let useCameraPermission: any = null;
let useCodeScanner: any = null;

try {
  const visionCamera = require('react-native-vision-camera');
  Camera = visionCamera.Camera;
  useCameraDevice = visionCamera.useCameraDevice;
  useCameraPermission = visionCamera.useCameraPermission;
  useCodeScanner = visionCamera.useCodeScanner;
} catch {
  // vision camera not available (web/emulator fallback)
}

const SCAN_AREA_SIZE = 260;
const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

function ScanCorners() {
  return (
    <>
      {/* Top-left */}
      <View style={[styles.corner, styles.cornerTL]}>
        <View style={[styles.cornerH, { top: 0, left: 0 }]} />
        <View style={[styles.cornerV, { top: 0, left: 0 }]} />
      </View>
      {/* Top-right */}
      <View style={[styles.corner, styles.cornerTR]}>
        <View style={[styles.cornerH, { top: 0, right: 0 }]} />
        <View style={[styles.cornerV, { top: 0, right: 0 }]} />
      </View>
      {/* Bottom-left */}
      <View style={[styles.corner, styles.cornerBL]}>
        <View style={[styles.cornerH, { bottom: 0, left: 0 }]} />
        <View style={[styles.cornerV, { bottom: 0, left: 0 }]} />
      </View>
      {/* Bottom-right */}
      <View style={[styles.corner, styles.cornerBR]}>
        <View style={[styles.cornerH, { bottom: 0, right: 0 }]} />
        <View style={[styles.cornerV, { bottom: 0, right: 0 }]} />
      </View>
    </>
  );
}

function ScanLine() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(SCAN_AREA_SIZE - 4, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.scanLine, animStyle]} />
  );
}

export default function BarcodeScanScreen({ navigation }: CatalogueBarcodeScanScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const insets = useSafeAreaInsets();
  const { data: products } = useProducts();
  const [torchOn, setTorchOn] = useState(false);
  const lastScannedRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef(0);

  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const cameraAvailable = isNative && Camera && useCameraDevice && useCameraPermission;

  const handleCodeScanned = useCallback((code: string) => {
    const now = Date.now();
    if (code === lastScannedRef.current && now - lastScanTimeRef.current < 3000) {
      return;
    }
    lastScannedRef.current = code;
    lastScanTimeRef.current = now;

    const matchedProduct = (products ?? []).find((p) => p.sku === code);
    if (matchedProduct) {
      triggerHaptic('notificationSuccess');
      navigation.navigate('ProductDetail', { productId: matchedProduct.id });
    } else {
      Toast.show({
        type: 'warning',
        text1: 'Product not found',
        text2: `No product matches barcode "${code}"`,
        visibilityTime: 2500,
      });
    }
  }, [products, navigation]);

  const handleSimulateScan = useCallback(() => {
    if (!products?.length) return;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    triggerHaptic('notificationSuccess');
    navigation.navigate('ProductDetail', { productId: randomProduct.id });
  }, [products, navigation]);

  if (cameraAvailable) {
    return (
      <NativeScanView
        colors={colors}
        insets={insets}
        torchOn={torchOn}
        onToggleTorch={() => setTorchOn((t) => !t)}
        onGoBack={() => navigation.goBack()}
        onCodeScanned={handleCodeScanned}
      />
    );
  }

  // Fallback for web/emulator
  return (
    <View style={[styles.container, { backgroundColor: Colors.black }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={[Typography.h4, { color: Colors.white }]}>Scan Product</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.fallbackCenter}>
        <View style={styles.scanAreaContainer}>
          <View style={styles.scanArea}>
            <ScanCorners />
            <ScanLine />
          </View>
        </View>
        <Text style={[Typography.body, { color: Colors.white, textAlign: 'center', marginTop: Spacing.xxl }]}>
          Camera not available in this environment
        </Text>
        <View style={{ marginTop: Spacing.xl }}>
          <Button
            label="Simulate Scan"
            onPress={handleSimulateScan}
            variant="primary"
            icon={<MaterialIcons name="qr-code-scanner" size={20} color={Colors.white} />}
          />
        </View>
      </View>
    </View>
  );
}

interface NativeScanViewProps {
  colors: ThemeColors;
  insets: ReturnType<typeof useSafeAreaInsets>;
  torchOn: boolean;
  onToggleTorch: () => void;
  onGoBack: () => void;
  onCodeScanned: (code: string) => void;
}

function NativeScanView({ colors, insets, torchOn, onToggleTorch, onGoBack, onCodeScanned }: NativeScanViewProps) {
  const device = useCameraDevice!('back');
  const { hasPermission, requestPermission } = useCameraPermission!();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner!({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'upc-a', 'upc-e'],
    onCodeScanned: (codes: Array<{ value?: string }>) => {
      const code = codes[0]?.value;
      if (code) {
        onCodeScanned(code);
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.black }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity onPress={onGoBack} style={styles.headerBtn}>
            <MaterialIcons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={[Typography.h4, { color: Colors.white }]}>Scan Product</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.permissionView}>
          <MaterialIcons name="no-photography" size={48} color={Colors.text.tertiary} />
          <Text style={[Typography.h3, { color: Colors.white, marginTop: Spacing.lg, textAlign: 'center' }]}>
            Camera Permission Required
          </Text>
          <Text style={[Typography.body, { color: Colors.text.secondary, marginTop: Spacing.sm, textAlign: 'center' }]}>
            Please allow camera access to scan barcodes
          </Text>
          <View style={{ marginTop: Spacing.xl }}>
            <Button label="Open Settings" onPress={() => Linking.openSettings()} variant="outline" />
          </View>
        </View>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.black }]}>
        <Text style={[Typography.body, { color: Colors.white, textAlign: 'center', marginTop: 100 }]}>
          No camera device found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        torch={torchOn ? 'on' : 'off'}
        codeScanner={codeScanner}
      />

      {/* Overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top dark overlay */}
        <View style={styles.overlayTop} />
        {/* Middle row */}
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanArea}>
              <ScanCorners />
              <ScanLine />
            </View>
          </View>
          <View style={styles.overlaySide} />
        </View>
        {/* Bottom dark overlay */}
        <View style={styles.overlayBottom} />
      </View>

      {/* Instruction text */}
      <View style={[styles.instructionWrap, { top: insets.top + 80 }]}>
        <Text style={[Typography.body, { color: Colors.white, textAlign: 'center' }]}>
          Scan a barcode or QR code
        </Text>
      </View>

      {/* Header buttons */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={onGoBack} style={styles.headerBtn}>
          <MaterialIcons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={[Typography.h4, { color: Colors.white }]}>Scan Product</Text>
        <TouchableOpacity onPress={onToggleTorch} style={styles.headerBtn}>
          <MaterialIcons name={torchOn ? 'flash-on' : 'flash-off'} size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  headerBtn: { width: 40, alignItems: 'center' },
  instructionWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  scanAreaContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: CORNER_SIZE,
    right: CORNER_SIZE,
    height: 2,
    backgroundColor: Colors.brand.blue,
    top: 0,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: { top: 0, left: 0 },
  cornerTR: { top: 0, right: 0 },
  cornerBL: { bottom: 0, left: 0 },
  cornerBR: { bottom: 0, right: 0 },
  cornerH: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_WIDTH,
    backgroundColor: Colors.brand.blue,
  },
  cornerV: {
    position: 'absolute',
    width: CORNER_WIDTH,
    height: CORNER_SIZE,
    backgroundColor: Colors.brand.blue,
  },
  permissionView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  fallbackCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
