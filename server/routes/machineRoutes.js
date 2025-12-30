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

// Update daily production for a machine
router.put('/:id/production', async (req, res) => {
    try {
        const { dailyOutput } = req.body;
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ message: 'Machine not found' });
        }

        // Update meters
        machine.dailyMeters = Number(dailyOutput);

        // Assuming we want to ADD to completed meters each time this is called? 
        // Or if this IS the daily record? 
        // PROPOSAL: The user says "update the daily meters". If I enter 100, then change it to 120, 
        // it usually means the total for today is 120.
        // However, `completedMeters` is a cumulative total.
        // If I just continually add to completedMeters, editing "Daily Meters" might double count.
        // STRATEGY: 
        // 1. `dailyMeters` stores the value entered for today.
        // 2. `completedMeters` tracks LIFETIME or ORDER progress.
        // 3. When updating `dailyMeters`, we should probably adjust `completedMeters` by the difference 
        //    OR let the user manually update `completedMeters` separately?
        //    Actually, "calculate the remaining meters" implies automation.
        //    Let's assume `completedMeters` is the BASE (start of day) + `dailyMeters`.
        //    BUT `Machine` model usually doesn't reset `dailyMeters` automatically unless use a cron job.
        //    SIMPLER APPROACH: Just update `completedMeters` and `totalTargetMeters` if provided, 
        //    and calculate `dailyMeters` as a display field or store it.
        //    Let's stick to the request: "update daily meters... calculate remaining".
        //    Let's treat `dailyMeters` as a field we simply set.
        //    And `completedMeters` as the total progress. 
        //    Wait, if I set daily meters to 500, does `completedMeters` increase by 500?
        //    If I come back and change 500 to 600, `completedMeters` should increase by 100 more.
        //    This requires knowing the PREVIOUS daily meters.

        //    ALTERNATIVE: The user might just want to see:
        //    Total Target: 1000
        //    Completed (Historical): 500
        //    Daily (Today): [Input 100]
        //    Pending: 1000 - 500 - 100 = 400.

        //    This seems safest. Store `dailyMeters`. Calculate `pending` on the fly (or store it).
        //    Then at end of day, a "Close Shift" button could add `dailyMeters` to `completedMeters` and reset `daily`.
        //    BUT currently there is no "Close Shift".
        //    So let's just update `dailyMeters` and let the frontend calculate "Pending" 
        //    as `Total - (Completed + Daily)`.
        //    AND also allow updating `completedMeters` manually if needed (start of new order).

        machine.dailyMeters = Number(dailyOutput);

        if (req.body.completedMeters !== undefined) {
            machine.completedMeters = Number(req.body.completedMeters);
        }

        if (req.body.totalTargetMeters !== undefined) {
            machine.totalTargetMeters = Number(req.body.totalTargetMeters);
        }

        if (req.body.currentOrder !== undefined) {
            machine.currentOrder = req.body.currentOrder;
        }

        const updatedMachine = await machine.save();
        res.json(updatedMachine);
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
