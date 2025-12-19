import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

const initialData = {
    machines: [],
    orders: [],
    production: [],
    dashboardMetrics: {
        totalProduction: 0,
        activeMachines: 0,
        efficiency: 0,
        pendingOrders: 0,
    },
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        machines: [],
        orders: [],
        production: [],
        dashboardMetrics: {
            totalProduction: 0,
            activeMachines: 0,
            efficiency: 0,
            pendingOrders: 0,
        },
    });

    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:5000/api';

    const fetchData = async () => {
        try {
            const [machinesRes, ordersRes, productionRes] = await Promise.all([
                fetch(`${API_URL}/machines`),
                fetch(`${API_URL}/orders`),
                fetch(`${API_URL}/production`)
            ]);

            const machines = await machinesRes.json();
            const orders = await ordersRes.json();
            const production = await productionRes.json();

            // Map _id to id for frontend compatibility
            const formatData = (items) => items.map(item => ({ ...item, id: item._id }));

            setData(prev => ({
                ...prev,
                machines: formatData(machines),
                orders: formatData(orders),
                production: formatData(production),
                // Recalculate metrics based on fetched data
                dashboardMetrics: {
                    totalProduction: production.reduce((acc, curr) => acc + (curr.output || 0), 0),
                    activeMachines: machines.filter(m => m.status === 'running').length,
                    efficiency: machines.length > 0
                        ? Math.round(machines.reduce((acc, curr) => acc + (curr.efficiency || 0), 0) / machines.length)
                        : 0,
                    pendingOrders: orders.filter(o => o.status === 'pending').length,
                }
            }));
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Optional: Polling
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Machine CRUD
    const addMachine = async (machine) => {
        try {
            const res = await fetch(`${API_URL}/machines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(machine)
            });
            const newMachine = await res.json();
            setData(prev => ({ ...prev, machines: [...prev.machines, { ...newMachine, id: newMachine._id }] }));
        } catch (error) {
            console.error("Error adding machine", error);
        }
    };

    const updateMachine = async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/machines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const updated = await res.json();
            setData(prev => ({
                ...prev,
                machines: prev.machines.map(m => m.id === id ? { ...updated, id: updated._id } : m)
            }));
        } catch (error) {
            console.error("Error updating machine", error);
        }
    };

    const deleteMachine = async (id) => {
        try {
            await fetch(`${API_URL}/machines/${id}`, { method: 'DELETE' });
            setData(prev => ({
                ...prev,
                machines: prev.machines.filter(m => m.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting machine", error);
        }
    };

    // Order CRUD
    const addOrder = async (order) => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            const newOrder = await res.json();
            setData(prev => ({ ...prev, orders: [...prev.orders, { ...newOrder, id: newOrder._id }] }));
        } catch (error) {
            console.error("Error adding order", error);
        }
    };

    const updateOrder = async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const updated = await res.json();
            setData(prev => ({
                ...prev,
                orders: prev.orders.map(o => o.id === id ? { ...updated, id: updated._id } : o)
            }));
        } catch (error) {
            console.error("Error updating order", error);
        }
    };

    const deleteOrder = async (id) => {
        try {
            await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
            setData(prev => ({
                ...prev,
                orders: prev.orders.filter(o => o.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting order", error);
        }
    };

    // Production CRUD
    const addProduction = async (entry) => {
        try {
            const res = await fetch(`${API_URL}/production`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            const newEntry = await res.json();
            setData(prev => ({ ...prev, production: [...prev.production, { ...newEntry, id: newEntry._id }] }));
        } catch (error) {
            console.error("Error adding production", error);
        }
    };

    const updateDashboardMetrics = (metrics) => {
        // Metrics are now largely computed from DB data, but if there are manual overrides:
        setData(prev => ({ ...prev, dashboardMetrics: { ...prev.dashboardMetrics, ...metrics } }));
    };

    const value = {
        data,
        loading,
        addMachine,
        updateMachine,
        deleteMachine,
        addOrder,
        updateOrder,
        deleteOrder,
        addProduction,
        updateDashboardMetrics,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
