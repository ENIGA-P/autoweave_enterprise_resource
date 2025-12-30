import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import IndustrialButton from '../../components/common/IndustrialButton';
import ThemedInput from '../../components/common/ThemedInput';
import axios from 'axios';

const ProductionEntry = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/machines');
            setMachines(response.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateChange = (id, field, value) => {
        setMachines(prev => prev.map(m => {
            if (m._id === id) {
                return { ...m, [field]: value };
            }
            return m;
        }));
    };

    const handleSave = async (machine) => {
        try {
            await axios.put(`http://localhost:5000/api/machines/${machine._id}/production`, {
                dailyOutput: machine.dailyMeters,
                completedMeters: machine.completedMeters,
                totalTargetMeters: machine.totalTargetMeters,
                currentOrder: machine.currentOrder
            });
            // Show success toast or feedback
            console.log("Updated machine:", machine.name);
            fetchMachines(); // Refresh to ensure sync
        } catch (error) {
            console.error("Error updating production:", error);
        }
    };

    if (loading) return <div className="text-center p-10">Loading Looms...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-navy">Loom Production Tracking</h2>
                <IndustrialButton onClick={fetchMachines} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </IndustrialButton>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft-lg overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                    <thead className="bg-pastel-mint-100 text-text-primary text-sm uppercase border-b-2 border-pastel-mint-300">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Loom ID</th>
                            <th className="px-4 py-3 font-semibold">Current Order</th>
                            <th className="px-4 py-3 font-semibold text-right">Target (m)</th>
                            <th className="px-4 py-3 font-semibold text-right">Completed (m)</th>
                            <th className="px-4 py-3 font-semibold text-right text-blue-600">Daily (m)</th>
                            <th className="px-4 py-3 font-semibold text-right text-purple-600">Pending (m)</th>
                            <th className="px-4 py-3 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {machines.map((machine) => {
                            const target = Number(machine.totalTargetMeters) || 0;
                            const completed = Number(machine.completedMeters) || 0;
                            const daily = Number(machine.dailyMeters) || 0;
                            const pending = Math.max(0, target - (completed + daily)); // Actually, if daily is 'today's' run, 'completed' usually includes it ONLY after day close? 
                            // Or is 'completed' = 'previous days'? 
                            // Let's assume 'completed' is "Total BEFORE today". 
                            // If 'completed' INCLUDES daily, the calculation would be different.
                            // Based on my API design: "Daily Meters Input... Pending Meters (Target - (Completed + Daily))". 
                            // So 'Completed' is historical.

                            return (
                                <tr key={machine._id} className="hover:bg-pastel-mint-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{machine.name}</td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b border-gray-300 focus:border-pastel-mint-500 outline-none px-1"
                                            value={machine.currentOrder || ''}
                                            onChange={(e) => handleUpdateChange(machine._id, 'currentOrder', e.target.value)}
                                            placeholder="Order #"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <input
                                            type="number"
                                            className="w-24 text-right bg-transparent border-b border-gray-300 focus:border-pastel-mint-500 outline-none px-1"
                                            value={machine.totalTargetMeters}
                                            onChange={(e) => handleUpdateChange(machine._id, 'totalTargetMeters', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <input
                                            type="number"
                                            className="w-24 text-right bg-transparent border-b border-gray-300 focus:border-pastel-mint-500 outline-none px-1"
                                            value={machine.completedMeters}
                                            onChange={(e) => handleUpdateChange(machine._id, 'completedMeters', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <input
                                            type="number"
                                            className="w-24 text-right bg-blue-50 border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 outline-none font-bold text-blue-700"
                                            value={machine.dailyMeters}
                                            onChange={(e) => handleUpdateChange(machine._id, 'dailyMeters', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-purple-600">
                                        {pending.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleSave(machine)}
                                            className="bg-pastel-mint-500 hover:bg-pastel-mint-600 text-white rounded-md p-2 transition-colors shadow-sm"
                                            title="Save Production"
                                        >
                                            <Save size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Note:</strong> Update "Daily Meters" to track today's progress. "Completed" represents historical meters run before today. Pending is calculated automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionEntry;
