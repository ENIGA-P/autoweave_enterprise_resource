import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const IndustrialButton = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = 'px-4 py-2 rounded font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-industrial-bg';

    const variants = {
        primary: 'bg-industrial-primary text-white hover:bg-opacity-90 focus:ring-industrial-primary',
        secondary: 'bg-industrial-surface text-industrial-text border border-industrial-border hover:bg-gray-800 focus:ring-industrial-muted',
        danger: 'bg-industrial-danger text-white hover:bg-opacity-90 focus:ring-industrial-danger',
        outline: 'bg-transparent border border-industrial-primary text-industrial-primary hover:bg-industrial-primary hover:text-white focus:ring-industrial-primary',
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

export default IndustrialButton;
