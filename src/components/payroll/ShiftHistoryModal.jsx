import React from 'react';
import { Trash2, X } from 'lucide-react';
import IndustrialButton from '../common/IndustrialButton';

const ShiftHistoryModal = ({ isOpen, onClose, worker, onDeleteShift }) => {
    if (!isOpen || !worker) return null;

    // Sort shifts by date descending
    const sortedShifts = [...worker.shifts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-100 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Shift History</h2>
                        <p className="text-sm text-gray-500">Managing shifts for <span className="font-semibold text-indigo-600">{worker.name}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {sortedShifts.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No shift history found.</div>
                    ) : (
                        <div className="space-y-3">
                            {sortedShifts.map((shift) => (
                                <div key={shift._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-indigo-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {new Date(shift.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                        <div className="text-xs text-gray-500 flex gap-3 mt-1">
                                            <span>Duration: <span className="font-semibold text-gray-700">{shift.hours || 0} hrs</span></span>
                                            <span>Amount: <span className="font-semibold text-green-600">Rs {shift.amount}</span></span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteShift(worker._id, shift._id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Shift"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShiftHistoryModal;
