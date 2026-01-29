import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import workerService from '../../services/workerService';
import { useLanguage } from '../../context/LanguageContext';

import AttendanceSheet from './AttendanceSheet';

const WorkerList = () => {
    const { t } = useLanguage();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'sheet'

    // Modal State
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [shiftHours, setShiftHours] = useState(8);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            const data = await workerService.getWorkers();
            setWorkers(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const openShiftModal = (id) => {
        setSelectedWorkerId(id);
        setShiftHours(8); // Default to 8
        setIsShiftModalOpen(true);
    };

    const closeShiftModal = () => {
        setIsShiftModalOpen(false);
        setSelectedWorkerId(null);
    };

    const handleConfirmAddShift = async () => {
        if (!selectedWorkerId) return;

        try {
            await workerService.addShift(selectedWorkerId, { hours: shiftHours });
            fetchWorkers(); // Refresh list
            closeShiftModal();
        } catch (err) {
            alert('Failed to add shift: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this worker? This action cannot be undone.')) {
            try {
                await workerService.deleteWorker(id);
                fetchWorkers(); // Refresh list
            } catch (err) {
                alert('Failed to delete worker: ' + err.message);
            }
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;

    return (
        <div className="p-6 relative bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('workers.title')}</h1>
                    <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded text-sm font-medium transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                                }`}
                        >
                            {t('workers.list')}
                        </button>
                        <button
                            onClick={() => setViewMode('sheet')}
                            className={`px-3 py-1 rounded text-sm font-medium transition ${viewMode === 'sheet' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                                }`}
                        >
                            {t('workers.attendance')}
                        </button>
                    </div>
                </div>
                <Link to="/workers/new" className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
                    {t('workers.addWorker')}
                </Link>
            </div>

            {viewMode === 'sheet' ? (
                <AttendanceSheet workers={workers} onRefresh={fetchWorkers} />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('workers.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('workers.contact')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('workers.totalShifts')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('workers.totalSalary')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('workers.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {workers.map((worker) => (
                                <tr key={worker._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{worker.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{worker.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{worker.shifts.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                        Rs {worker.totalSalary}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => openShiftModal(worker._id)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded"
                                        >
                                            {t('workers.addShift')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(worker._id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded"
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {workers.length === 0 && (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">{t('common.noData')}</div>
                    )}
                </div>
            )}

            {/* Add Shift Modal */}
            {isShiftModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
                        <h2 className="text-lg font-bold mb-4 dark:text-white">{t('workers.addShift')}</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('workers.hoursWorked')}</label>
                            <input
                                type="number"
                                value={shiftHours}
                                onChange={(e) => setShiftHours(e.target.value)}
                                min="0.5"
                                max="24"
                                step="0.5"
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeShiftModal}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleConfirmAddShift}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerList;
