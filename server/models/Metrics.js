import mongoose from 'mongoose';

const metricsSchema = new mongoose.Schema({
    totalProduction: { type: Number, default: 0 },
    activeMachines: { type: Number, default: 0 },
    efficiency: { type: Number, default: 0 },
    pendingOrders: { type: Number, default: 0 }
}, { timestamps: true });

const Metrics = mongoose.model('Metrics', metricsSchema);
export default Metrics;
