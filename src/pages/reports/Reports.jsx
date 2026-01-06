import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';

const Reports = () => {
    const [reportType, setReportType] = useState('production');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState('pdf');
    const [loading, setLoading] = useState(false);
    const [recentReports, setRecentReports] = useState([]);
    const [error, setError] = useState('');

    // Fetch recent reports on component mount
    useEffect(() => {
        fetchRecentReports();
    }, []);

    const fetchRecentReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/reports');
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            setRecentReports(data);
        } catch (err) {
            console.error('Error fetching reports:', err);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/reports/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportType,
                    startDate,
                    endDate,
                    format
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate report');
            }

            const data = await response.json();

            // Download the generated report
            const downloadUrl = `http://localhost:5000${data.report.downloadUrl}`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = data.report.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Refresh recent reports list
            fetchRecentReports();

        } catch (err) {
            console.error('Report generation error:', err);
            setError(err.message || 'Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (downloadUrl, fileName) => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${downloadUrl}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getReportTypeName = (type) => {
        const names = {
            production: 'Production',
            efficiency: 'Efficiency',
            defects: 'Defects',
            orders: 'Orders',
            worker_attendance: 'Worker Attendance'
        };
        return names[type] || type;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-text-primary">Reports</h2>
                <p className="text-text-secondary mt-1">Generate and download reports for your data.</p>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

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
                                disabled={loading}
                            >
                                <option value="production">Daily Production Report</option>
                                <option value="efficiency">Machine Efficiency Analysis</option>
                                <option value="defects">Defect Rate Summary</option>
                                <option value="orders">Order Fulfillment Status</option>
                                <option value="worker_attendance">Worker Attendance Report</option>
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
                                        className="w-4 h-4 text-pastel-mint-600 border-pastel-mint-300 focus:ring-pastel-mint-400 focus:ring-2"
                                    />
                                    <span className="group-hover:text-pastel-mint-700 transition-colors">Excel Spreadsheet</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pastel-mint-500 hover:bg-pastel-mint-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Generate & Download
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-white border-2 border-pastel-lavender-200 rounded-xl p-6 shadow-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pastel-lavender-600" />
                        Recent Reports
                    </h3>

                    <div className="space-y-3">
                        {recentReports.length === 0 ? (
                            <p className="text-text-secondary text-center py-8">No reports generated yet</p>
                        ) : (
                            recentReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="flex items-center justify-between p-4 bg-pastel-lavender-50 rounded-lg border-2 border-pastel-lavender-200 hover:border-pastel-lavender-400 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => handleDownload(report.downloadUrl, report.fileName)}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-pastel-lavender-600" />
                                        <div>
                                            <div className="text-text-primary text-sm font-bold">
                                                {getReportTypeName(report.reportType)} - {formatDate(report.startDate)} to {formatDate(report.endDate)}
                                            </div>
                                            <div className="text-xs text-text-secondary font-medium">
                                                {formatFileSize(report.fileSize)} • {report.format.toUpperCase()} • {formatDate(report.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <Download className="w-5 h-5 text-pastel-lavender-500 group-hover:text-pastel-lavender-700 transition-colors" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

