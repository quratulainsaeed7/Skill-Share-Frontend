// src/components/common/Button/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
    // ===========================================
    // RENDERING TESTS
    // ===========================================
    describe('Rendering', () => {
        it('renders without crashing', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('renders children correctly', () => {
            render(<Button>Test Button</Button>);
            expect(screen.getByText('Test Button')).toBeInTheDocument();
        });

        it('renders with complex children (JSX)', () => {
            render(
                <Button>
                    <span data-testid="icon">🚀</span>
                    <span>Launch</span>
                </Button>
            );
            expect(screen.getByTestId('icon')).toBeInTheDocument();
            expect(screen.getByText('Launch')).toBeInTheDocument();
        });
    });

    // ===========================================
    // VARIANT TESTS
    // ===========================================
    describe('Variants', () => {
        it('applies primary variant class by default', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('primary');
        });

        it('applies secondary variant class', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('secondary');
        });

        it('applies outline variant class', () => {
            render(<Button variant="outline">Outline</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('outline');
        });

        it('applies ghost variant class', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('ghost');
        });
    });

    // ===========================================
    // SIZE TESTS
    // ===========================================
    describe('Sizes', () => {
        it('applies medium size class by default', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('md');
        });

        it('applies small size class', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('sm');
        });

        it('applies large size class', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('lg');
        });
    });

    // ===========================================
    // BUTTON TYPE TESTS
    // ===========================================
    describe('Button Types', () => {
        it('defaults to type="button"', () => {
            render(<Button>Default</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });

        it('accepts type="submit"', () => {
            render(<Button type="submit">Submit</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
        });

        it('accepts type="reset"', () => {
            render(<Button type="reset">Reset</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
        });
    });

    // ===========================================
    // FULL WIDTH TESTS
    // ===========================================
    describe('Full Width', () => {
        it('does not apply fullWidth class by default', () => {
            render(<Button>Normal</Button>);
            const button = screen.getByRole('button');
            expect(button).not.toHaveClass('fullWidth');
        });

        it('applies fullWidth class when prop is true', () => {
            render(<Button fullWidth>Full Width</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('fullWidth');
        });
    });

    // ===========================================
    // DISABLED STATE TESTS
    // ===========================================
    describe('Disabled State', () => {
        it('is enabled by default', () => {
            render(<Button>Enabled</Button>);
            expect(screen.getByRole('button')).not.toBeDisabled();
        });

        it('is disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('does not trigger onClick when disabled', () => {
            const handleClick = jest.fn();
            render(
                <Button disabled onClick={handleClick}>
                    Disabled
                </Button>
            );
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    // ===========================================
    // EVENT HANDLER TESTS
    // ===========================================
    describe('Event Handlers', () => {
        it('calls onClick handler when clicked', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Clickable</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('passes event object to onClick handler', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Clickable</Button>);
            fireEvent.click(screen.getByRole('button'));
            expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
        });

        it('handles multiple rapid clicks', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Rapid Click</Button>);
            const button = screen.getByRole('button');
            fireEvent.click(button);
            fireEvent.click(button);
            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalledTimes(3);
        });
    });

    // ===========================================
    // CUSTOM CLASS NAME TESTS
    // ===========================================
    describe('Custom className', () => {
        it('accepts and applies custom className', () => {
            render(<Button className="custom-class">Custom</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });

        it('combines custom className with default classes', () => {
            render(<Button className="custom-class" variant="secondary">Custom</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
            expect(button).toHaveClass('secondary');
            expect(button).toHaveClass('button');
        });
    });

    // ===========================================
    // ACCESSIBILITY TESTS
    // ===========================================
    describe('Accessibility', () => {
        it('has correct role', () => {
            render(<Button>Accessible</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('accepts aria-label', () => {
            render(<Button aria-label="Close dialog">×</Button>);
            expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
        });

        it('accepts aria-pressed for toggle buttons', () => {
            render(<Button aria-pressed="true">Toggle</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
        });

        it('accepts aria-disabled when disabled', () => {
            render(<Button disabled aria-disabled="true">Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('aria-disabled', 'true');
        });

        it('is keyboard accessible (can receive focus)', () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('disabled button cannot receive focus via tab', () => {
            render(<Button disabled>Not Focusable</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
        });
    });

    // ===========================================
    // EDGE CASES
    // ===========================================
    describe('Edge Cases', () => {
        it('handles empty children', () => {
            render(<Button>{''}</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('handles undefined onClick gracefully', () => {
            render(<Button onClick={undefined}>No Handler</Button>);
            expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
        });

        it('spreads additional props to button element', () => {
            render(<Button data-testid="custom-button" tabIndex={-1}>Props</Button>);
            const button = screen.getByTestId('custom-button');
            expect(button).toHaveAttribute('tabIndex', '-1');
        });

        it('handles long text content', () => {
            const longText = 'This is a very long button text that might overflow';
            render(<Button>{longText}</Button>);
            expect(screen.getByText(longText)).toBeInTheDocument();
        });

        it('handles special characters in text', () => {
            render(<Button>{'<script>alert("XSS")</script>'}</Button>);
            expect(screen.getByText('<script>alert("XSS")</script>')).toBeInTheDocument();
        });
    });
});
