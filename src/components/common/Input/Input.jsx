// src/components/common/Input/Input.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Input.module.css';

const Input = ({
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

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
};

export default Input;
