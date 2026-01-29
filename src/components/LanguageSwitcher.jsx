import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
    ];

    return (
        <div className="relative">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 pr-8 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
                aria-label="Choose language"
            >
                {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
