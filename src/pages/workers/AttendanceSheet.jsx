import React, { useState } from 'react';
import workerService from '../../services/workerService';

const AttendanceSheet = ({ workers, onRefresh }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [existingShift, setExistingShift] = useState(null);
    const [hours, setHours] = useState(8);

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getShiftForDate = (worker, day) => {
        return worker.shifts.find(shift => {
            const shiftDate = new Date(shift.date);
            return shiftDate.getDate() === day &&
                shiftDate.getMonth() === currentMonth &&
                shiftDate.getFullYear() === currentYear;
        });
    };

    const handleCellClick = (worker, day) => {
        // Create date object for the selected day (noon to avoid timezone issues)
        const date = new Date(currentYear, currentMonth, day, 12, 0, 0);

        // Check if date is in the future
        const now = new Date();
        // Reset time for accurate date comparison
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dateStart = new Date(currentYear, currentMonth, day);

        if (dateStart > todayStart) {
            alert("You cannot mark attendance for a future date.");
            return;
        }

        const shift = getShiftForDate(worker, day);
        setSelectedWorker(worker);

        setSelectedDate(date);

        setExistingShift(shift);
        setHours(shift ? shift.hours : 8);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedWorker || !selectedDate) return;

        try {
            // Because our API adds a new shift each time (push), 
            // "Editing" strictly means removing the old one and adding a new one, 
            // or just adding one if we assume one shift per day (which we should).

            // If existing shift, verify if we need to delete it first or if update is supported.
            // Currently API supports add (push) and delete.
            // So if existing, delete first.

            if (existingShift) {
                await workerService.deleteShift(selectedWorker._id, existingShift._id);
            }

            // Add new shift
            // Format date to ISO string but ensure it represents the selected day
            await workerService.addShift(selectedWorker._id, {
                date: selectedDate.toISOString(),
                hours: Number(hours)
            });

            onRefresh();
            closeModal();
        } catch (err) {
            alert('Failed to update attendance: ' + err.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedWorker || !existingShift) return;

        if (window.confirm('Are you sure you want to remove this attendance record?')) {
            try {
                await workerService.deleteShift(selectedWorker._id, existingShift._id);
                onRefresh();
                closeModal();
            } catch (err) {
                alert('Failed to delete attendance: ' + err.message);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWorker(null);
        setSelectedDate(null);
        setExistingShift(null);
    };

    const navigateMonth = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Controls */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-200 rounded">
                        &lt; Prev
                    </button>
                    <h2 className="text-lg font-bold">
                        {months[currentMonth]} {currentYear}
                    </h2>
                    <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-200 rounded">
                        Next &gt;
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    Click cells to mark attendance
                </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border bg-gray-100 min-w-[150px] text-left">Worker Name</th>
                            {daysArray.map(day => (
                                <th key={day} className="p-1 border bg-gray-100 min-w-[30px] text-center text-xs">
                                    {day}
                                </th>
                            ))}
                            <th className="p-2 border bg-gray-100 text-center min-w-[60px]">Present</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map(worker => {
                            // Calculate total present days for this month
                            const presentDays = worker.shifts.filter(s => {
                                const d = new Date(s.date);
                                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                            }).length;

                            return (
                                <tr key={worker._id}>
                                    <td className="p-2 border font-medium whitespace-nowrap">{worker.name}</td>
                                    {daysArray.map(day => {
                                        const shift = getShiftForDate(worker, day);
                                        return (
                                            <td
                                                key={day}
                                                className={`border text-center cursor-pointer hover:bg-blue-50 transition-colors
                                                    ${shift ? 'bg-green-100 text-green-800 font-bold' : ''}
                                                `}
                                                onClick={() => handleCellClick(worker, day)}
                                            >
                                                {shift ? shift.hours : ''}
                                            </td>
                                        );
                                    })}
                                    <td className="p-2 border text-center font-bold">{presentDays}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-2">
                            {existingShift ? 'Edit Attendance' : 'Mark Attendance'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {selectedWorker?.name} - {months[currentMonth]} {selectedDate?.getDate()}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                min="0.5"
                                max="24"
                                step="0.5"
                            />
                        </div>

                        <div className="flex justify-between">
                            {existingShift ? (
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    Delete
                                </button>
                            ) : <div></div>}

                            <div className="flex space-x-2">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceSheet;
