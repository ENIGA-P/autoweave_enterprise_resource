import React, { useState } from 'react';
import Button from '../common/Button';
import ThemedInput from '../common/ThemedInput';

const AttendanceModal = ({ isOpen, onClose, onSubmit, workerName }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState(8);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ date, hours });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Mark Attendance</h2>
                <p className="text-gray-600 mb-6">Adding shift for <span className="font-semibold text-indigo-600">{workerName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <ThemedInput
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                        <ThemedInput
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            min="0"
                            step="0.5"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <Button type="submit" variant="primary">
                            Save Attendance
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttendanceModal;
