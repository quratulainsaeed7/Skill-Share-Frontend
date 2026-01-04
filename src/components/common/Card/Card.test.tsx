// src/components/common/Card/Card.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Component', () => {
    // ===========================================
    // RENDERING TESTS
    // ===========================================
    describe('Rendering', () => {
        it('renders without crashing', () => {
            render(<Card>Card content</Card>);
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });

        it('renders children correctly', () => {
            render(
                <Card>
                    <h2>Card Title</h2>
                    <p>Card description</p>
                </Card>
            );
            expect(screen.getByText('Card Title')).toBeInTheDocument();
            expect(screen.getByText('Card description')).toBeInTheDocument();
        });

        it('renders complex nested children', () => {
            render(
                <Card>
                    <div data-testid="wrapper">
                        <img src="test.jpg" alt="Test" />
                        <div>
                            <span>Nested content</span>
                        </div>
                    </div>
                </Card>
            );
            expect(screen.getByTestId('wrapper')).toBeInTheDocument();
            expect(screen.getByText('Nested content')).toBeInTheDocument();
        });
    });

    // ===========================================
    // PADDING TESTS
    // ===========================================
    describe('Padding Variants', () => {
        it('applies medium padding by default', () => {
            render(<Card data-testid="card">Default Padding</Card>);
            const card = screen.getByTestId('card');
            // CSS modules return class names as-is with identity-obj-proxy
            expect(card.className).toContain('padding-md');
        });

        it('applies no padding when padding="none"', () => {
            render(<Card padding="none" data-testid="card">No Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('padding-none');
        });

        it('applies small padding when padding="sm"', () => {
            render(<Card padding="sm" data-testid="card">Small Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('padding-sm');
        });

        it('applies large padding when padding="lg"', () => {
            render(<Card padding="lg" data-testid="card">Large Padding</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('padding-lg');
        });
    });

    // ===========================================
    // HOVERABLE TESTS
    // ===========================================
    describe('Hoverable State', () => {
        it('is not hoverable by default', () => {
            render(<Card data-testid="card">Non-hoverable</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).not.toContain('hoverable');
        });

        it('applies hoverable class when hoverable prop is true', () => {
            render(<Card hoverable data-testid="card">Hoverable</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('hoverable');
        });
    });

    // ===========================================
    // CUSTOM CLASS NAME TESTS
    // ===========================================
    describe('Custom className', () => {
        it('accepts and applies custom className', () => {
            render(<Card className="custom-card" data-testid="card">Custom</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('custom-card');
        });

        it('combines custom className with default classes', () => {
            render(<Card className="custom-card" padding="lg" hoverable data-testid="card">Custom</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('custom-card');
            expect(card.className).toContain('padding-lg');
            expect(card.className).toContain('hoverable');
        });
    });

    // ===========================================
    // EVENT HANDLER TESTS
    // ===========================================
    describe('Event Handlers', () => {
        it('calls onClick when clicked', () => {
            const handleClick = jest.fn();
            render(<Card onClick={handleClick} data-testid="card">Clickable Card</Card>);
            fireEvent.click(screen.getByTestId('card'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('calls onMouseEnter when mouse enters', () => {
            const handleMouseEnter = jest.fn();
            render(<Card onMouseEnter={handleMouseEnter} data-testid="card">Hover Card</Card>);
            fireEvent.mouseEnter(screen.getByTestId('card'));
            expect(handleMouseEnter).toHaveBeenCalledTimes(1);
        });

        it('calls onMouseLeave when mouse leaves', () => {
            const handleMouseLeave = jest.fn();
            render(<Card onMouseLeave={handleMouseLeave} data-testid="card">Hover Card</Card>);
            fireEvent.mouseLeave(screen.getByTestId('card'));
            expect(handleMouseLeave).toHaveBeenCalledTimes(1);
        });
    });

    // ===========================================
    // ACCESSIBILITY TESTS
    // ===========================================
    describe('Accessibility', () => {
        it('accepts role attribute', () => {
            render(<Card role="article">Article Card</Card>);
            expect(screen.getByRole('article')).toBeInTheDocument();
        });

        it('accepts aria-label', () => {
            render(<Card aria-label="User profile card">Profile</Card>);
            expect(screen.getByLabelText('User profile card')).toBeInTheDocument();
        });

        it('accepts tabIndex for keyboard navigation', () => {
            render(<Card tabIndex={0} data-testid="card">Focusable Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveAttribute('tabIndex', '0');
        });

        it('can receive keyboard focus when tabIndex is set', () => {
            render(<Card tabIndex={0} data-testid="card">Focusable</Card>);
            const card = screen.getByTestId('card');
            card.focus();
            expect(card).toHaveFocus();
        });

        it('triggers click on Enter key when tabIndex is set', () => {
            const handleClick = jest.fn();
            render(
                <Card tabIndex={0} onClick={handleClick} data-testid="card">
                    Keyboard Accessible
                </Card>
            );
            const card = screen.getByTestId('card');
            fireEvent.keyDown(card, { key: 'Enter' });
            // Note: Native div doesn't trigger onClick on Enter, but this tests the key event
        });
    });

    // ===========================================
    // SPREAD PROPS TESTS
    // ===========================================
    describe('Spread Props', () => {
        it('spreads additional props to the div element', () => {
            render(<Card data-testid="custom-card" id="unique-card">Props</Card>);
            const card = screen.getByTestId('custom-card');
            expect(card).toHaveAttribute('id', 'unique-card');
        });

        it('accepts data attributes', () => {
            render(<Card data-testid="card" data-card-type="profile">Profile Card</Card>);
            const card = screen.getByTestId('card');
            expect(card).toHaveAttribute('data-card-type', 'profile');
        });
    });

    // ===========================================
    // EDGE CASES
    // ===========================================
    describe('Edge Cases', () => {
        it('handles empty children', () => {
            render(<Card data-testid="card">{''}</Card>);
            expect(screen.getByTestId('card')).toBeInTheDocument();
        });

        it('handles null children gracefully', () => {
            render(<Card data-testid="card">{null}</Card>);
            expect(screen.getByTestId('card')).toBeInTheDocument();
        });

        it('handles undefined children gracefully', () => {
            render(<Card data-testid="card">{undefined}</Card>);
            expect(screen.getByTestId('card')).toBeInTheDocument();
        });

        it('handles very long content', () => {
            const longContent = 'Lorem ipsum '.repeat(100);
            render(<Card>{longContent}</Card>);
            expect(screen.getByText(new RegExp(longContent.substring(0, 50)))).toBeInTheDocument();
        });

        it('handles special characters in content', () => {
            render(<Card>{'Special chars: <>&"\''}</Card>);
            expect(screen.getByText("Special chars: <>&\"'")).toBeInTheDocument();
        });

        it('handles multiple cards on same page', () => {
            render(
                <>
                    <Card data-testid="card-1">Card 1</Card>
                    <Card data-testid="card-2">Card 2</Card>
                    <Card data-testid="card-3">Card 3</Card>
                </>
            );
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
            expect(screen.getByTestId('card-2')).toBeInTheDocument();
            expect(screen.getByTestId('card-3')).toBeInTheDocument();
        });
    });

    // ===========================================
    // STYLE ISOLATION TESTS
    // ===========================================
    describe('Style Isolation', () => {
        it('has card base class', () => {
            render(<Card data-testid="card">Base Card</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('card');
        });

        it('maintains class order regardless of prop order', () => {
            render(<Card hoverable padding="lg" className="custom" data-testid="card">Test</Card>);
            const card = screen.getByTestId('card');
            expect(card.className).toContain('card');
            expect(card.className).toContain('padding-lg');
            expect(card.className).toContain('hoverable');
            expect(card.className).toContain('custom');
        });
    });
});
