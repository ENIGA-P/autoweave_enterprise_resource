import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema({
    machineId: { type: String, required: true },
    output: { type: Number, default: 0 },
    defects: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Production = mongoose.model('Production', productionSchema);
export default Production;
