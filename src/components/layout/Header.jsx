import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b-2 border-pastel-lavender-200 flex items-center justify-between px-6 shadow-soft">
            <div className="text-text-primary">
                <span className="font-bold text-lg">Overview</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-pastel-lavender-50 rounded-xl transition-all relative border-2 border-transparent hover:border-pastel-lavender-300">
                    <Bell className="w-5 h-5" strokeWidth={2.5} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-status-faulty-main rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l-2 border-pastel-lavender-200">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-text-primary">{user?.name || 'Owner'}</div>
                        <div className="text-xs text-text-secondary capitalize">{user?.role || 'Role'}</div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint-200 to-pastel-lavender-200 rounded-full flex items-center justify-center border-2 border-pastel-mint-400 text-text-primary shadow-soft">
                        <User className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
