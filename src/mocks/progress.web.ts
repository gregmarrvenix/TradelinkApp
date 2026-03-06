import React from 'react';
import { View } from 'react-native';

export const Bar = (props: any) => {
  return React.createElement(View, {
    style: [
      {
        height: 8,
        backgroundColor: '#3A3A3A',
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
        backgroundColor: props.color || '#D0021B',
        borderRadius: 4,
      },
    })
  );
};

export const Circle = View;
export const Pie = View;
export default { Bar, Circle, Pie };
