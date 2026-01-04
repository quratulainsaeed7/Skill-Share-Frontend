// src/test/utils/test-utils.tsx
// Custom render function with providers for testing

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock user data for testing
export const mockUsers = {
    learner: {
        userId: 'test-learner-123',
        email: 'learner@test.com',
        name: 'Test Learner',
        role: 'LEARNER' as const,
        emailVerified: true,
        profileCompleted: true,
    },
    mentor: {
        userId: 'test-mentor-456',
        email: 'mentor@test.com',
        name: 'Test Mentor',
        role: 'MENTOR' as const,
        emailVerified: true,
        profileCompleted: true,
    },
    admin: {
        userId: 'test-admin-789',
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'ADMIN' as const,
        emailVerified: true,
        profileCompleted: true,
    },
    unverifiedUser: {
        userId: 'test-unverified-user',
        email: 'unverified@test.com',
        name: 'Unverified User',
        role: 'LEARNER' as const,
        emailVerified: false,
        profileCompleted: false,
    },
    incompleteProfile: {
        userId: 'test-incomplete-profile',
        email: 'incomplete@test.com',
        name: 'Incomplete Profile',
        role: 'LEARNER' as const,
        emailVerified: true,
        profileCompleted: false,
    },
};

// Mock auth context value type
interface MockAuthContextValue {
    user: typeof mockUsers.learner | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: jest.Mock;
    signup: jest.Mock;
    logout: jest.Mock;
    updateUser: jest.Mock;
    verifyEmail: jest.Mock;
    completeProfile: jest.Mock;
}

// Create a mock auth context
export const createMockAuthContext = (
    overrides: Partial<MockAuthContextValue> = {}
): MockAuthContextValue => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    verifyEmail: jest.fn(),
    completeProfile: jest.fn(),
    ...overrides,
});

// Mock Auth Provider for testing
interface MockAuthProviderProps {
    children: ReactNode;
    value?: Partial<MockAuthContextValue>;
}

const MockAuthContext = React.createContext<MockAuthContextValue | null>(null);

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({
    children,
    value = {},
}) => {
    const contextValue = createMockAuthContext(value);
    return (
        <MockAuthContext.Provider value={contextValue}>
            {children}
        </MockAuthContext.Provider>
    );
};

// Props for custom render
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    route?: string;
    authState?: Partial<MockAuthContextValue>;
    useMemoryRouter?: boolean;
    initialEntries?: string[];
}

// All providers wrapper
interface AllProvidersProps {
    children: ReactNode;
    authState?: Partial<MockAuthContextValue>;
    initialEntries?: string[];
    useMemoryRouter?: boolean;
}

const AllProviders: React.FC<AllProvidersProps> = ({
    children,
    authState,
    initialEntries = ['/'],
    useMemoryRouter = true,
}) => {
    const Router = useMemoryRouter ? MemoryRouter : BrowserRouter;
    const routerProps = useMemoryRouter ? { initialEntries } : {};

    return (
        <ThemeProvider>
            <MockAuthProvider value={authState}>
                <Router {...routerProps}>{children}</Router>
            </MockAuthProvider>
        </ThemeProvider>
    );
};

// Custom render function
export const customRender = (
    ui: ReactElement,
    options: CustomRenderOptions = {}
): RenderResult => {
    const {
        route = '/',
        authState,
        useMemoryRouter = true,
        initialEntries = [route],
        ...renderOptions
    } = options;

    return render(ui, {
        wrapper: ({ children }) => (
            <AllProviders
                authState={authState}
                initialEntries={initialEntries}
                useMemoryRouter={useMemoryRouter}
            >
                {children}
            </AllProviders>
        ),
        ...renderOptions,
    });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };

// Utility for waiting for loading states
export const waitForLoadingToFinish = async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 0));
};

// Mock fetch utility
export const mockFetch = (response: any, status = 200): jest.Mock => {
    return jest.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
    });
};

// Mock fetch error
export const mockFetchError = (message: string): jest.Mock => {
    return jest.fn().mockRejectedValue(new Error(message));
};
