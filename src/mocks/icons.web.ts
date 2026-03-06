import React from 'react';
import { Text } from 'react-native';

const MaterialIcons = ({ name, size, color, style, ...props }: any) => {
  return React.createElement(Text, {
    ...props,
    style: [{ fontSize: size || 24, color: color || '#888' }, style],
  }, '\u25CF');
};

export default MaterialIcons;
