import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import { useAuthStore } from '../../src/store/authStore';

// Mock the store
jest.mock('../../src/store/authStore');

// Mock react-hook-form's zodResolver
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(() => ({ values: {}, errors: {} })),
}));

// Mock zod
jest.mock('zod/v4', () => ({
  z: {
    object: jest.fn(() => ({})),
    email: jest.fn(() => ({ message: '' })),
    string: jest.fn(() => ({ min: jest.fn(() => ({ message: '' })) })),
  },
}));

const mockLogin = jest.fn();

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockImplementation((selector: (s: unknown) => unknown) => {
      const state = {
        login: mockLogin,
        isLoading: false,
      };
      return selector(state);
    });
  });

  const defaultProps = {
    navigation: { navigate: jest.fn(), goBack: jest.fn() } as any,
    route: { key: 'login', name: 'Login' as const, params: undefined },
  };

  it('renders the brand text', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('TRADELINK')).toBeTruthy();
  });

  it('renders email and password labels', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('EMAIL')).toBeTruthy();
    expect(getByText('PASSWORD')).toBeTruthy();
  });

  it('renders Sign In button', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('renders forgot password link', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('Forgot password?')).toBeTruthy();
  });

  it('renders trade account notice', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('Trade account customers only')).toBeTruthy();
  });

  it('renders tagline', () => {
    const { getByText } = render(<LoginScreen {...defaultProps} />);
    expect(getByText('Save time. Plumb online.')).toBeTruthy();
  });
});
