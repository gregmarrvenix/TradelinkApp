import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal as RNModal } from 'react-native';

const Modal = ({ isVisible, children, onBackdropPress, onBackButtonPress, style, backdropOpacity = 0.5, ...props }: any) => {
  if (!isVisible) return null;
  return React.createElement(RNModal, {
    visible: isVisible,
    transparent: true,
    animationType: 'fade',
    onRequestClose: onBackButtonPress || onBackdropPress,
  },
    React.createElement(View, { style: styles.overlay },
      React.createElement(TouchableOpacity, {
        style: [styles.backdrop, { opacity: backdropOpacity }],
        activeOpacity: backdropOpacity,
        onPress: onBackdropPress,
      }),
      React.createElement(View, {
        style: [styles.content, style],
      }, children),
    ),
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    // content renders on top of backdrop
  },
});

export default Modal;
