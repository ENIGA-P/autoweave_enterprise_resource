import React from 'react';
import { useData } from '../../context/DataContext';
import { Activity, AlertTriangle, CheckCircle, Clock, Power } from 'lucide-react';

const MachineStatusCard = () => {
    const { data } = useData();
    const { machines } = data;



    const getStatusIcon = (status) => {
        switch (status) {
            case 'running': return <Activity className="w-4 h-4" />;
            case 'stopped': return <Power className="w-4 h-4" />;
            case 'maintenance': return <AlertTriangle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 shadow-soft border-2 border-purple-500/30 h-full text-white">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Live Machine Status</h3>
                <div className="flex gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1 text-green-300">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Running
                    </span>
                    <span className="flex items-center gap-1 text-red-300">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span> Stopped
                    </span>
                </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-dark">
                {machines.length === 0 ? (
                    <div className="text-center py-8 text-purple-200">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No machines configured</p>
                    </div>
                ) : (
                    machines.map((machine) => (
                        <div
                            key={machine.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all bg-white/10 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg border border-white/10 bg-white/20 text-white`}>
                                    {getStatusIcon(machine.status)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{machine.name}</h4>
                                    <p className="text-xs text-purple-200 font-medium capitalize flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {machine.uptime || '0h 0m'} uptime
                                    </p>
                                </div>
                            </div>

                            <div className="text-right min-w-[80px]">
                                <div className="text-xs font-bold text-purple-100 mb-1">
                                    {machine.efficiency}% Eff.
                                </div>
                                <div className="w-20 bg-black/20 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${machine.efficiency >= 80 ? 'bg-green-400' :
                                            machine.efficiency >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}
                                        style={{ width: `${machine.efficiency}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-purple-200">
                <span>Total Machines: {machines.length}</span>
                <button className="text-white font-bold hover:text-purple-100 hover:underline">View All Details →</button>
            </div>
        </div>
    );
};

export default MachineStatusCard;
