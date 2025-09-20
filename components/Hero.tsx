import React from 'react';
import { translations } from '../utils/i18n';

export const Hero: React.FC = () => {
    const t = translations.en;
    return (
        <section className="text-center">
            <div className="inline-block bg-gray-200/80 dark:bg-gray-700/50 rounded-full px-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                {t.hero.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 py-2">
                {t.hero.title}
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t.hero.subtitle}
            </p>
        </section>
    );
};