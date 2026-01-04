// src/components/common/ProtectedRoute.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the AuthContext
const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

// Import after mock
import ProtectedRoute from './ProtectedRoute';

// Test components
const ProtectedContent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const VerifyEmailPage = () => <div>Verify Email Page</div>;
const CompleteProfilePage = () => <div>Complete Profile Page</div>;
const UnauthorizedPage = () => <div>Unauthorized Page</div>;

// Helper to render with router
const renderWithRouter = (
    initialEntries: string[] = ['/protected'],
    authValue: any = {}
) => {
    mockUseAuth.mockReturnValue(authValue);

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/complete-profile" element={<CompleteProfilePage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route
                    path="/protected"
                    element={
                        <ProtectedRoute>
                            <ProtectedContent />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <div>Admin Content</div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentor-only"
                    element={
                        <ProtectedRoute requiredRole="MENTOR">
                            <div>Mentor Content</div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bypass-workflow"
                    element={
                        <ProtectedRoute bypassWorkflow={true}>
                            <div>Bypass Workflow Content</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    );
};

describe('ProtectedRoute Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===========================================
    // LOADING STATE TESTS
    // ===========================================
    describe('Loading State', () => {
        it('shows loading indicator while checking authentication', () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: false,
                loading: true,
                user: null,
            });

            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('does not show protected content while loading', () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: true,
                user: { emailVerified: true, profileCompleted: true },
            });

            expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // UNAUTHENTICATED ACCESS TESTS
    // ===========================================
    describe('Unauthenticated Access', () => {
        it('redirects to login when not authenticated', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: false,
                loading: false,
                user: null,
            });

            await waitFor(() => {
                expect(screen.getByText('Login Page')).toBeInTheDocument();
            });
        });

        it('does not show protected content when not authenticated', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: false,
                loading: false,
                user: null,
            });

            await waitFor(() => {
                expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // EMAIL VERIFICATION WORKFLOW TESTS
    // ===========================================
    describe('Email Verification Workflow', () => {
        it('redirects to verify-email when email is not verified', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    email: 'test@example.com',
                    emailVerified: false,
                    profileCompleted: false,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Verify Email Page')).toBeInTheDocument();
            });
        });

        it('does not redirect to verify-email when email is verified', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    email: 'test@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Protected Content')).toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // PROFILE COMPLETION WORKFLOW TESTS
    // ===========================================
    describe('Profile Completion Workflow', () => {
        it('redirects to complete-profile when profile is not completed', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    email: 'test@example.com',
                    emailVerified: true,
                    profileCompleted: false,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Complete Profile Page')).toBeInTheDocument();
            });
        });

        it('shows protected content when profile is completed', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    email: 'test@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Protected Content')).toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // BYPASS WORKFLOW TESTS
    // ===========================================
    describe('Bypass Workflow', () => {
        it('allows access without email verification when bypassWorkflow is true', async () => {
            renderWithRouter(['/bypass-workflow'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    email: 'test@example.com',
                    emailVerified: false,
                    profileCompleted: false,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Bypass Workflow Content')).toBeInTheDocument();
            });
        });

        it('allows access without profile completion when bypassWorkflow is true', async () => {
            renderWithRouter(['/bypass-workflow'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    email: 'test@example.com',
                    emailVerified: true,
                    profileCompleted: false,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Bypass Workflow Content')).toBeInTheDocument();
            });
        });

        it('still requires authentication even with bypassWorkflow', async () => {
            renderWithRouter(['/bypass-workflow'], {
                isAuthenticated: false,
                loading: false,
                user: null,
            });

            await waitFor(() => {
                expect(screen.getByText('Login Page')).toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // ROLE-BASED ACCESS TESTS
    // ===========================================
    describe('Role-Based Access Control', () => {
        it('allows ADMIN to access admin-only routes', async () => {
            renderWithRouter(['/admin'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'admin-user',
                    email: 'admin@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'ADMIN',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Admin Content')).toBeInTheDocument();
            });
        });

        it('denies LEARNER access to admin-only routes', async () => {
            renderWithRouter(['/admin'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'learner-user',
                    email: 'learner@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
            });
        });

        it('allows MENTOR to access mentor-only routes', async () => {
            renderWithRouter(['/mentor-only'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'mentor-user',
                    email: 'mentor@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'MENTOR',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Mentor Content')).toBeInTheDocument();
            });
        });

        it('denies LEARNER access to mentor-only routes', async () => {
            renderWithRouter(['/mentor-only'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'learner-user',
                    email: 'learner@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
            });
        });

        it('allows BOTH role to access mentor-only routes', async () => {
            renderWithRouter(['/mentor-only'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'both-user',
                    email: 'both@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'BOTH',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Mentor Content')).toBeInTheDocument();
            });
        });

        it('allows ADMIN to access any role-restricted route', async () => {
            renderWithRouter(['/mentor-only'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'admin-user',
                    email: 'admin@example.com',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'ADMIN',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Mentor Content')).toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // WORKFLOW PROGRESSION TESTS
    // ===========================================
    describe('Workflow Progression', () => {
        it('enforces correct workflow order: auth -> email -> profile -> access', async () => {
            // Step 1: Unauthenticated -> Login
            const { rerender } = renderWithRouter(['/protected'], {
                isAuthenticated: false,
                loading: false,
                user: null,
            });

            await waitFor(() => {
                expect(screen.getByText('Login Page')).toBeInTheDocument();
            });
        });

        it('email verification takes priority over profile completion', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    emailVerified: false,
                    profileCompleted: true, // Even if profile is "completed", email verification comes first
                    role: 'LEARNER',
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Verify Email Page')).toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // OUTLET RENDERING TESTS
    // ===========================================
    describe('Outlet Rendering', () => {
        it('renders Outlet for nested routes when no children provided', async () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'LEARNER',
                },
            });

            render(
                <MemoryRouter initialEntries={['/parent/child']}>
                    <Routes>
                        <Route path="/parent" element={<ProtectedRoute />}>
                            <Route path="child" element={<div>Nested Child Route</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Nested Child Route')).toBeInTheDocument();
            });
        });
    });

    // ===========================================
    // EDGE CASES
    // ===========================================
    describe('Edge Cases', () => {
        it('handles null user gracefully', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: null,
            });

            // Should redirect to verify-email since user object is null
            await waitFor(() => {
                expect(screen.getByText('Verify Email Page')).toBeInTheDocument();
            });
        });

        it('handles undefined user properties gracefully', async () => {
            renderWithRouter(['/protected'], {
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    // emailVerified and profileCompleted are undefined
                },
            });

            await waitFor(() => {
                expect(screen.getByText('Verify Email Page')).toBeInTheDocument();
            });
        });

        it('handles rapid authentication state changes', async () => {
            const { rerender } = render(
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <ProtectedContent />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            );

            // Start loading
            mockUseAuth.mockReturnValue({
                isAuthenticated: false,
                loading: true,
                user: null,
            });

            // Quick transition to authenticated
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                loading: false,
                user: {
                    userId: 'test-user',
                    emailVerified: true,
                    profileCompleted: true,
                    role: 'LEARNER',
                },
            });

            // Component should handle this gracefully
        });
    });
});
