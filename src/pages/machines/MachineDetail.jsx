import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Activity, Thermometer, Zap } from 'lucide-react';
import DataCard from '../../components/common/DataCard';
import StatusIndicator from '../../components/common/StatusIndicator';
import IndustrialButton from '../../components/common/IndustrialButton';

const MachineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [machine, setMachine] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching
        const fetchMachineDetails = async () => {
            try {
                // const response = await api.get(`/machines/${id}`);
                // setMachine(response.data);

                // Mock data
                setMachine({
                    id,
                    name: `Loom-${String(id).padStart(3, '0')}`,
                    status: 'running',
                    efficiency: 94,
                    uptime: '4d 12h',
                    temperature: 65,
                    powerConsumption: 12.5,
                });

                const mockData = Array.from({ length: 24 }, (_, i) => ({
                    time: `${i}:00`,
                    efficiency: 80 + Math.random() * 20,
                    temperature: 60 + Math.random() * 10,
                }));
                setPerformanceData(mockData);
            } catch (error) {
                console.error('Error fetching machine details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMachineDetails();
    }, [id]);

    if (loading) return <div className="text-white">Loading machine details...</div>;
    if (!machine) return <div className="text-white">Machine not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/machines')}
                    className="p-2 hover:bg-industrial-surface rounded-full text-industrial-muted hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        {machine.name}
                        <StatusIndicator status={machine.status} className="text-sm" />
                    </h2>
                    <p className="text-industrial-muted text-sm">Serial: SN-{machine.id}8829-X</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <IndustrialButton variant="secondary">Maintenance Log</IndustrialButton>
                    <IndustrialButton variant="danger">Emergency Stop</IndustrialButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DataCard title="Efficiency" value={`${machine.efficiency}%`} icon={Activity} trend={2} />
                <DataCard title="Temperature" value={`${machine.temperature}°C`} icon={Thermometer} />
                <DataCard title="Power Usage" value={`${machine.powerConsumption} kW`} icon={Zap} />
            </div>

            <div className="bg-industrial-surface border border-industrial-border rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">24h Performance History</h3>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#A0A0A0" />
                            <YAxis stroke="#A0A0A0" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="efficiency" stroke="#4CAF50" strokeWidth={2} dot={false} name="Efficiency" />
                            <Line type="monotone" dataKey="temperature" stroke="#F44336" strokeWidth={2} dot={false} name="Temperature" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MachineDetail;
