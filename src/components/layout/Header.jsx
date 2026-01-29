import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, User } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';

const Header = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b-2 border-pastel-lavender-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-soft">
            <div className="text-text-primary dark:text-white">
                <span className="font-bold text-lg">{t('nav.dashboard')}</span>
            </div>

            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
                <button className="p-2.5 text-text-secondary dark:text-gray-300 hover:text-text-primary dark:hover:text-white hover:bg-pastel-lavender-50 dark:hover:bg-gray-700 rounded-xl transition-all relative border-2 border-transparent hover:border-pastel-lavender-300 dark:hover:border-gray-600">
                    <Bell className="w-5 h-5" strokeWidth={2.5} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-status-faulty-main rounded-full border-2 border-white dark:border-gray-800"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l-2 border-pastel-lavender-200 dark:border-gray-700">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-text-primary dark:text-white">{user?.name || 'Owner'}</div>
                        <div className="text-xs text-text-secondary dark:text-gray-400 capitalize">{user?.role || 'Role'}</div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint-200 to-pastel-lavender-200 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center border-2 border-pastel-mint-400 dark:border-gray-400 text-text-primary dark:text-white shadow-soft">
                        <User className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
