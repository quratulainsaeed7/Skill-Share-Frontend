// src/components/common/Input/Input.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from './Input';

describe('Input Component', () => {
    // ===========================================
    // RENDERING TESTS
    // ===========================================
    describe('Rendering', () => {
        it('renders without crashing', () => {
            render(<Input />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('renders with label', () => {
            render(<Input label="Email" />);
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        it('renders with placeholder', () => {
            render(<Input placeholder="Enter your email" />);
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });

        it('renders without label when not provided', () => {
            render(<Input data-testid="no-label-input" />);
            expect(screen.getByTestId('no-label-input')).toBeInTheDocument();
            expect(screen.queryByRole('label')).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // INPUT TYPE TESTS
    // ===========================================
    describe('Input Types', () => {
        it('defaults to type="text"', () => {
            render(<Input />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
        });

        it('accepts type="email"', () => {
            render(<Input type="email" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
        });

        it('accepts type="password"', () => {
            render(<Input type="password" data-testid="password-input" />);
            expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
        });

        it('accepts type="number"', () => {
            render(<Input type="number" />);
            expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
        });

        it('accepts type="tel"', () => {
            render(<Input type="tel" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
        });

        it('accepts type="url"', () => {
            render(<Input type="url" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'url');
        });
    });

    // ===========================================
    // ERROR STATE TESTS
    // ===========================================
    describe('Error State', () => {
        it('displays error message when error prop is provided', () => {
            render(<Input error="This field is required" />);
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('applies error styling class when error prop is provided', () => {
            render(<Input error="Error" data-testid="error-input" />);
            expect(screen.getByTestId('error-input')).toHaveClass('errorInput');
        });

        it('does not show helper text when error is present', () => {
            render(<Input error="Error message" helperText="Helper text" />);
            expect(screen.getByText('Error message')).toBeInTheDocument();
            expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // HELPER TEXT TESTS
    // ===========================================
    describe('Helper Text', () => {
        it('displays helper text when provided', () => {
            render(<Input helperText="Enter a valid email address" />);
            expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
        });

        it('does not display helper text when not provided', () => {
            render(<Input />);
            expect(screen.queryByText(/helper/i)).not.toBeInTheDocument();
        });
    });

    // ===========================================
    // DISABLED STATE TESTS
    // ===========================================
    describe('Disabled State', () => {
        it('is enabled by default', () => {
            render(<Input />);
            expect(screen.getByRole('textbox')).not.toBeDisabled();
        });

        it('is disabled when disabled prop is true', () => {
            render(<Input disabled />);
            expect(screen.getByRole('textbox')).toBeDisabled();
        });

        it('does not allow input when disabled', async () => {
            const handleChange = jest.fn();
            render(<Input disabled onChange={handleChange} />);
            const input = screen.getByRole('textbox');

            // Attempt to type in disabled input
            await userEvent.type(input, 'test');
            expect(handleChange).not.toHaveBeenCalled();
            expect(input).toHaveValue('');
        });
    });

    // ===========================================
    // EVENT HANDLER TESTS
    // ===========================================
    describe('Event Handlers', () => {
        it('calls onChange when value changes', async () => {
            const handleChange = jest.fn();
            render(<Input onChange={handleChange} />);

            await userEvent.type(screen.getByRole('textbox'), 'test');
            expect(handleChange).toHaveBeenCalled();
        });

        it('calls onFocus when input receives focus', () => {
            const handleFocus = jest.fn();
            render(<Input onFocus={handleFocus} />);

            fireEvent.focus(screen.getByRole('textbox'));
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });

        it('calls onBlur when input loses focus', () => {
            const handleBlur = jest.fn();
            render(<Input onBlur={handleBlur} />);

            const input = screen.getByRole('textbox');
            fireEvent.focus(input);
            fireEvent.blur(input);
            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it('calls onKeyDown when key is pressed', () => {
            const handleKeyDown = jest.fn();
            render(<Input onKeyDown={handleKeyDown} />);

            fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
            expect(handleKeyDown).toHaveBeenCalledTimes(1);
        });

        it('calls onKeyUp when key is released', () => {
            const handleKeyUp = jest.fn();
            render(<Input onKeyUp={handleKeyUp} />);

            fireEvent.keyUp(screen.getByRole('textbox'), { key: 'a' });
            expect(handleKeyUp).toHaveBeenCalledTimes(1);
        });
    });

    // ===========================================
    // CONTROLLED INPUT TESTS
    // ===========================================
    describe('Controlled Input', () => {
        it('displays controlled value', () => {
            render(<Input value="controlled value" onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue('controlled value');
        });

        it('updates when controlled value changes', () => {
            const { rerender } = render(<Input value="initial" onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue('initial');

            rerender(<Input value="updated" onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue('updated');
        });
    });

    // ===========================================
    // ACCESSIBILITY TESTS
    // ===========================================
    describe('Accessibility', () => {
        it('associates label with input via htmlFor', () => {
            render(<Input label="Username" id="username-input" />);
            const input = screen.getByLabelText('Username');
            expect(input).toBeInTheDocument();
        });

        it('generates unique id if not provided', () => {
            render(<Input label="Test Label" />);
            const input = screen.getByLabelText('Test Label');
            expect(input).toHaveAttribute('id');
            expect(input.getAttribute('id')).toMatch(/input-.+/);
        });

        it('is keyboard navigable', () => {
            render(<Input label="Focusable" />);
            const input = screen.getByLabelText('Focusable');
            input.focus();
            expect(input).toHaveFocus();
        });

        it('accepts aria-describedby for error messages', () => {
            render(<Input aria-describedby="error-msg" error="Error" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'error-msg');
        });

        it('accepts aria-required', () => {
            render(<Input aria-required="true" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
        });

        it('accepts aria-invalid for error state', () => {
            render(<Input aria-invalid="true" error="Invalid input" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
        });
    });

    // ===========================================
    // CUSTOM CLASS NAME TESTS
    // ===========================================
    describe('Custom className', () => {
        it('accepts and applies custom className to container', () => {
            render(<Input className="custom-input-class" data-testid="input" />);
            const container = screen.getByTestId('input').closest('.container');
            expect(container).toHaveClass('custom-input-class');
        });
    });

    // ===========================================
    // EDGE CASES
    // ===========================================
    describe('Edge Cases', () => {
        it('handles empty string value', () => {
            render(<Input value="" onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue('');
        });

        it('handles very long input values', async () => {
            const longValue = 'a'.repeat(1000);
            render(<Input value={longValue} onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue(longValue);
        });

        it('handles special characters in value', () => {
            const specialChars = '<>&"\'`';
            render(<Input value={specialChars} onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue(specialChars);
        });

        it('handles unicode characters', () => {
            const unicode = '你好世界 🌍 مرحبا';
            render(<Input value={unicode} onChange={() => { }} />);
            expect(screen.getByRole('textbox')).toHaveValue(unicode);
        });

        it('handles rapid typing', async () => {
            const handleChange = jest.fn();
            render(<Input onChange={handleChange} />);

            await userEvent.type(screen.getByRole('textbox'), 'rapid');
            expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
        });

        it('handles paste events', () => {
            const handlePaste = jest.fn();
            render(<Input onPaste={handlePaste} />);

            fireEvent.paste(screen.getByRole('textbox'), {
                clipboardData: { getData: () => 'pasted text' },
            });
            expect(handlePaste).toHaveBeenCalledTimes(1);
        });

        it('spreads additional props to input element', () => {
            render(<Input data-testid="custom-input" maxLength={50} autoComplete="email" />);
            const input = screen.getByTestId('custom-input');
            expect(input).toHaveAttribute('maxLength', '50');
            expect(input).toHaveAttribute('autoComplete', 'email');
        });
    });

    // ===========================================
    // FORM INTEGRATION TESTS
    // ===========================================
    describe('Form Integration', () => {
        it('works within a form', async () => {
            const handleSubmit = jest.fn((e) => e.preventDefault());
            render(
                <form onSubmit={handleSubmit}>
                    <Input name="email" />
                    <button type="submit">Submit</button>
                </form>
            );

            await userEvent.type(screen.getByRole('textbox'), 'test@example.com');
            fireEvent.click(screen.getByRole('button'));
            expect(handleSubmit).toHaveBeenCalled();
        });

        it('has correct name attribute', () => {
            render(<Input name="username" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
        });

        it('supports required attribute', () => {
            render(<Input required />);
            expect(screen.getByRole('textbox')).toBeRequired();
        });
    });
});
