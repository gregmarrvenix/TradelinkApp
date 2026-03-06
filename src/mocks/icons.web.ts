import React from 'react';
import { Text, Platform } from 'react-native';

// Inject Material Icons font into the page
if (typeof document !== 'undefined') {
  const existing = document.querySelector('link[href*="Material+Icons"]');
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }
}

// Material Icons uses underscored names, RN vector icons uses hyphenated
function toMaterialName(name: string) {
  return name.replace(/-/g, '_');
}

const MaterialIcons = ({ name, size = 24, color = '#000', style }: any) => {
  return React.createElement('span', {
    className: 'material-icons',
    style: {
      fontSize: size,
      color,
      userSelect: 'none',
      direction: 'ltr',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    },
  }, toMaterialName(name));
};

MaterialIcons.getImageSource = () => Promise.resolve({ uri: '' });
MaterialIcons.getImageSourceSync = () => ({ uri: '' });
MaterialIcons.loadFont = () => Promise.resolve();
MaterialIcons.hasIcon = () => true;

export default MaterialIcons;
