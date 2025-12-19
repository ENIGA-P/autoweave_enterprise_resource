import express from 'express';
import Production from '../models/Production.js';

const router = express.Router();

// Get all production logs
router.get('/', async (req, res) => {
    try {
        const logs = await Production.find();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add production log
router.post('/', async (req, res) => {
    const production = new Production(req.body);
    try {
        const newProduction = await production.save();
        res.status(201).json(newProduction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
