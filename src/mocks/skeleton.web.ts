import React from 'react';
import { View } from 'react-native';

const SkeletonPlaceholder = ({ children }: any) => children || null;
SkeletonPlaceholder.Item = View;

export default SkeletonPlaceholder;
