// src/components/common/Card/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Card.module.css';

const Card = ({
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

Card.propTypes = {
    children: PropTypes.node.isRequired,
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
    hoverable: PropTypes.bool,
    className: PropTypes.string,
};

export default Card;
