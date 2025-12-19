import React, { useState } from 'react';
import { Save } from 'lucide-react';
import IndustrialButton from '../../components/common/IndustrialButton';
import ThemedInput from '../../components/common/ThemedInput';

const ProductionEntry = () => {
    const [entries, setEntries] = useState([
        { machineId: '', shift: 'Morning', yarnType: '', output: '', defects: '' }
    ]);

    const handleAddRow = () => {
        setEntries([...entries, { machineId: '', shift: 'Morning', yarnType: '', output: '', defects: '' }]);
    };

    const handleChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Production data submitted:', entries);
        // Reset or show success message
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-navy">Daily Production Entry</h2>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft-lg">
                <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-pastel-mint-100 text-text-primary text-sm uppercase border-b-2 border-pastel-mint-300">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Machine ID</th>
                                    <th className="px-4 py-3 font-semibold">Shift</th>
                                    <th className="px-4 py-3 font-semibold">Yarn Type</th>
                                    <th className="px-4 py-3 font-semibold">Output (kg)</th>
                                    <th className="px-4 py-3 font-semibold">Defects (count)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {entries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-pastel-mint-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <ThemedInput
                                                value={entry.machineId}
                                                onChange={(e) => handleChange(index, 'machineId', e.target.value)}
                                                placeholder="Loom-001"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-pastel-mint-400 focus:border-pastel-mint-400 transition-all"
                                                value={entry.shift}
                                                onChange={(e) => handleChange(index, 'shift', e.target.value)}
                                            >
                                                <option>Morning</option>
                                                <option>Evening</option>
                                                <option>Night</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <ThemedInput
                                                value={entry.yarnType}
                                                onChange={(e) => handleChange(index, 'yarnType', e.target.value)}
                                                placeholder="Cotton 40s"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <ThemedInput
                                                type="number"
                                                value={entry.output}
                                                onChange={(e) => handleChange(index, 'output', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <ThemedInput
                                                type="number"
                                                value={entry.defects}
                                                onChange={(e) => handleChange(index, 'defects', e.target.value)}
                                                placeholder="0"
                                                required
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between">
                        <IndustrialButton type="button" variant="secondary" onClick={handleAddRow}>
                            + Add Row
                        </IndustrialButton>
                        <IndustrialButton type="submit" variant="primary">
                            <Save className="w-4 h-4 mr-2 inline" />
                            Submit Production Data
                        </IndustrialButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductionEntry;
