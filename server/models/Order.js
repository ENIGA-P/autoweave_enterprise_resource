import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: String, required: true },
    deadline: { type: Date },
    status: { type: String, default: 'pending' }, // pending, completed
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
