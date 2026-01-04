// Type declarations for Jest and testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveClass(...classNames: string[]): R;
            toHaveAttribute(attr: string, value?: string): R;
            toBeDisabled(): R;
            toBeEnabled(): R;
            toBeVisible(): R;
            toBeEmptyDOMElement(): R;
            toContainElement(element: HTMLElement | null): R;
            toContainHTML(html: string): R;
            toHaveAccessibleDescription(description?: string | RegExp): R;
            toHaveAccessibleName(name?: string | RegExp): R;
            toHaveFocus(): R;
            toHaveFormValues(values: Record<string, unknown>): R;
            toHaveStyle(css: string | Record<string, unknown>): R;
            toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
            toHaveValue(value?: string | string[] | number): R;
            toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
            toBeChecked(): R;
            toBePartiallyChecked(): R;
            toHaveErrorMessage(message?: string | RegExp): R;
            toBeRequired(): R;
            toBeValid(): R;
            toBeInvalid(): R;
        }
    }
}

export { };
