import React from 'react';
import { View, Modal as RNModal } from 'react-native';

const Modal = ({ isVisible, children, ...props }: any) => {
  if (!isVisible) return null;
  return React.createElement(RNModal, {
    visible: isVisible,
    transparent: true,
    ...props,
  }, children);
};

export default Modal;
