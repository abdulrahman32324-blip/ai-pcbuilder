import React, { useState } from 'react';
import type { BuildRequest } from '../types';
import { translations } from '../utils/i18n';

interface BuildFormProps {
    onGenerate: (request: BuildRequest) => void;
    isLoading: boolean;
}

export const BuildForm: React.FC<BuildFormProps> = ({ onGenerate, isLoading }) => {
    const t = translations.en.form;
    const [formData, setFormData] = useState<BuildRequest>({
        budget: 1500,
        currency: 'USD',
        count: 3,
        purpose: 'Gaming',
        performanceTier: 'Mid-Range',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'budget' || name === 'count' ? Number(value) : value,
        }));
    };
    
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const budgetValue = Number(e.target.value);
        setFormData(prev => ({ ...prev, budget: budgetValue }));
        const progress = (budgetValue - 350) / (5000 - 350) * 100;
        const parent = e.target.closest('.budget-slider-container');
        if (parent instanceof HTMLElement) {
            parent.style.setProperty('--progress', `${progress}%`);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onGenerate(formData);
    };

    return (
        <section className="mt-12 max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-8">{t.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Budget and Count */}
                    <div className="space-y-8">
                        {/* Budget Section */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-baseline">
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.budget}</label>
                                <span className="font-semibold text-lg">{new Intl.NumberFormat('en', { style: 'currency', currency: formData.currency, maximumFractionDigits: 0 }).format(formData.budget)}</span>
                            </div>
                            <div className="flex items-center">
                                <select
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="rounded-l-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-purple-500 focus:border-purple-500 text-sm h-11"
                                >
                                    <option>USD</option>
                                    
                                </select>
                                <input
                                    type="number"
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleBudgetChange}
                                    min="350"
                                    max="5000"
                                    step="50"
                                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    required
                                />
                            </div>
                             <div className="pt-2 budget-slider-container slider-track-progress rounded-lg">
                                <input
                                    type="range"
                                    id="budget-slider"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleBudgetChange}
                                    min="350"
                                    max="5000"
                                    step="50"
                                />
                            </div>
                        </div>
                        {/* Number of Builds Section */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.builds}</label>
                            <div className="flex segmented-control">
                                {[1, 2, 3].map(val => (
                                    <React.Fragment key={val}>
                                        <input type="radio" id={`count-${val}`} name="count" value={val} checked={formData.count === val} onChange={handleChange} />
                                        <label htmlFor={`count-${val}`}>{val}</label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Purpose and Tier */}
                    <div className="space-y-8">
                         <div>
                            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.purpose}</label>
                            <select
                                id="purpose"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                                <option>Gaming</option>
                                <option>Streaming</option>
                                <option>Content Creation</option>
                                <option>Workstation</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="performanceTier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.performanceTier}</label>
                            <select
                                id="performanceTier"
                                name="performanceTier"
                                value={formData.performanceTier}
                                onChange={handleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                                <option>Budget</option>
                                <option>Mid-Range</option>
                                <option>High-End</option>
                                <option>Enthusiast</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notes Section - Full Width */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.notes}</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder={t.notesPlaceholder}
                        className="block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                
                <div className="text-center pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                        {isLoading ? t.generating : t.generate}
                    </button>
                </div>
            </form>
        </section>
    );
};