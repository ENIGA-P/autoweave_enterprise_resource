import React, { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
    const [reportType, setReportType] = useState('production');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState('pdf');

    const handleGenerate = (e) => {
        e.preventDefault();
        // Mock download
        console.log(`Generating ${reportType} report from ${startDate} to ${endDate} in ${format} format`);
        alert(`Report generation started for ${reportType} (${format.toUpperCase()})`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-text-primary">Overview</h2>
                <p className="text-text-secondary mt-1">Generate and download reports for your data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-pastel-mint-200 rounded-xl p-6 shadow-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Generate New Report</h3>

                    <form onSubmit={handleGenerate} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2">Report Type</label>
                            <select
                                className="w-full bg-white border-2 border-pastel-mint-200 rounded-lg px-4 py-2.5 text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-pastel-mint-400 focus:border-pastel-mint-400 transition-all"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="production">Daily Production Report</option>
                                <option value="efficiency">Machine Efficiency Analysis</option>
                                <option value="defects">Defect Rate Summary</option>
                                <option value="orders">Order Fulfillment Status</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border-2 border-pastel-blue-200 rounded-lg px-4 py-2.5 text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-pastel-blue-400 focus:border-pastel-blue-400 transition-all"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">End Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white border-2 border-pastel-blue-200 rounded-lg px-4 py-2.5 text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-pastel-blue-400 focus:border-pastel-blue-400 transition-all"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-3">Format</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-text-primary font-medium cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="pdf"
                                        checked={format === 'pdf'}
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="w-4 h-4 text-pastel-mint-600 border-pastel-mint-300 focus:ring-pastel-mint-400 focus:ring-2"
                                    />
                                    <span className="group-hover:text-pastel-mint-700 transition-colors">PDF Document</span>
                                </label>
                                <label className="flex items-center gap-2 text-text-primary font-medium cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="excel"
                                        checked={format === 'excel'}
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="w-4 h-4 text-pastel-mint-600 border-pastel-mint-300 focus:ring-pastel-mint-400 focus:ring-2"
                                    />
                                    <span className="group-hover:text-pastel-mint-700 transition-colors">Excel Spreadsheet</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pastel-mint-500 hover:bg-pastel-mint-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate & Download
                        </button>
                    </form>
                </div>

                <div className="bg-white border-2 border-pastel-lavender-200 rounded-xl p-6 shadow-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pastel-lavender-600" />
                        Recent Reports
                    </h3>

                    <div className="space-y-3">
                        {[
                            { name: '2023-12-01', size: '2.4 MB' },
                            { name: '2023-11-15', size: '1.1 MB' },
                            { name: '2023-11-01', size: '850 KB' },
                        ].map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-pastel-lavender-50 rounded-lg border-2 border-pastel-lavender-200 hover:border-pastel-lavender-400 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-pastel-lavender-600" />
                                    <div>
                                        <div className="text-text-primary text-sm font-bold">{file.name}</div>
                                        <div className="text-xs text-text-secondary font-medium">{file.size}</div>
                                    </div>
                                </div>
                                <Download className="w-5 h-5 text-pastel-lavender-500 group-hover:text-pastel-lavender-700 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
