import React from 'react';
import { twMerge } from 'tailwind-merge';

const ThemedInput = ({ label, error, className, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold text-text-primary mb-2">{label}</label>}
            <input
                className={twMerge(
                    'w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-pastel-mint-300 focus:border-pastel-mint-500 transition-all',
                    error && 'border-status-faulty-main focus:ring-status-faulty-light focus:border-status-faulty-main',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-status-faulty-text font-medium">{error}</p>}
        </div>
    );
};

export default ThemedInput;
