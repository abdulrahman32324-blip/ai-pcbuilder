import { Analytics } from "@vercel/analytics/react"
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BuildForm } from './components/BuildForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';
import { ComparisonModal } from './components/ComparisonModal';
import { InfoModal } from './components/InfoModal';
import type { PCBuild, Theme, BuildRequest } from './types';
import { generateBuilds } from './services/geminiService';
import { ICONS } from './constants';
import { translations } from './utils/i18n';

type ModalType = 'about' | 'terms' | 'privacy';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [builds, setBuilds] = useState<PCBuild[]>([]);
    const [savedBuilds, setSavedBuilds] = useState<PCBuild[]>([]);
    const [comparisonList, setComparisonList] = useState<PCBuild[]>([]);
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const savedBuildsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        setTheme(storedTheme || 'light');
        const storedBuilds = localStorage.getItem('savedBuilds');
        if (storedBuilds) {
            setSavedBuilds(JSON.parse(storedBuilds));
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.style.fontFamily = "'Roboto', sans-serif";
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleGenerateBuilds = async (request: BuildRequest) => {
        setIsLoading(true);
        setError(null);
        setBuilds([]);
        try {
            const result = await generateBuilds(request);
            setBuilds(result.map(b => ({ ...b, id: crypto.randomUUID() })));
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : translations.en.error.generationFailed);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleScrollToSaved = () => {
        savedBuildsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    
    const handleSaveBuild = (build: PCBuild) => {
        const newSavedBuilds = [...savedBuilds, { ...build, id: build.id || crypto.randomUUID() }];
        setSavedBuilds(newSavedBuilds);
        localStorage.setItem('savedBuilds', JSON.stringify(newSavedBuilds));
    };

    const handleUnsaveBuild = (buildId: string) => {
        const newSavedBuilds = savedBuilds.filter(b => b.id !== buildId);
        setSavedBuilds(newSavedBuilds);
        localStorage.setItem('savedBuilds', JSON.stringify(newSavedBuilds));
    };

    const handleToggleCompare = (build: PCBuild) => {
        setComparisonList(prev => {
            if (prev.find(b => b.id === build.id)) return prev.filter(b => b.id !== build.id);
            if (prev.length < 2) return [...prev, build];
            return [prev[1], build];
        });
    };
    
    const isBuildSaved = (buildId: string) => !!savedBuilds.find(b => b.id === buildId);
    const isBuildInCompare = (buildId: string) => !!comparisonList.find(b => b.id === buildId);

    const getModalContent = () => {
        if (!activeModal) return null;
        const t = translations.en.modals[activeModal];
        return { title: t.title, content: t.content };
    }

    return (
        <div className="bg-slate-50 dark:bg-[#0B1120] text-gray-800 dark:text-gray-200 min-h-screen flex flex-col transition-colors duration-300">
            <Header 
                theme={theme}
                onToggleTheme={toggleTheme}
                onShowSaved={handleScrollToSaved}
                hasSavedBuilds={savedBuilds.length > 0}
            />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                <Hero />
                <BuildForm onGenerate={handleGenerateBuilds} isLoading={isLoading} />
                
                <div className="mt-16">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <div className="animate-spin">{ICONS.loader(8)}</div>
                            <p className="mt-4 text-lg font-semibold">{translations.en.loading.title}</p>
                            <p className="text-gray-600 dark:text-gray-400">{translations.en.loading.message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center p-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded-lg">
                            <p className="font-bold text-red-700 dark:text-red-400">{translations.en.error.title}</p>
                            <p className="text-red-600 dark:text-red-500">{error}</p>
                        </div>
                    )}
                    
                    {builds.length > 0 && (
                        <ResultsDisplay
                            title={translations.en.results.title}
                            builds={builds}
                            isBuildSaved={isBuildSaved}
                            isBuildInCompare={isBuildInCompare}
                            onSaveToggle={ (build) => isBuildSaved(build.id!) ? handleUnsaveBuild(build.id!) : handleSaveBuild(build)}
                            onCompareToggle={handleToggleCompare}
                        />
                    )}
                    
                    {savedBuilds.length > 0 && (
                         <div ref={savedBuildsRef} className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-20">
                            <ResultsDisplay
                                title={translations.en.savedBuilds.title}
                                builds={savedBuilds}
                                isBuildSaved={isBuildSaved}
                                isBuildInCompare={isBuildInCompare}
                                onSaveToggle={(build) => handleUnsaveBuild(build.id!)}
                                onCompareToggle={handleToggleCompare}
                            />
                         </div>
                    )}
                </div>
            </main>

            <Footer onLinkClick={setActiveModal} />
            
            {comparisonList.length === 2 && (
                <ComparisonModal
                    builds={comparisonList as [PCBuild, PCBuild]}
                    onClose={() => setComparisonList([])}
                />
            )}
            {activeModal && getModalContent() && (
                <InfoModal 
                    title={getModalContent()!.title}
                    content={getModalContent()!.content}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </div> 
    );
};

<Analytics />
export default App;