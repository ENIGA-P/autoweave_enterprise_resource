import express from 'express';
import Metrics from '../models/Metrics.js';
import Production from '../models/Production.js';
import Machine from '../models/Machine.js';
import Order from '../models/Order.js';

const router = express.Router();

// Get metrics (calculate dynamically)
router.get('/', async (req, res) => {
    try {
        // Calculate Total Production
        const productionData = await Production.aggregate([
            { $group: { _id: null, total: { $sum: "$output" } } }
        ]);
        const totalProduction = productionData.length > 0 ? productionData[0].total : 0;

        // Calculate Active Machines
        const activeMachines = await Machine.countDocuments({ status: 'running' });

        // Calculate Total Machines (for efficiency average or display)
        const machines = await Machine.find();
        const totalMachines = machines.length;
        const avgEfficiency = totalMachines > 0
            ? Math.round(machines.reduce((acc, m) => acc + (m.efficiency || 0), 0) / totalMachines)
            : 0;

        // Calculate Pending Orders
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        const metrics = {
            totalProduction,
            activeMachines,
            efficiency: avgEfficiency,
            pendingOrders
        };

        res.json(metrics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update metrics (manual override if needed)
router.put('/', async (req, res) => {
    try {
        const metrics = await Metrics.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(metrics);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
