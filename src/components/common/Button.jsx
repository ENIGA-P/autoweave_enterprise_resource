import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = 'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-soft-lg';

    const variants = {
        primary: 'bg-pastel-mint-500 text-text-primary hover:bg-pastel-mint-600 focus:ring-pastel-mint-400',
        secondary: 'bg-pastel-lavender-500 text-text-primary hover:bg-pastel-lavender-600 focus:ring-pastel-lavender-400',
        success: 'bg-status-running-main text-status-running-text hover:bg-status-running-dark focus:ring-status-running-main',
        danger: 'bg-status-faulty-main text-status-faulty-text hover:bg-status-faulty-dark focus:ring-status-faulty-main',
        outline: 'bg-transparent border-2 border-pastel-mint-500 text-text-primary hover:bg-pastel-mint-50 focus:ring-pastel-mint-400',
        ghost: 'bg-transparent text-text-primary hover:bg-bg-tertiary',
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
