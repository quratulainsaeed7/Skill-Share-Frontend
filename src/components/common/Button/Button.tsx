// src/components/common/Button/Button.tsx
import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    className,
    ...props
}) => {
    return (
        <button
            type={type}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                { [styles.fullWidth]: fullWidth },
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
