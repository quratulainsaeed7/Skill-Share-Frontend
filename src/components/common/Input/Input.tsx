// src/components/common/Input/Input.tsx
import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    type?: string;
    placeholder?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    placeholder,
    error,
    helperText,
    disabled = false,
    className,
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={clsx(styles.container, className)}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                <input
                    id={inputId}
                    type={type}
                    className={clsx(styles.input, { [styles.errorInput]: error })}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                />
            </div>
            {error && <span className={clsx(styles.helperText, styles.errorText)}>{error}</span>}
            {!error && helperText && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
};

export default Input;
