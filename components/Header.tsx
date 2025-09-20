import React from 'react';
import type { Theme } from '../types';
import { ICONS } from '../constants';
import { translations } from '../utils/i18n';

interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
    onShowSaved: () => void;
    hasSavedBuilds: boolean;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onShowSaved, hasSavedBuilds }) => {
    const t = translations.en;
    return (
        <header className="bg-slate-50/80 dark:bg-[#0B1120]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logoo.png" alt="AI-PCBuilder Logo" className="w-12 h-12" />
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{t.header}</span>
                </div>
                <div className="flex items-center gap-2">
                     {hasSavedBuilds && (
                        <button
                            onClick={onShowSaved}
                            className="p-2 rounded-full flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                            aria-label="Show Saved Builds"
                        >
                            {ICONS.savedCollection}
                            <span className="hidden sm:inline text-sm font-semibold">{translations.en.savedBuilds.title}</span>
                        </button>
                     )}
                     <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                        aria-label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    >
                        {theme === 'light' ? ICONS.moon : ICONS.sun}
                    </button>
                </div>
            </div>
        </header>
    );
};