import express from 'express';
import Worker from '../models/Worker.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

const router = express.Router();

// Get all workers
router.get('/', async (req, res) => {
    try {
        const workers = await Worker.find().sort({ createdAt: -1 });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new worker
router.post('/', async (req, res) => {
    const { name, contact, shiftRate } = req.body;
    try {
        const newWorker = new Worker({
            name,
            contact,
            shiftRate: shiftRate || 750
        });
        const savedWorker = await newWorker.save();
        res.status(201).json(savedWorker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a shift to a worker
router.post('/:id/shifts', async (req, res) => {
    const { id } = req.params;
    const { date, hours } = req.body;

    try {
        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Add shift with default rate if not specified, or use worker's rate
        // The requirement says "salary per shifts corsts for rs 750", assuming this is the stored amount
        const shiftAmount = worker.shiftRate;

        // Use provided date or default to now
        const shiftDate = date ? new Date(date) : new Date();
        // Use provided hours or default to 8
        const shiftHours = hours ? Number(hours) : 8;

        worker.shifts.push({
            amount: shiftAmount,
            date: shiftDate,
            hours: shiftHours
        });
        await worker.save();

        res.status(201).json(worker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a worker
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedWorker = await Worker.findByIdAndDelete(id);
        if (!deletedWorker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a specific shift from a worker
router.delete('/:id/shifts/:shiftId', async (req, res) => {
    const { id, shiftId } = req.params;
    try {
        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Pull the shift from the array
        const shiftIndex = worker.shifts.findIndex(s => s._id.toString() === shiftId);
        if (shiftIndex === -1) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        worker.shifts.splice(shiftIndex, 1);
        await worker.save();

        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Razorpay Order
router.post('/:id/create-order', async (req, res) => {
    const { id } = req.params;
    try {
        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Calculate total unpaid amount
        const unpaidShifts = worker.shifts.filter(s => !s.isPaid);
        const totalAmount = unpaidShifts.reduce((sum, shift) => sum + shift.amount, 0);

        if (totalAmount <= 0) {
            return res.status(400).json({ message: 'No pending salary to pay' });
        }

        const options = {
            amount: totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_worker_${id}_${Date.now()}`,
            notes: {
                worker_id: id,
                worker_name: worker.name
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message });
    }
});

// Verify Payment and Pay Worker
router.post('/:id/verify-payment', async (req, res) => {
    const { id } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        // Calculate total unpaid amount (to confirm what was paid)
        const unpaidShifts = worker.shifts.filter(s => !s.isPaid);
        const totalAmount = unpaidShifts.reduce((sum, shift) => sum + shift.amount, 0);

        if (totalAmount > 0) {
            // Record payment
            worker.payments.push({
                amount: totalAmount,
                date: new Date(),
                // You might want to store transaction ID here if you update schema
            });

            // Mark shifts as paid
            worker.shifts.forEach(shift => {
                if (!shift.isPaid) {
                    shift.isPaid = true;
                }
            });

            await worker.save();
        }

        res.status(200).json({ message: 'Payment verified and recorded', worker });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: error.message });
    }
});

// Manual Pay (Legacy/Cash Option) - Keeping it but maybe renaming usage
router.post('/:id/pay', async (req, res) => {
    const { id } = req.params;
    try {
        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Calculate total unpaid amount
        const unpaidShifts = worker.shifts.filter(s => !s.isPaid);
        const totalAmount = unpaidShifts.reduce((sum, shift) => sum + shift.amount, 0);

        if (totalAmount > 0) {
            // Record payment
            worker.payments.push({
                amount: totalAmount,
                date: new Date()
            });

            // Mark shifts as paid
            worker.shifts.forEach(shift => {
                if (!shift.isPaid) {
                    shift.isPaid = true;
                }
            });

            await worker.save();
        }

        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
