import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    hours: { type: Number, default: 8 },
    isPaid: { type: Boolean, default: false }
});

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    shiftRate: { type: Number, default: 750 },
    shifts: [shiftSchema],
    payments: [paymentSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for total salary (only unpaid shifts)
workerSchema.virtual('totalSalary').get(function () {
    return this.shifts
        .filter(shift => !shift.isPaid)
        .reduce((total, shift) => total + shift.amount, 0);
});

// Virtual for total hours (all time? or just unpaid? usually all time stats are good, but payroll might want unpaid. 
// User asked for "salary be restarted again", usually hours track with salary for that period.
// Let's assume totalHours should also reflect the current unpaid period if it's displayed next to totalSalary.
// However, the previous code just summed everything. 
// Let's make totalHours reflect the UNPAID hours for consistency with Salary.
// Actually, usually "Total Hours" might be lifetime or current period. 
// Given the context of "Payroll" and "Payout", it likely refers to the "Due" amount.
// So I will make totalHours also filter by !isPaid.
workerSchema.virtual('totalHours').get(function () {
    return this.shifts
        .filter(shift => !shift.isPaid)
        .reduce((total, shift) => total + (shift.hours || 0), 0);
});

// Virtual for last payment date
workerSchema.virtual('lastPaymentDate').get(function () {
    if (this.payments && this.payments.length > 0) {
        // Assuming payments are pushed in order, or we sort. 
        // Array.prototype.sort mutates, so be careful. 
        // Safest to just take the last one if we push chronologically.
        return this.payments[this.payments.length - 1].date;
    }
    return null;
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
