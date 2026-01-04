// src/context/AuthContext.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the entire authService module before importing AuthContext
jest.mock('../services/authService', () => ({
    authService: {
        login: jest.fn(),
        register: jest.fn(),
        validateToken: jest.fn(),
        refreshToken: jest.fn(),
        clearAuth: jest.fn(),
        getToken: jest.fn(),
        getUser: jest.fn(),
        setToken: jest.fn(),
        setUser: jest.fn(),
        updateProfile: jest.fn(),
    },
}));

// Import after mock is set up
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Cast to mocked type
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Simple test component to access auth context
const TestComponent = () => {
    const auth = useAuth();

    return (
        <div>
            <div data-testid="loading">{String(auth.loading)}</div>
            <div data-testid="authenticated">{String(auth.isAuthenticated)}</div>
            <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
        </div>
    );
};

const renderWithAuthProvider = () => {
    return render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock implementations - no stored token/user
        mockAuthService.getToken.mockReturnValue(null);
        mockAuthService.getUser.mockReturnValue(null);
        mockAuthService.validateToken.mockResolvedValue(false);
        mockAuthService.clearAuth.mockImplementation(() => { });
    });

    // ===========================================
    // INITIALIZATION TESTS
    // ===========================================
    describe('Initialization', () => {
        it('starts in loading state and then completes loading', async () => {
            renderWithAuthProvider();

            // Wait for loading to complete
            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });
        });

        it('initializes with no user when no stored token', async () => {
            mockAuthService.getToken.mockReturnValue(null);
            mockAuthService.getUser.mockReturnValue(null);

            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
            expect(screen.getByTestId('user')).toHaveTextContent('null');
        });

        it('initializes with user when valid stored token exists', async () => {
            const mockUser = {
                userId: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                role: 'LEARNER',
            };

            mockAuthService.getToken.mockReturnValue('valid-token');
            mockAuthService.getUser.mockReturnValue(mockUser);
            mockAuthService.validateToken.mockResolvedValue(true);
            mockAuthService.refreshToken.mockResolvedValue({
                accessToken: 'new-token',
                user: mockUser,
            });

            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            await waitFor(() => {
                expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
            });
        });

        it('clears auth when stored token is invalid', async () => {
            mockAuthService.getToken.mockReturnValue('invalid-token');
            mockAuthService.getUser.mockReturnValue({ id: '123' });
            mockAuthService.validateToken.mockResolvedValue(false);

            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            expect(mockAuthService.clearAuth).toHaveBeenCalled();
            expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        });

        it('falls back to stored data when refresh fails', async () => {
            const mockUser = {
                userId: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
            };

            mockAuthService.getToken.mockReturnValue('valid-token');
            mockAuthService.getUser.mockReturnValue(mockUser);
            mockAuthService.validateToken.mockResolvedValue(true);
            mockAuthService.refreshToken.mockRejectedValue(new Error('Refresh failed'));

            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            // Should still be authenticated using stored data
            await waitFor(() => {
                expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
            });
        });
    });

    // ===========================================
    // ERROR HANDLING TESTS
    // ===========================================
    describe('Error Handling', () => {
        it('handles initialization error gracefully', async () => {
            mockAuthService.getToken.mockReturnValue('token');
            mockAuthService.getUser.mockReturnValue({ id: '123' });
            mockAuthService.validateToken.mockRejectedValue(new Error('Network error'));

            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            expect(mockAuthService.clearAuth).toHaveBeenCalled();
        });
    });

    // ===========================================
    // CONTEXT PROVIDER TESTS
    // ===========================================
    describe('Context Provider', () => {
        it('throws error when useAuth is used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            const TestOutsideProvider = () => {
                useAuth();
                return null;
            };

            expect(() => render(<TestOutsideProvider />)).toThrow(
                'useAuth must be used within an AuthProvider'
            );

            consoleSpy.mockRestore();
        });

        it('provides auth context values to children', async () => {
            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            expect(screen.getByTestId('authenticated')).toBeInTheDocument();
            expect(screen.getByTestId('user')).toBeInTheDocument();
        });
    });

    // ===========================================
    // TOKEN VALIDATION TESTS
    // ===========================================
    describe('Token Validation', () => {
        it('validates token on initialization', async () => {
            mockAuthService.getToken.mockReturnValue('some-token');
            mockAuthService.getUser.mockReturnValue({ id: '123' });
            mockAuthService.validateToken.mockResolvedValue(true);
            mockAuthService.refreshToken.mockResolvedValue({
                accessToken: 'new-token',
                user: { id: '123' },
            });

            renderWithAuthProvider();

            await waitFor(() => {
                expect(mockAuthService.validateToken).toHaveBeenCalledWith('some-token');
            });
        });

        it('does not validate when no stored token', async () => {
            mockAuthService.getToken.mockReturnValue(null);
            mockAuthService.getUser.mockReturnValue(null);

            renderWithAuthProvider();

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toHaveTextContent('false');
            });

            expect(mockAuthService.validateToken).not.toHaveBeenCalled();
        });
    });

    // ===========================================
    // REFRESH TOKEN TESTS  
    // ===========================================
    describe('Token Refresh', () => {
        it('refreshes token when validation succeeds', async () => {
            const mockUser = { userId: 'user-123', name: 'Test' };

            mockAuthService.getToken.mockReturnValue('valid-token');
            mockAuthService.getUser.mockReturnValue(mockUser);
            mockAuthService.validateToken.mockResolvedValue(true);
            mockAuthService.refreshToken.mockResolvedValue({
                accessToken: 'refreshed-token',
                user: mockUser,
            });

            renderWithAuthProvider();

            await waitFor(() => {
                expect(mockAuthService.refreshToken).toHaveBeenCalledWith('user-123');
            });
        });

        it('handles missing userId by using id', async () => {
            const mockUser = { id: 'user-456', name: 'Test' };

            mockAuthService.getToken.mockReturnValue('valid-token');
            mockAuthService.getUser.mockReturnValue(mockUser);
            mockAuthService.validateToken.mockResolvedValue(true);
            mockAuthService.refreshToken.mockResolvedValue({
                accessToken: 'refreshed-token',
                user: mockUser,
            });

            renderWithAuthProvider();

            await waitFor(() => {
                expect(mockAuthService.refreshToken).toHaveBeenCalledWith('user-456');
            });
        });
    });
});
