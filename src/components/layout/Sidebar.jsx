import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, ShoppingCart, Activity, FileText, LogOut, Database, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { clsx } from 'clsx';

const Sidebar = () => {
    const { logout } = useAuth();
    const { t } = useLanguage();

    const navItems = [
        { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
        { path: '/machines', label: t('nav.machines'), icon: Activity },
        { path: '/orders', label: t('nav.orders'), icon: ShoppingCart },
        { path: '/production', label: t('nav.production'), icon: Settings },
        { path: '/reports', label: t('nav.reports'), icon: FileText },
        { path: '/data-management', label: t('nav.dataManagement'), icon: Database },
        { path: '/workers', label: t('nav.workers'), icon: Users },
        { path: '/payroll', label: t('nav.payroll'), icon: FileText },
    ];

    return (
        <div className="w-64 bg-white dark:bg-gray-900 border-r-2 border-pastel-mint-200 dark:border-gray-700 h-screen flex flex-col shadow-soft">
            <div className="p-6 border-b-2 border-pastel-mint-200 dark:border-gray-700 bg-gradient-to-br from-pastel-mint-50 to-pastel-lavender-50 dark:from-gray-800 dark:to-gray-800">
                <h1 className="text-2xl font-bold text-text-primary dark:text-white">AutoWeave</h1>
                <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">Industrial ERP System</p>
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
                                    : 'text-text-secondary dark:text-gray-400 hover:bg-pastel-mint-50 dark:hover:bg-gray-800 hover:text-text-primary dark:hover:text-white border-2 border-transparent'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" strokeWidth={2.5} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t-2 border-pastel-mint-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-text-secondary dark:text-gray-400 hover:text-status-faulty-text hover:bg-status-faulty-light dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-status-faulty-main"
                >
                    <LogOut className="w-5 h-5" strokeWidth={2.5} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
