declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class MaterialIcons extends Component<IconProps> {}
}

declare module 'react-native-linear-gradient' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
  }

  export default class LinearGradient extends Component<LinearGradientProps> {}
}

declare module 'react-native-skeleton-placeholder' {
  import { Component } from 'react';

  interface SkeletonPlaceholderProps {
    backgroundColor?: string;
    highlightColor?: string;
    speed?: number;
    children?: React.ReactNode;
  }

  export default class SkeletonPlaceholder extends Component<SkeletonPlaceholderProps> {}
}

declare module 'react-native-haptic-feedback' {
  interface HapticOptions {
    enableVibrateFallback?: boolean;
    ignoreAndroidSystemSettings?: boolean;
  }

  type HapticType =
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError'
    | 'selection';

  const HapticFeedback: {
    trigger: (type: HapticType, options?: HapticOptions) => void;
  };

  export default HapticFeedback;
}

declare module 'react-native-biometrics' {
  interface IsSensorAvailableResult {
    available: boolean;
    biometryType?: string;
  }

  interface SimplePromptResult {
    success: boolean;
  }

  export default class ReactNativeBiometrics {
    isSensorAvailable(): Promise<IsSensorAvailableResult>;
    simplePrompt(options: { promptMessage: string }): Promise<SimplePromptResult>;
  }
}

declare module 'react-native-toast-message' {
  import { ComponentType } from 'react';

  export interface BaseToastProps {
    text1?: string;
    text2?: string;
    type?: string;
    position?: string;
    visibilityTime?: number;
    autoHide?: boolean;
    topOffset?: number;
    bottomOffset?: number;
    onShow?: () => void;
    onHide?: () => void;
    onPress?: () => void;
  }

  export interface ToastShowParams {
    type?: string;
    text1?: string;
    text2?: string;
    position?: 'top' | 'bottom';
    visibilityTime?: number;
    autoHide?: boolean;
    topOffset?: number;
    bottomOffset?: number;
    onShow?: () => void;
    onHide?: () => void;
    onPress?: () => void;
  }

  export interface ToastProps {
    config?: Record<string, ComponentType<BaseToastProps>>;
    position?: 'top' | 'bottom';
    topOffset?: number;
    bottomOffset?: number;
  }

  const Toast: React.FC<ToastProps> & {
    show: (params: ToastShowParams) => void;
    hide: () => void;
  };

  export default Toast;
}
