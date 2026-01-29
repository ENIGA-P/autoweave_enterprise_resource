import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gradient-to-br from-lime-100 via-orange-100 to-sky-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
