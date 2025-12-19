import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import ThemedInput from '../../components/common/ThemedInput';
import { Plus, Trash2 } from 'lucide-react';

const DataManagement = () => {
    const { data, addMachine, deleteMachine, addOrder, updateDashboardMetrics } = useData();
    const [activeTab, setActiveTab] = useState('machines');
    const [formData, setFormData] = useState({});

    const handleAddMachine = () => {
        if (formData.name) {
            addMachine({
                name: formData.name,
                status: formData.status || 'running',
                efficiency: parseInt(formData.efficiency) || 85,
                lastMaintenance: formData.lastMaintenance || new Date().toISOString().split('T')[0],
            });
            setFormData({});
        }
    };

    const handleAddOrder = () => {
        if (formData.customer && formData.product) {
            addOrder({
                customer: formData.customer,
                product: formData.product,
                quantity: formData.quantity,
                deadline: formData.deadline,
            });
            setFormData({});
        }
    };

    const handleUpdateMetrics = () => {
        updateDashboardMetrics({
            totalProduction: parseInt(formData.totalProduction) || 0,
            activeMachines: parseInt(formData.activeMachines) || 0,
            efficiency: parseInt(formData.efficiency) || 0,
            pendingOrders: parseInt(formData.pendingOrders) || 0,
        });
        setFormData({});
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-text-primary">Data Management</h2>
                <p className="text-text-secondary mt-1">Manage your machines, orders, and dashboard metrics</p>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-pastel-mint-200">
                <nav className="-mb-0.5 flex space-x-8">
                    {['machines', 'orders', 'metrics'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-4 font-semibold text-sm capitalize transition-all ${activeTab === tab
                                ? 'border-pastel-mint-500 text-text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-pastel-mint-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Machines Tab */}
            {activeTab === 'machines' && (
                <div className="space-y-6">
                    <div className="bg-white border-2 border-pastel-mint-200 rounded-xl p-6 shadow-soft">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Add New Machine</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ThemedInput
                                label="Machine Name"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Loom-001"
                            />
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">Status</label>
                                <select
                                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-pastel-mint-300 focus:border-pastel-mint-500 transition-all"
                                    value={formData.status || 'running'}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="running">Running</option>
                                    <option value="idle">Idle</option>
                                    <option value="faulty">Faulty</option>
                                </select>
                            </div>
                            <ThemedInput
                                label="Efficiency (%)"
                                type="number"
                                value={formData.efficiency || ''}
                                onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                                placeholder="85"
                            />
                            <ThemedInput
                                label="Last Maintenance"
                                type="date"
                                value={formData.lastMaintenance || ''}
                                onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                            />
                        </div>
                        <div className="mt-4">
                            <Button onClick={handleAddMachine}>
                                <Plus className="w-4 h-4 mr-2 inline" />
                                Add Machine
                            </Button>
                        </div>
                    </div>

                    {/* Machines List */}
                    <div className="bg-white border-2 border-pastel-blue-200 rounded-xl overflow-hidden shadow-soft">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-pastel-blue-50 to-pastel-lavender-50 border-b-2 border-pastel-blue-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Efficiency</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Last Maintenance</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pastel-blue-100">
                                {data.machines.map((machine) => (
                                    <tr key={machine.id} className="hover:bg-pastel-blue-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-text-primary">{machine.name}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary capitalize">{machine.status}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{machine.efficiency}%</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{machine.lastMaintenance}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => deleteMachine(machine.id)}
                                                className="text-status-faulty-text hover:text-status-faulty-dark p-2 hover:bg-status-faulty-light rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {data.machines.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                            No machines added yet. Add your first machine above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    <div className="bg-white border-2 border-pastel-lavender-200 rounded-xl p-6 shadow-soft">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Add New Order</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ThemedInput
                                label="Customer Name"
                                value={formData.customer || ''}
                                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                placeholder="e.g., Textile Corp"
                            />
                            <ThemedInput
                                label="Product"
                                value={formData.product || ''}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                placeholder="e.g., Cotton Yarn 40s"
                            />
                            <ThemedInput
                                label="Quantity"
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="e.g., 5000 kg"
                            />
                            <ThemedInput
                                label="Deadline"
                                type="date"
                                value={formData.deadline || ''}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                        <div className="mt-4">
                            <Button variant="secondary" onClick={handleAddOrder}>
                                <Plus className="w-4 h-4 mr-2 inline" />
                                Add Order
                            </Button>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="bg-white border-2 border-pastel-lavender-200 rounded-xl overflow-hidden shadow-soft">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-pastel-lavender-50 to-pastel-coral-50 border-b-2 border-pastel-lavender-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-text-primary uppercase">Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pastel-lavender-100">
                                {data.orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-pastel-lavender-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-text-primary">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{order.customer}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{order.product}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{order.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">{order.deadline}</td>
                                    </tr>
                                ))}
                                {data.orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                            No orders added yet. Add your first order above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
                <div className="bg-white border-2 border-pastel-coral-200 rounded-xl p-6 shadow-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-4">Update Dashboard Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ThemedInput
                            label="Total Production (m)"
                            type="number"
                            value={formData.totalProduction || data.dashboardMetrics.totalProduction}
                            onChange={(e) => setFormData({ ...formData, totalProduction: e.target.value })}
                            placeholder="12500"
                        />
                        <ThemedInput
                            label="Active Machines"
                            type="number"
                            value={formData.activeMachines || data.dashboardMetrics.activeMachines}
                            onChange={(e) => setFormData({ ...formData, activeMachines: e.target.value })}
                            placeholder="8"
                        />
                        <ThemedInput
                            label="Efficiency (%)"
                            type="number"
                            value={formData.efficiency || data.dashboardMetrics.efficiency}
                            onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                            placeholder="92"
                        />
                        <ThemedInput
                            label="Pending Orders"
                            type="number"
                            value={formData.pendingOrders || data.dashboardMetrics.pendingOrders}
                            onChange={(e) => setFormData({ ...formData, pendingOrders: e.target.value })}
                            placeholder="5"
                        />
                    </div>
                    <div className="mt-4">
                        <Button variant="success" onClick={handleUpdateMetrics}>
                            Update Metrics
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataManagement;
