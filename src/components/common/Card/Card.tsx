// src/components/common/Card/Card.tsx
import React, { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    padding = 'md',
    hoverable = false,
    className,
    ...props
}) => {
    return (
        <div
            className={clsx(
                styles.card,
                styles[`padding-${padding}`],
                { [styles.hoverable]: hoverable },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
