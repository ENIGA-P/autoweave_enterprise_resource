import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

// Bright, high-contrast colors that pop against the purple gradient background
const COLORS = [
    '#4ADE80', // Green
    '#F472B6', // Pink
    '#FACC15', // Yellow
    '#60A5FA', // Blue
    '#FB923C', // Orange
    '#2DD4BF', // Teal
    '#FFFFFF'  // White
];

const ShiftDistributionChart = () => {
    const [stats, setStats] = useState([]);
    const [timeRange, setTimeRange] = useState('week');
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [timeRange]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/workers/stats?timeRange=${timeRange}`);
            if (Array.isArray(response.data)) {
                setStats(response.data);
            } else {
                console.error("Expected array from API but got:", response.data);
                setStats([]);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 shadow-soft text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Worker Shifts Distribution</h3>
                <div className="flex bg-white/20 rounded-lg p-1">
                    {['week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${timeRange === range
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-purple-100 hover:bg-white/10'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-80 w-full relative flex gap-6">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : stats.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-purple-200">
                        No shifts data for this period
                    </div>
                ) : (
                    <>
                        {/* Chart Section */}
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                        stroke="none"
                                    >
                                        {stats.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke={activeIndex === index ? '#fff' : 'none'}
                                                strokeWidth={activeIndex === index ? 2 : 0}
                                                style={{
                                                    filter: activeIndex === index ? 'drop-shadow(0px 0px 8px rgba(255,255,255,0.4))' : 'none',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderColor: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                            color: '#1f2937',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#4B5563', fontWeight: 'bold' }}
                                        formatter={(value, name) => [`${value} shifts`, name]}
                                    />
                                    <Legend
                                        iconType="circle"
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value) => <span className="text-white font-medium ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Performance Stats Section */}
                        <div className="w-48 flex flex-col justify-center space-y-4">
                            {(() => {
                                const totalShifts = stats.reduce((sum, worker) => sum + worker.value, 0);
                                const avgShifts = totalShifts / stats.length;
                                const highPerformers = stats.filter(w => w.value > avgShifts).length;
                                const lowPerformers = stats.filter(w => w.value < avgShifts).length;
                                const highPercentage = ((highPerformers / stats.length) * 100).toFixed(0);
                                const lowPercentage = ((lowPerformers / stats.length) * 100).toFixed(0);

                                return (
                                    <>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <div className="text-xs text-purple-200 mb-1">High Performers</div>
                                            <div className="text-3xl font-bold text-white">{highPercentage}%</div>
                                            <div className="text-xs text-purple-200 mt-1">Above average shifts</div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <div className="text-xs text-purple-200 mb-1">Low Performers</div>
                                            <div className="text-3xl font-bold text-white">{lowPercentage}%</div>
                                            <div className="text-xs text-purple-200 mt-1">Below average shifts</div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <div className="text-xs text-purple-200 mb-1">Average Shifts</div>
                                            <div className="text-2xl font-bold text-white">{avgShifts.toFixed(1)}</div>
                                            <div className="text-xs text-purple-200 mt-1">Per worker</div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShiftDistributionChart;
