import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Activity, Power } from 'lucide-react';
import StatusIndicator from '../../components/common/StatusIndicator';
import Button from '../../components/common/Button';

const MachineList = () => {
    const { data } = useData();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Machines</h2>
                    <p className="text-text-secondary mt-1">Manage and monitor your machines</p>
                </div>
                <Button onClick={() => navigate('/data-management')}>
                    Manage Machines
                </Button>
            </div>

            {data.machines.length === 0 ? (
                <div className="bg-white border-2 border-pastel-mint-200 rounded-xl p-12 text-center shadow-soft">
                    <Activity className="w-16 h-16 text-pastel-mint-400 mx-auto mb-4" strokeWidth={2} />
                    <h3 className="text-lg font-bold text-text-primary mb-2">No Machines Added</h3>
                    <p className="text-text-secondary mb-4">Get started by adding your first machine</p>
                    <Button onClick={() => navigate('/data-management')}>
                        Add Machine
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.machines.map((machine) => (
                        <div
                            key={machine.id}
                            className="bg-white border-2 border-pastel-lavender-200 rounded-xl p-6 shadow-soft hover:shadow-soft-lg hover:border-pastel-lavender-400 transition-all duration-200 cursor-pointer"
                            onClick={() => navigate(`/machines/${machine.id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-text-primary">{machine.name}</h3>
                                <StatusIndicator status={machine.status} />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary font-medium">Efficiency</span>
                                    <span className="text-text-primary font-bold">{machine.efficiency}%</span>
                                </div>
                                <div className="w-full bg-pastel-lavender-100 h-2.5 rounded-full overflow-hidden border border-pastel-lavender-300">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{ width: `${machine.efficiency}%`, backgroundColor: '#8B5CF6' }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-text-muted mt-3 pt-3 border-t border-pastel-lavender-100">
                                    <span className="font-medium">Last Maint:</span>
                                    <span>{machine.lastMaintenance}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button className="flex-1 py-2.5 bg-pastel-lavender-100 border-2 border-pastel-lavender-300 rounded-lg text-sm text-text-primary font-medium hover:bg-pastel-lavender-200 hover:border-pastel-lavender-400 transition-all">
                                    Diagnostics
                                </button>
                                <button className="p-2.5 bg-status-faulty-light border-2 border-status-faulty-main rounded-lg text-status-faulty-text hover:bg-status-faulty-main hover:text-white transition-all">
                                    <Power className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MachineList;
