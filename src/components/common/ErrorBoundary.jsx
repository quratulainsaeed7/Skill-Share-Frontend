import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ErrorBoundary.css';

/**
 * Production-Grade Error Boundary Component
 * 
 * Catches:
 * - Render crashes
 * - Runtime exceptions
 * - Component tree errors
 * 
 * Features:
 * - Safe fallback UI
 * - Error logging (stack, route, component)
 * - Reset on retry or route change
 * - User-friendly error messages
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        const errorDetails = {
            error: error.toString(),
            stack: errorInfo.componentStack,
            route: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
        };

        console.error('🔥 Error Boundary caught an error:', errorDetails);

        // Log to external service in production (e.g., Sentry)
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { extra: errorInfo });
            this.logErrorToService(errorDetails);
        }

        this.setState({
            error,
            errorInfo,
            errorCount: this.state.errorCount + 1,
        });
    }

    componentDidUpdate(prevProps) {
        // Reset error boundary when route changes
        if (this.props.location !== prevProps.location) {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
            });
        }
    }

    logErrorToService = async (errorDetails) => {
        try {
            // In production, send to error logging service
            // Example: await fetch('/api/errors/log', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(errorDetails),
            // });

            console.log('📤 Error logged:', errorDetails);
        } catch (err) {
            console.error('Failed to log error:', err);
        }
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.href = '/home';
    };

    render() {
        if (this.state.hasError) {
            const isDevelopment = process.env.NODE_ENV === 'development';

            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-content">
                        <div className="error-icon">⚠️</div>
                        <h1 className="error-title">Oops! Something went wrong</h1>
                        <p className="error-message">
                            We're sorry, but something unexpected happened.
                            Our team has been notified and is working on it.
                        </p>

                        <div className="error-actions">
                            <button
                                onClick={this.handleReset}
                                className="error-btn error-btn-primary"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="error-btn error-btn-secondary"
                            >
                                Go to Home
                            </button>
                        </div>

                        {isDevelopment && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development Only)</summary>
                                <div className="error-stack">
                                    <h3>Error:</h3>
                                    <pre>{this.state.error.toString()}</pre>

                                    <h3>Component Stack:</h3>
                                    <pre>{this.state.errorInfo?.componentStack}</pre>
                                </div>
                            </details>
                        )}

                        <div className="error-info">
                            <p className="error-timestamp">
                                Error ID: {new Date().getTime()}
                            </p>
                            {this.state.errorCount > 1 && (
                                <p className="error-count">
                                    ⚠️ This error occurred {this.state.errorCount} times
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Wrapper component to inject location prop
 */
export const ErrorBoundaryWithLocation = ({ children }) => {
    const location = useLocation();
    return <ErrorBoundary location={location}>{children}</ErrorBoundary>;
};

export default ErrorBoundary;
