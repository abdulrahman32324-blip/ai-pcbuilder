import React from 'react';
import { ICONS } from '../constants';

interface InfoModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ title, content, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">

                    <h2 className="text-xl font-bold text-[#f8fafc]">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close modal">
                        {ICONS.close}
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
};