import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'stopped' }, // running, stopped, maintenance, faulty
    efficiency: { type: Number, default: 0 },
    lastMaintenance: { type: String },
    uptime: { type: String, default: '0h' },
    temperature: { type: Number, default: 0 },
    powerConsumption: { type: Number, default: 0 },

    // Production Tracking
    currentOrder: { type: String, default: 'None' },
    totalTargetMeters: { type: Number, default: 0 },
    completedMeters: { type: Number, default: 0 },
    dailyMeters: { type: Number, default: 0 },
}, { timestamps: true });

const Machine = mongoose.model('Machine', machineSchema);
export default Machine;
