import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ children, colors, style, ...props }: any) => {
  const gradientStyle = colors && colors.length > 0
    ? { background: `linear-gradient(135deg, ${colors.join(', ')})` }
    : {};

  return React.createElement(View, {
    ...props,
    style: [style, gradientStyle],
  }, children);
};

export default LinearGradient;
