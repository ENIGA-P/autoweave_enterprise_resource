import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportType: {
        type: String,
        required: true,
        enum: ['production', 'efficiency', 'defects', 'orders', 'worker_attendance']
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    format: {
        type: String,
        required: true,
        enum: ['pdf', 'excel']
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number }, // in bytes
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
