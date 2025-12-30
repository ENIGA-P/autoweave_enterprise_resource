import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import machineRoutes from './routes/machineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productionRoutes from './routes/productionRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/autoweave')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/machines', machineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/metrics', metricsRoutes);

app.get('/', (req, res) => {
    res.send('AutoWeave Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
