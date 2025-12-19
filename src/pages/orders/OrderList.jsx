import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import StatusIndicator from '../../components/common/StatusIndicator';

const OrderList = () => {
    const { data } = useData();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Orders</h2>
                    <p className="text-text-secondary mt-1">Manage your orders and track progress</p>
                </div>
                <Button onClick={() => navigate('/data-management')}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                </Button>
            </div>

            {data.orders.length === 0 ? (
                <div className="bg-white border-2 border-pastel-coral-200 rounded-xl p-12 text-center shadow-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-2">No Orders Yet</h3>
                    <p className="text-text-secondary mb-4">Create your first order to get started</p>
                    <Button onClick={() => navigate('/data-management')}>
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Add Order
                    </Button>
                </div>
            ) : (
                <div className="bg-white border-2 border-pastel-lavender-200 rounded-xl overflow-hidden shadow-soft">
                    <table className="w-full text-left">
                        <thead className="bg-gradient-to-r from-pastel-lavender-50 to-pastel-blue-50 border-b-2 border-pastel-lavender-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-text-primary uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-primary uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-primary uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-primary uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-primary uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-primary uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pastel-lavender-100">
                            {data.orders.map((order) => (
                                <tr key={order.id} className="hover:bg-pastel-lavender-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-text-primary">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">{order.customer}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">{order.product}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">{order.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-text-secondary">{order.deadline}</td>
                                    <td className="px-6 py-4">
                                        <StatusIndicator status={order.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderList;
