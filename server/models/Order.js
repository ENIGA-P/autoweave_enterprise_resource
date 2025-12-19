import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    deadline: { type: Date },
    status: { type: String, default: 'pending' }, // pending, connected, completed
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
