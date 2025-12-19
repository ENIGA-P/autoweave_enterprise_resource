import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const DataCard = ({ title, value, icon: Icon, trend, className, children, onClick, variant = 'default' }) => {
    const variants = {
        default: 'border-pastel-mint-200 hover:border-pastel-mint-400',
        lavender: 'border-pastel-lavender-200 hover:border-pastel-lavender-400',
        blue: 'border-pastel-blue-200 hover:border-pastel-blue-400',
        coral: 'border-pastel-coral-200 hover:border-pastel-coral-400',
    };

    const iconBgVariants = {
        default: 'bg-pastel-mint-100',
        lavender: 'bg-pastel-lavender-100',
        blue: 'bg-pastel-blue-100',
        coral: 'bg-pastel-coral-100',
    };

    const iconColorVariants = {
        default: 'text-pastel-mint-700',
        lavender: 'text-pastel-lavender-700',
        blue: 'text-pastel-blue-700',
        coral: 'text-pastel-coral-700',
    };

    return (
        <div
            className={twMerge(
                'bg-white border-2 rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200',
                variants[variant],
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
                    {value && <div className="text-3xl font-bold text-text-primary mt-1">{value}</div>}
                </div>
                {Icon && (
                    <div className={clsx('p-3 rounded-xl', iconBgVariants[variant])}>
                        <Icon className={clsx('w-6 h-6', iconColorVariants[variant])} />
                    </div>
                )}
            </div>

            {children}

            {trend !== undefined && (
                <div className={clsx(
                    'mt-4 text-sm flex items-center font-medium',
                    trend > 0 ? 'text-status-running-text' : 'text-status-faulty-text'
                )}>
                    <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
                    <span className="text-text-muted ml-2 font-normal">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default DataCard;
