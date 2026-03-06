import React from 'react';
import { View } from 'react-native';

export const Bar = (props: any) => {
  return React.createElement(View, {
    style: [
      {
        height: 8,
        backgroundColor: '#E6E9EE',
        borderRadius: 4,
        overflow: 'hidden',
      },
      props.style,
    ],
  },
    React.createElement(View, {
      style: {
        height: '100%',
        width: `${(props.progress || 0) * 100}%`,
        backgroundColor: props.color || '#1B4F7C',
        borderRadius: 4,
      },
    })
  );
};

export const Circle = View;
export const Pie = View;
export default { Bar, Circle, Pie };
