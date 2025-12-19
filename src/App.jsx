import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import MachineList from './pages/machines/MachineList';
import MachineDetail from './pages/machines/MachineDetail';
import OrderList from './pages/orders/OrderList';
import OrderForm from './pages/orders/OrderForm';
import ProductionEntry from './pages/production/ProductionEntry';
import Reports from './pages/reports/Reports';
import DataManagement from './pages/settings/DataManagement';
import WorkerList from './pages/workers/WorkerList';
import WorkerForm from './pages/workers/WorkerForm';
import Payroll from './pages/payroll/Payroll';

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />

                        <Route path="/machines" element={<ProtectedRoute><MainLayout><MachineList /></MainLayout></ProtectedRoute>} />
                        <Route path="/machines/:id" element={<ProtectedRoute><MainLayout><MachineDetail /></MainLayout></ProtectedRoute>} />

                        <Route path="/orders" element={<ProtectedRoute><MainLayout><OrderList /></MainLayout></ProtectedRoute>} />
                        <Route path="/orders/new" element={<ProtectedRoute><MainLayout><OrderForm /></MainLayout></ProtectedRoute>} />

                        <Route path="/production" element={<ProtectedRoute><MainLayout><ProductionEntry /></MainLayout></ProtectedRoute>} />

                        <Route path="/reports" element={<ProtectedRoute><MainLayout><Reports /></MainLayout></ProtectedRoute>} />

                        <Route path="/data-management" element={<ProtectedRoute><MainLayout><DataManagement /></MainLayout></ProtectedRoute>} />

                        <Route path="/workers" element={<ProtectedRoute><MainLayout><WorkerList /></MainLayout></ProtectedRoute>} />
                        <Route path="/workers/new" element={<ProtectedRoute><MainLayout><WorkerForm /></MainLayout></ProtectedRoute>} />
                        <Route path="/payroll" element={<ProtectedRoute><MainLayout><Payroll /></MainLayout></ProtectedRoute>} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;
