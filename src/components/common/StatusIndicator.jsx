import React from 'react';
import { clsx } from 'clsx';

const StatusIndicator = ({ status, className }) => {
    const statusConfig = {
        running: {
            bg: 'bg-status-running-light',
            dot: 'bg-status-running-main',
            text: 'text-status-running-text',
            border: 'border-status-running-main'
        },
        idle: {
            bg: 'bg-status-idle-light',
            dot: 'bg-status-idle-main',
            text: 'text-status-idle-text',
            border: 'border-status-idle-main'
        },
        faulty: {
            bg: 'bg-status-faulty-light',
            dot: 'bg-status-faulty-main',
            text: 'text-status-faulty-text',
            border: 'border-status-faulty-main'
        },
        offline: {
            bg: 'bg-gray-50',
            dot: 'bg-gray-400',
            text: 'text-gray-600',
            border: 'border-gray-300'
        },
        pending: {
            bg: 'bg-status-warning-light',
            dot: 'bg-status-warning-main',
            text: 'text-status-warning-text',
            border: 'border-status-warning-main'
        },
        processing: {
            bg: 'bg-pastel-blue-100',
            dot: 'bg-pastel-blue-500',
            text: 'text-pastel-blue-700',
            border: 'border-pastel-blue-400'
        },
        completed: {
            bg: 'bg-status-running-light',
            dot: 'bg-status-running-main',
            text: 'text-status-running-text',
            border: 'border-status-running-main'
        },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.offline;

    return (
        <span className={clsx(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border',
            config.bg,
            config.border,
            className
        )}>
            <span className={clsx('w-2 h-2 rounded-full', config.dot)} />
            <span className={clsx('capitalize text-sm font-medium', config.text)}>{status}</span>
        </span>
    );
};

export default StatusIndicator;
