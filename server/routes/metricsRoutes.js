import express from 'express';
import Metrics from '../models/Metrics.js';

const router = express.Router();

// Get metrics (create default if not exists)
router.get('/', async (req, res) => {
    try {
        let metrics = await Metrics.findOne();
        if (!metrics) {
            metrics = new Metrics();
            await metrics.save();
        }
        res.json(metrics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update metrics
router.put('/', async (req, res) => {
    try {
        // We assume there's only one metrics document, so update the first one found or create
        const metrics = await Metrics.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(metrics);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
