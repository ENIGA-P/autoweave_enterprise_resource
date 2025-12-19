import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import workerService from '../../services/workerService';

const WorkerForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        shiftRate: 750
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await workerService.createWorker(formData);
            navigate('/workers');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Worker</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Worker Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Salary Per Shift (Rs)</label>
                    <input
                        type="number"
                        name="shiftRate"
                        value={formData.shiftRate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/workers')}
                        className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
                    >
                        Create Worker
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WorkerForm;
