import React from 'react';

const Toast = ({ config, ...props }: any) => null;

Toast.show = (options: any) => {
  console.log('[Toast]', options?.type, options?.text1);
};
Toast.hide = () => {};

export default Toast;
export const BaseToast = () => null;
export const ErrorToast = () => null;
