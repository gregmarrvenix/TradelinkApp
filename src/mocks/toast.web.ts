import React from 'react';

const TOAST_COLORS: Record<string, { bg: string; border: string }> = {
  success: { bg: '#E8F5E9', border: '#4CAF50' },
  error: { bg: '#FFEBEE', border: '#E53935' },
  info: { bg: '#E3F2FD', border: '#1B4F7C' },
};

const Toast = ({ config, ...props }: any) => null;

Toast.show = (options: any) => {
  const type = options?.type || 'info';
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;
  const text1 = options?.text1 || '';
  const text2 = options?.text2 || '';

  // Create and show a DOM toast notification
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 99999;
    background: ${colors.bg}; border-left: 4px solid ${colors.border};
    padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 360px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    animation: slideIn 0.3s ease-out;
    transition: opacity 0.3s ease-out;
  `;
  container.innerHTML = `
    <div style="font-weight:600;font-size:14px;color:#333">${text1}</div>
    ${text2 ? `<div style="font-size:12px;color:#666;margin-top:4px">${text2}</div>` : ''}
  `;
  document.body.appendChild(container);
  setTimeout(() => {
    container.style.opacity = '0';
    setTimeout(() => container.remove(), 300);
  }, 3000);
};

Toast.hide = () => {};

export default Toast;
export const BaseToast = () => null;
export const ErrorToast = () => null;
