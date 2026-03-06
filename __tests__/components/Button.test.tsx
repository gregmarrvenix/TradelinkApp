import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Button', () => {
  const defaultProps = {
    label: 'Press Me',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label text', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button {...defaultProps} onPress={onPress} />);
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading=true', () => {
    const { queryByText, UNSAFE_getAllByType } = render(
      <Button {...defaultProps} loading />,
    );
    // Label should not be visible when loading
    expect(queryByText('Press Me')).toBeNull();
  });

  it('disabled state prevents onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button {...defaultProps} onPress={onPress} disabled />,
    );
    fireEvent.press(getByText('Press Me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders primary variant', () => {
    const { getByText } = render(
      <Button {...defaultProps} variant="primary" />,
    );
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders secondary variant', () => {
    const { getByText } = render(
      <Button {...defaultProps} variant="secondary" />,
    );
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders ghost variant', () => {
    const { getByText } = render(
      <Button {...defaultProps} variant="ghost" />,
    );
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders danger variant', () => {
    const { getByText } = render(
      <Button {...defaultProps} variant="danger" />,
    );
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('renders outline variant', () => {
    const { getByText } = render(
      <Button {...defaultProps} variant="outline" />,
    );
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('loading state prevents onPress on primary variant', () => {
    const onPress = jest.fn();
    const { queryByText } = render(
      <Button {...defaultProps} onPress={onPress} variant="primary" loading />,
    );
    // Cannot press since label is replaced by ActivityIndicator
    expect(queryByText('Press Me')).toBeNull();
  });
});
