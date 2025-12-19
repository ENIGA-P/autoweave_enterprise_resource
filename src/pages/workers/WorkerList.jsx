import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import workerService from '../../services/workerService';

const WorkerList = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleAddShift = async (id) => {
        try {
            await workerService.addShift(id);
            fetchWorkers(); // Refresh list to show updated salary/shifts
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Worker Management</h1>
                <Link to="/workers/new" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                    Add Top Worker
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Shifts</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Salary (Rs)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {workers.map((worker) => (
                            <tr key={worker._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.contact}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.shifts.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                    Rs {worker.totalSalary}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleAddShift(worker._id)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded"
                                    >
                                        Add Shift
                                    </button>
                                    <button
                                        onClick={() => handleDelete(worker._id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {workers.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No workers found. Add one to get started.</div>
                )}
            </div>
        </div>
    );
};

export default WorkerList;
