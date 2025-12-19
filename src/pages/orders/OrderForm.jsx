import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import IndustrialButton from '../../components/common/IndustrialButton';
import ThemedInput from '../../components/common/ThemedInput';

const OrderForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer: '',
        product: '',
        quantity: '',
        deadline: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock API call
        console.log('Order submitted:', formData);
        navigate('/orders');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/orders')}
                    className="p-2 hover:bg-industrial-surface rounded-full text-industrial-muted hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">Create New Order</h2>
            </div>

            <div className="bg-industrial-surface border border-industrial-border rounded-lg p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ThemedInput
                            label="Customer Name"
                            value={formData.customer}
                            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                            required
                        />
                        <ThemedInput
                            label="Product Type"
                            value={formData.product}
                            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            required
                        />
                        <ThemedInput
                            label="Quantity (kg)"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                        <ThemedInput
                            label="Deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-industrial-muted mb-1">Notes</label>
                        <textarea
                            className="w-full bg-industrial-bg border border-industrial-border rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-industrial-primary focus:border-industrial-primary transition-colors h-32"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-industrial-border">
                        <IndustrialButton type="button" variant="secondary" onClick={() => navigate('/orders')}>
                            Cancel
                        </IndustrialButton>
                        <IndustrialButton type="submit" variant="primary">
                            <Save className="w-4 h-4 mr-2 inline" />
                            Create Order
                        </IndustrialButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
