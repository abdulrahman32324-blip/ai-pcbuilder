import React from 'react';
import type { PCBuild } from '../types';
import { ICONS } from '../constants';
import { translations } from '../utils/i18n';

interface ComparisonModalProps {
    builds: [PCBuild, PCBuild];
    onClose: () => void;
}

const ComparisonRow: React.FC<{
    label: string;
    value1: React.ReactNode;
    value2: React.ReactNode;
    isDifferent: boolean;
}> = ({ label, value1, value2, isDifferent }) => {
    const rowClass = `border-b dark:border-gray-700 transition-colors ${
        isDifferent ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'bg-white dark:bg-gray-800'
    }`;
    return (
        <tr className={rowClass}>
            <td className="px-6 py-4 font-bold">{label}</td>
            <td className="px-6 py-4">{value1}</td>
            <td className="px-6 py-4">{value2}</td>
        </tr>
    );
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ builds, onClose }) => {
    const t = translations.en;
    const [build1, build2] = builds;

    const formatCurrency = (amount: number, currency: string) => 
        new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount);

    const allComponentTypes: Array<PCBuild['components'][0]['type']> = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case'];

    const getComponent = (build: PCBuild, type: string) => build.components.find(c => c.type === type);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-[#f8fafc]">{t.comparison.title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close modal">
                        {ICONS.close}
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-1/4">{t.comparison.feature}</th>
                                <th scope="col" className="px-6 py-3">{build1.buildName}</th>
                                <th scope="col" className="px-6 py-3">{build2.buildName}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow
                                label={t.results.totalPrice}
                                value1={<span className="font-bold text-lg">{formatCurrency(build1.totalPrice, build1.currency)}</span>}
                                value2={<span className="font-bold text-lg">{formatCurrency(build2.totalPrice, build2.currency)}</span>}
                                isDifferent={build1.totalPrice !== build2.totalPrice}
                            />
                             <ComparisonRow
                                label={t.results.performance}
                                value1={build1.performance}
                                value2={build2.performance}
                                isDifferent={build1.performance !== build2.performance}
                            />
                            {allComponentTypes.map((type) => {
                                const comp1 = getComponent(build1, type);
                                const comp2 = getComponent(build2, type);
                                const isDifferent = comp1?.name !== comp2?.name;
                                
                                const renderComponent = (comp: typeof comp1, currency: string) => {
                                    if (!comp) return 'N/A';
                                    return (
                                        <div>
                                            <p className="font-semibold">{comp.name}</p>
                                            <p className="text-xs text-gray-500">{formatCurrency(comp.price || 0, currency)}</p>
                                        </div>
                                    );
                                };

                                return (
                                    <ComparisonRow
                                        key={type}
                                        label={type}
                                        value1={renderComponent(comp1, build1.currency)}
                                        value2={renderComponent(comp2, build2.currency)}
                                        isDifferent={isDifferent}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right sticky bottom-0 bg-white dark:bg-gray-800">
                    <button onClick={onClose} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};