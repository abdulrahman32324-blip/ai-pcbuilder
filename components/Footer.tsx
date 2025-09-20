import React from 'react';
import { translations } from '../utils/i18n';
import { ICONS } from '../constants';

interface FooterProps {
    onLinkClick: (modal: 'about' | 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
    const t = translations.en;
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-12 mt-16 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div className="space-y-4">
                     <div className="flex items-center gap-2">
                                        <img src="/logoo.png" alt="AI-PCBuilder Logo" className="w-12 h-12" />
                        <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{t.header}</span>
                    </div>
                    <p className="max-w-xs">{t.hero.subtitle}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{t.footer.about}</h3>
                    <nav className="flex flex-col space-y-2">
                        <button onClick={() => onLinkClick('about')} className="text-left hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{t.footer.about}</button>
                    </nav>
                </div>
                
                <div className="space-y-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Legal</h3>
                     <nav className="flex flex-col space-y-2">
                        <button onClick={() => onLinkClick('terms')} className="text-left hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{t.footer.terms}</button>
                        <button onClick={() => onLinkClick('privacy')} className="text-left hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{t.footer.privacy}</button>
                    </nav>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-xs">
                <p>{t.footer.copyright}</p>
            </div>
        </footer>
    );
};