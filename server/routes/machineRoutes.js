import express from 'express';
import Machine from '../models/Machine.js';

const router = express.Router();

// Get all machines
router.get('/', async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one machine
router.get('/:id', async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) return res.status(404).json({ message: 'Machine not found' });
        res.json(machine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create machine
router.post('/', async (req, res) => {
    const machine = new Machine(req.body);
    try {
        const newMachine = await machine.save();
        res.status(201).json(newMachine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update machine
router.put('/:id', async (req, res) => {
    try {
        const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!machine) return res.status(404).json({ message: 'Machine not found' });
        res.json(machine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete machine
router.delete('/:id', async (req, res) => {
    try {
        const machine = await Machine.findByIdAndDelete(req.params.id);
        if (!machine) return res.status(404).json({ message: 'Machine not found' });
        res.json({ message: 'Machine deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
