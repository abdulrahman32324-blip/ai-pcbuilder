import React from 'react';
import { BuildCard } from './BuildCard';
import type { PCBuild } from '../types';

interface ResultsDisplayProps {
    title: string;
    builds: PCBuild[];
    isBuildSaved: (buildId: string) => boolean;
    isBuildInCompare: (buildId: string) => boolean;
    onSaveToggle: (build: PCBuild) => void;
    onCompareToggle: (build: PCBuild) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ title, builds, ...props }) => {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {builds.map((build, index) => (
                    <BuildCard
                        key={build.id || index}
                        build={build}
                        isSaved={props.isBuildSaved(build.id!)}
                        isInCompare={props.isBuildInCompare(build.id!)}
                        onSaveToggle={() => props.onSaveToggle(build)}
                        onCompareToggle={() => props.onCompareToggle(build)}
                    />
                ))}
            </div>
        </section>
    );
};