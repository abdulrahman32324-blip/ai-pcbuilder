import React, { useState } from 'react';
import type { PCBuild } from '../types';
import { ICONS } from '../constants';
import { translations } from '../utils/i18n';
import { exportBuildToPdf } from '../utils/pdfGenerator';

interface BuildCardProps {
    build: PCBuild;
    isSaved: boolean;
    isInCompare: boolean;
    onSaveToggle: () => void;
    onCompareToggle: () => void;
}

export const BuildCard: React.FC<BuildCardProps> = ({ build, isSaved, isInCompare, onSaveToggle, onCompareToggle }) => {
    const t = translations.en;
    const cardId = `build-card-${build.id}`;
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en', { style: 'currency', currency: build.currency }).format(amount);

    const getShareText = () => {
        const componentsText = build.components.map(c => `${c.type}: ${c.name} (${formatCurrency(c.price!)})`).join('\n');
        return `${t.share.text}\n\n*${build.buildName}* - ${formatCurrency(build.totalPrice)}\n\n${componentsText}\n\n${t.share.via}`;
    };

    const handleShare = (platform: 'twitter' | 'whatsapp') => {
        const shareText = getShareText();
        const encodedText = encodeURIComponent(shareText);
        
        let url = '';
        if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        } else if (platform === 'whatsapp') {
            url = `https://api.whatsapp.com/send?text=${encodedText}`;
        }
        
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleCopy = () => {
        const shareText = getShareText().replace(/\*/g, ''); // Remove markdown for plain text copy
        navigator.clipboard.writeText(shareText);
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    };

    return (
        <div id={cardId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="p-6">
                <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 truncate">{build.buildName}</h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{formatCurrency(build.totalPrice)}</p>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3 font-medium">
                    <span className="flex items-center gap-1.5" title={t.results.targetPerformance}>
                        {ICONS.target}
                        {build.targetResolution} / ~{build.averageFps} FPS
                    </span>
                    {build.estimatedWattage && (
                         <span className="flex items-center gap-1.5" title={t.results.wattage}>
                            {ICONS.wattage}
                            {build.estimatedWattage}W
                         </span>
                    )}
                </div>
            </div>
            
            <div className="px-6 pb-6 flex-grow">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{t.results.components}</h4>
                <ul className="space-y-2 text-sm">
                    {build.components.map((comp, i) => (
                        <li key={i} className="flex justify-between items-start bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                            <span className="font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap mr-2">{comp.type}</span>
                             <div className="text-right">
                                <a href={comp.priceLink} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                                    {comp.name}
                                </a>
                                {comp.specs && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{comp.specs}</p>
                                )}
                                {comp.price && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.results.estPrice}: {formatCurrency(comp.price)}</p>
                                )}
                             </div>
                        </li>
                    ))}
                </ul>

                <h4 className="font-semibold mt-6 mb-2 text-gray-700 dark:text-gray-300">{t.results.performance}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{build.performance}</p>
                
                 {build.gamePerformance && build.gamePerformance.length > 0 && (
                    <>
                        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{t.results.gamePerformance}</h4>
                         <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-2 py-2 border border-gray-200 dark:border-gray-600">{t.results.game}</th>
                                    <th scope="col" className="px-2 py-2 border border-gray-200 dark:border-gray-600">{t.results.settings}</th>
                                    <th scope="col" className="px-2 py-2 text-right border border-gray-200 dark:border-gray-600">{t.results.fps}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {build.gamePerformance.map((game, i) => (
                                    <tr key={i} className="bg-white dark:bg-gray-800">
                                        <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-200 dark:border-gray-700">{game.gameName}</td>
                                        <td className="px-2 py-2 border border-gray-200 dark:border-gray-700">{game.settings}</td>
                                        <td className="px-2 py-2 text-right font-mono border border-gray-200 dark:border-gray-700">{game.fps}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around gap-2 flex-wrap">
                <ActionButton onClick={onSaveToggle} icon={isSaved ? ICONS.saved : ICONS.save} text={isSaved ? t.results.saved : t.results.save} active={isSaved} />
                <ActionButton onClick={onCompareToggle} icon={ICONS.compare} text={isInCompare ? t.results.comparing : t.results.compare} active={isInCompare} />
                <ActionButton onClick={() => exportBuildToPdf(cardId, build.buildName)} icon={ICONS.pdf} text={t.results.pdf} />
                <div className="relative group">
                     <ActionButton onClick={() => {}} icon={ICONS.share} text={t.results.share} />
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto flex justify-around p-2">
                         <button onClick={() => handleShare('twitter')} title="Share on Twitter" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">{ICONS.twitter}</button>
                         <button onClick={() => handleShare('whatsapp')} title="Share on WhatsApp" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">{ICONS.whatsapp}</button>
                         <button onClick={handleCopy} title={copyStatus === 'idle' ? t.results.copy : t.results.copied} className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">
                            {copyStatus === 'copied' ? ICONS.saved : ICONS.copy}
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

const ActionButton: React.FC<{onClick: () => void, icon: React.ReactNode, text: string, active?: boolean}> = ({onClick, icon, text, active}) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
            active
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-900/50'
        }`}
    >
        {icon}
        <span>{text}</span>
    </button>
);