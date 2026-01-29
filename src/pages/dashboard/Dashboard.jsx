import React from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import DataCard from '../../components/common/DataCard';
import StatusIndicator from '../../components/common/StatusIndicator';
import ShiftDistributionChart from './ShiftDistributionChart';
import MachineStatusCard from './MachineStatusCard';

const Dashboard = () => {
    const { data } = useData();
    const { dashboardMetrics, machines, production } = data;

    const runningMachines = machines.filter(m => m.status === 'running').length;

    // Aggregate production data for the charts
    // Group by time or take last 10 entries for the trend
    const getChartData = () => {
        if (!production || production.length === 0) {
            return [
                { time: '08:00', output: 0 },
                { time: '10:00', output: 0 },
                { time: '12:00', output: 0 },
                { time: '14:00', output: 0 },
                { time: '16:00', output: 0 },
                { time: '18:00', output: 0 },
            ];
        }

        const sortedProduction = [...production].sort((a, b) => new Date(a.date) - new Date(b.date));

        return sortedProduction.slice(-10).map(p => ({
            time: new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            output: p.output
        }));
    };

    const productionData = getChartData();

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-xl shadow-soft">
                <h2 className="text-3xl font-bold text-white">Overview</h2>
                <p className="text-purple-100 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard
                    title="Total Production"
                    value={`${dashboardMetrics.totalProduction} m`}
                    icon={Activity}
                    trend={5}
                    variant="default"
                >
                    <div className="mt-2 text-xs text-text-muted font-medium">Daily Output</div>
                </DataCard>

                <DataCard
                    title="Active Machines"
                    value={`${runningMachines}/${machines.length}`}
                    icon={CheckCircle}
                    variant="lavender"
                >
                    <StatusIndicator status="running" className="mt-2" />
                </DataCard>

                <DataCard
                    title="Efficiency"
                    value={`${dashboardMetrics.efficiency}%`}
                    icon={Clock}
                    variant="blue"
                >
                    <div className="w-full bg-pastel-blue-100 h-2.5 rounded-full mt-3 overflow-hidden border border-pastel-blue-300">
                        <div
                            className="bg-gradient-to-r from-violet-600 to-purple-500 h-full transition-all duration-500"
                            style={{ width: `${dashboardMetrics.efficiency}%` }}
                        ></div>
                    </div>
                </DataCard>

                <DataCard
                    title="Pending Orders"
                    value={dashboardMetrics.pendingOrders}
                    icon={AlertTriangle}
                    variant="coral"
                >
                    <div className="mt-2 text-xs text-text-muted font-medium">Requires Attention</div>
                </DataCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 shadow-soft">
                    <h3 className="text-lg font-bold text-white mb-4">Production Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={productionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="time" stroke="#E9D5FF" style={{ fontSize: '12px', fontWeight: 500 }} tick={{ fill: '#E9D5FF' }} />
                                <YAxis stroke="#E9D5FF" style={{ fontSize: '12px', fontWeight: 500 }} tick={{ fill: '#E9D5FF' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderColor: '#7E22CE',
                                        borderRadius: '12px',
                                        borderWidth: '0px',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#6B21A8', fontWeight: 600 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="output"
                                    stroke="#FFFFFF"
                                    strokeWidth={3}
                                    dot={{ fill: '#E9D5FF', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
                                    activeDot={{ r: 7, fill: '#FFFFFF' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 shadow-soft relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 relative z-10">Machine Utilization</h3>
                    <div className="h-80 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productionData}>
                                <defs>
                                    {/* Gradient definitions for bars */}
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#E9D5FF" stopOpacity={0.8} />
                                    </linearGradient>

                                    {/* Pattern for bars */}
                                    <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                        <rect width="4" height="8" fill="rgba(255, 255, 255, 0.1)" />
                                    </pattern>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255, 255, 255, 0.15)"
                                    strokeWidth={1}
                                />

                                <XAxis
                                    dataKey="time"
                                    stroke="#E9D5FF"
                                    style={{ fontSize: '12px', fontWeight: 600 }}
                                    tick={{ fill: '#E9D5FF' }}
                                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)', strokeWidth: 2 }}
                                />

                                <YAxis
                                    stroke="#E9D5FF"
                                    style={{ fontSize: '12px', fontWeight: 600 }}
                                    tick={{ fill: '#E9D5FF' }}
                                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.3)', strokeWidth: 2 }}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderColor: '#7E22CE',
                                        borderRadius: '12px',
                                        borderWidth: '2px',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    cursor={{
                                        fill: 'rgba(255, 255, 255, 0.15)',
                                        radius: [8, 8, 0, 0]
                                    }}
                                    itemStyle={{ color: '#6B21A8', fontWeight: 700 }}
                                    labelStyle={{ color: '#7E22CE', fontWeight: 700 }}
                                />

                                <Bar
                                    dataKey="output"
                                    fill="url(#barGradient)"
                                    radius={[12, 12, 0, 0]}
                                    animationDuration={1000}
                                    animationBegin={0}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Worker Shift Distribution Chart */}
                <ShiftDistributionChart />

                {/* Live Machine Status Card */}
                <MachineStatusCard />
            </div>

            {machines.length === 0 && (
                <div className="bg-pastel-mint-50 border-2 border-pastel-mint-300 rounded-xl p-6 text-center">
                    <p className="text-text-primary font-semibold">No data available yet</p>
                    <p className="text-text-secondary text-sm mt-1">
                        Go to <a href="/data-management" className="underline font-bold text-pastel-mint-700">Data Management</a> to add machines and update metrics
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
