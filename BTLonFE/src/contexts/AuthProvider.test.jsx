import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';
import authService from '@/services/authService';

// Mock authService
vi.mock('@/services/authService', () => ({
  default: {
    checkToken: vi.fn(),
  }
}));

// Dummy component to consume context
const TestComponent = () => {
  const { user, isAuth, hasRole } = useAuth();
  if (user === undefined) return <div>Loading...</div>;
  if (!isAuth) return <div>Not logged in</div>;
  return (
    <div>
      <span data-testid="user-name">{user.name}</span>
      <span data-testid="is-admin">{hasRole('Super Admin') ? 'Yes' : 'No'}</span>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading initially and resolves to unauthenticated if no token', async () => {
    authService.checkToken.mockRejectedValue(new Error('No token'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  it('authenticates user and checks role correctly', async () => {
    authService.checkToken.mockResolvedValue({
      data: {
        id: 1,
        name: 'Admin User',
        roles: ['Super Admin']
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Admin User');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('Yes');
    });
  });
});
