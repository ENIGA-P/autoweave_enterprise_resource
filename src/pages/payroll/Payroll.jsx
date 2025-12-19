import React, { useState, useEffect } from 'react';
import workerService from '../../services/workerService';
import DataCard from '../../components/common/DataCard';
import AttendanceModal from '../../components/payroll/AttendanceModal';
import ShiftHistoryModal from '../../components/payroll/ShiftHistoryModal';

const Payroll = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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

    const handleOpenAttendance = (worker) => {
        setSelectedWorker(worker);
        setIsAttendanceModalOpen(true);
    };

    const handleOpenHistory = (worker) => {
        setSelectedWorker(worker);
        setIsHistoryModalOpen(true);
    };

    const handleSubmitAttendance = async (shiftData) => {
        if (!selectedWorker) return;
        try {
            await workerService.addShift(selectedWorker._id, shiftData);
            fetchWorkers(); // Refresh data
        } catch (err) {
            alert('Failed to add attendance: ' + err.message);
        }
    };

    const handleDeleteShift = async (workerId, shiftId) => {
        if (!window.confirm('Are you sure you want to delete this shift?')) return;
        try {
            await workerService.deleteShift(workerId, shiftId);
            // Update local state immediately for better UI response, then fetch
            const updatedWorkers = await workerService.getWorkers(); // Re-fetch all to be safe and consistent
            setWorkers(updatedWorkers);
            // Also need to update the selectedWorker passed to modal!
            const updatedWorker = updatedWorkers.find(w => w._id === workerId);
            setSelectedWorker(updatedWorker);
        } catch (err) {
            alert('Failed to delete shift: ' + err.message);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayWorker = async (worker) => {
        if (!worker.totalSalary || worker.totalSalary <= 0) return;

        const isConfirmed = window.confirm(`Proceed to pay Rs ${worker.totalSalary} to ${worker.name} via Razorpay?`);
        if (!isConfirmed) return;

        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 1. Create Order
            const order = await workerService.createOrder(worker._id);

            // 2. Open Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE", // Fallback for dev/demo if env missing
                amount: order.amount,
                currency: order.currency,
                name: "AutoWeave Salary",
                description: `Salary Payment for ${worker.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        await workerService.verifyPayment(worker._id, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert('Payment Successful!');
                        fetchWorkers();
                    } catch (err) {
                        alert('Payment Verification Failed: ' + err.message);
                    }
                },
                prefill: {
                    name: worker.name,
                    contact: worker.contact,
                },
                theme: {
                    color: "#4F46E5"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            alert('Failed to initiate payment: ' + err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading payroll data...</div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-6">Error: {error}</div>;

    const totalPayout = workers.reduce((acc, curr) => acc + (curr.totalSalary || 0), 0);
    const totalHours = workers.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

    return (
        <div className="p-6 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Worker Payroll</h1>
                    <p className="text-gray-500 mt-1">Manage attendance and salary disbursements</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[150px]">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Due Payout</p>
                        <p className="text-2xl font-bold text-indigo-600">Rs {totalPayout.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[150px]">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Due Hours</p>
                        <p className="text-2xl font-bold text-emerald-600">{totalHours} hrs</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unpaid Shifts</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Hours</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Salary</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Payment</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {workers.map((worker) => (
                                    <tr key={worker._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{worker.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{worker.contact}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {worker.shifts.filter(s => !s.isPaid).length}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{worker.totalHours || 0} hrs</td>
                                        <td className="px-6 py-4 font-bold text-gray-700">Rs {worker.totalSalary?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {worker.lastPaymentDate ? new Date(worker.lastPaymentDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {worker.totalSalary > 0 && (
                                                <button
                                                    onClick={() => handlePayWorker(worker)}
                                                    className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-xs px-3 py-2 transition-colors focus:ring-4 focus:ring-green-100"
                                                >
                                                    Pay Salary
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenHistory(worker)}
                                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-medium rounded-lg text-xs px-3 py-2 transition-colors"
                                            >
                                                History
                                            </button>
                                            <button
                                                onClick={() => handleOpenAttendance(worker)}
                                                className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-xs px-3 py-2 transition-colors focus:ring-4 focus:ring-indigo-100"
                                            >
                                                Mark Attendance
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {workers.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                            No workers found. Add workers in the Workers section first.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AttendanceModal
                isOpen={isAttendanceModalOpen}
                onClose={() => setIsAttendanceModalOpen(false)}
                onSubmit={handleSubmitAttendance}
                workerName={selectedWorker?.name}
            />

            <ShiftHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                worker={selectedWorker}
                onDeleteShift={handleDeleteShift}
            />
        </div>
    );
};

export default Payroll;
