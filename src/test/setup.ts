// src/test/setup.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for react-router-dom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock environment variables using process.env for Jest compatibility
// @ts-ignore
globalThis.import_meta_env = {
    VITE_API_BASE_URL: 'http://localhost:3000',
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
};

// Mock import.meta.env for modules that use it
// @ts-ignore
globalThis.__VITE_ENV__ = {
    VITE_API_BASE_URL: 'http://localhost:3000',
};

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
    root: Element | null = null;
    rootMargin: string = '';
    thresholds: readonly number[] = [];

    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Suppress console errors during tests (optional, remove if you want to see them)
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});
