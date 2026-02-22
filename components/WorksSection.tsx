
import React, { useState, useMemo, useRef } from 'react';
import { Project } from '../types';
import AnimatedBackground from './AnimatedBackground';
import { useLanguage } from '../contexts/LanguageContext';
import EditableImage from './EditableImage';

interface WorksSectionProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

const WorksSection: React.FC<WorksSectionProps> = ({ projects, onProjectClick }) => {
    const { t } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('All');
    const sectionRef = useRef<HTMLElement>(null);

    const categories = useMemo(() => {
        const types = projects
            .map(p => p.projectType)
            .filter((type): type is string => !!type);
        return ['All', ...Array.from(new Set(types))];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter(project => project.projectType === activeFilter);
    }, [projects, activeFilter]);

    const getDirectionClass = (index: number) => {
        const col = index % 3;
        if (col === 0) return 'fade-in-left';
        if (col === 1) return 'fade-in-up';
        return 'fade-in-right';
    };

    const handleKeyDown = (e: React.KeyboardEvent, project: Project) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onProjectClick(project);
        }
    };

    return (
        <section id="works" ref={sectionRef} className="py-20 px-8 relative overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <AnimatedBackground />
            <div className="relative z-10 container mx-auto max-w-6xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700 dark:text-indigo-400 animate-on-scroll zoom-in">{t.works.title}</h2>
                
                <div className="flex flex-wrap justify-center gap-3 mb-12 animate-on-scroll fade-in-up">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                                activeFilter === category
                                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-400 shadow-sm'
                            }`}
                            aria-pressed={activeFilter === category}
                            aria-label={`Filter by ${category}`}
                        >
                            {category === 'All' ? t.works.filterAll : category}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]" role="list">
                    {filteredProjects.map((project, index) => (
                        <div
                            key={project.id} 
                            onClick={() => onProjectClick(project)}
                            onKeyDown={(e) => handleKeyDown(e, project)}
                            tabIndex={0}
                            role="button"
                            aria-label={`${t.works.viewAll}: ${project.title}`}
                            className={`work-item group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out relative animate-on-scroll ${getDirectionClass(index)} w-full text-left bg-white dark:bg-gray-900 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/50`}
                        >
                            <div className="relative h-72 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <EditableImage 
                                    storageKey={`project-cover-${project.id}`}
                                    defaultSrc={project.coverImage}
                                    alt=""
                                    wrapperClassName="w-full h-full"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                            </div>
                            
                            <div 
                                className="absolute inset-0 bg-indigo-950/80 backdrop-blur-[3px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 p-6 pointer-events-none"
                            >
                                <h3 className="text-white text-2xl font-bold text-center mb-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                    {project.title}
                                </h3>
                                
                                {project.projectType && (
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-100 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full transform translate-y-6 group-hover:translate-y-0 transition-all duration-300 delay-100 ease-out">
                                        {project.projectType}
                                    </span>
                                )}
                                
                                <div className="mt-6 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-indigo-900 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full text-center py-12 animate-on-scroll fade-in-up">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t.works.noProjects}</p>
                            <button 
                                onClick={() => setActiveFilter('All')}
                                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
                            >
                                {t.works.viewAll}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default WorksSection;
