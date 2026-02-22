
import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import { useLanguage } from '../contexts/LanguageContext';

const ExperienceItem: React.FC<{ title: string; company: string; period: string; description: string }> = ({ title, company, period, description }) => (
    <div className="relative pl-8 sm:pl-12 py-6 group animate-on-scroll fade-in-left">
        <div className="flex items-center mb-1">
            <div className="absolute left-0 h-full w-px bg-indigo-200 dark:bg-indigo-900"></div>
            <div className="absolute left-[-8px] w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-800 group-hover:bg-indigo-700 transition-colors"></div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{company} | {period}</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
            {description}
        </p>
    </div>
);


const ExperienceSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="experience" className="py-20 px-8 relative overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <AnimatedBackground />
            <div className="relative z-10 container mx-auto max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-400 animate-on-scroll zoom-in">{t.experience.title}</h2>
                <div className="relative">
                    <ExperienceItem 
                        title={t.experience.jobs[0].title}
                        company={t.experience.jobs[0].company}
                        period={t.experience.jobs[0].period}
                        description={t.experience.jobs[0].description}
                    />
                    <ExperienceItem 
                        title={t.experience.jobs[1].title}
                        company={t.experience.jobs[1].company}
                        period={t.experience.jobs[1].period}
                        description={t.experience.jobs[1].description}
                    />
                    <ExperienceItem 
                        title={t.experience.jobs[2].title}
                        company={t.experience.jobs[2].company}
                        period={t.experience.jobs[2].period}
                        description={t.experience.jobs[2].description}
                    />
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
