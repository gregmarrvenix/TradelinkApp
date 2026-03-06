import { useAuthStore } from '../../src/store/authStore';
import { apiClient } from '../../src/api/client';

jest.mock('../../src/api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const mockedApiPost = apiClient.post as jest.Mock;

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });
    jest.clearAllMocks();
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('login sets user, token, and isAuthenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      company: 'Test Co',
      accountNumber: 'TL-001',
      role: 'admin' as const,
      branchId: 'b1',
    };
    const mockToken = 'jwt-token-123';

    mockedApiPost.mockResolvedValueOnce({ token: mockToken, user: mockUser });

    await useAuthStore.getState().login('test@test.com', 'password');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isLoading).toBe(false);
  });

  it('login sets isLoading during request', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockedApiPost.mockReturnValueOnce(promise);

    const loginPromise = useAuthStore.getState().login('test@test.com', 'password');

    expect(useAuthStore.getState().isLoading).toBe(true);

    resolvePromise!({ token: 'tok', user: { id: '1', email: 'test@test.com', name: 'T', company: 'C', accountNumber: 'A', role: 'admin', branchId: 'b' } });
    await loginPromise;

    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('login throws and resets isLoading on error', async () => {
    mockedApiPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      useAuthStore.getState().login('test@test.com', 'wrong'),
    ).rejects.toThrow('Network error');

    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('logout clears user, token, and isAuthenticated', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'a@b.com', name: 'A', company: 'C', accountNumber: 'X', role: 'admin', branchId: 'b' },
      isAuthenticated: true,
      token: 'tok',
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('setUser sets user and isAuthenticated', () => {
    const user = { id: '1', email: 'a@b.com', name: 'A', company: 'C', accountNumber: 'X', role: 'buyer' as const, branchId: 'b' };
    useAuthStore.getState().setUser(user);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });
});
