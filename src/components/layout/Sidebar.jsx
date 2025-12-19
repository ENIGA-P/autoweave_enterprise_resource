import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, ShoppingCart, Activity, FileText, LogOut, Database, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/machines', label: 'Machines', icon: Activity },
        { path: '/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/production', label: 'Production', icon: Settings },
        { path: '/reports', label: 'Reports', icon: FileText },
        { path: '/data-management', label: 'Data Management', icon: Database },
        { path: '/workers', label: 'Workers', icon: Users },
        { path: '/payroll', label: 'Payroll', icon: FileText },
    ];

    return (
        <div className="w-64 bg-white border-r-2 border-pastel-mint-200 h-screen flex flex-col shadow-soft">
            <div className="p-6 border-b-2 border-pastel-mint-200 bg-gradient-to-br from-pastel-mint-50 to-pastel-lavender-50">
                <h1 className="text-2xl font-bold text-text-primary">AutoWeave</h1>
                <p className="text-xs text-text-secondary mt-1">Industrial ERP System</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold border-2 border-transparent shadow-soft'
                                    : 'text-text-secondary hover:bg-pastel-mint-50 hover:text-text-primary border-2 border-transparent'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" strokeWidth={2.5} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t-2 border-pastel-mint-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-text-secondary hover:text-status-faulty-text hover:bg-status-faulty-light rounded-xl transition-all duration-200 border-2 border-transparent hover:border-status-faulty-main"
                >
                    <LogOut className="w-5 h-5" strokeWidth={2.5} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
