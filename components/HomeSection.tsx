
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import EditableImage from './EditableImage';

const SnowOverlay: React.FC = () => {
    // Memoize snowflakes to prevent re-rendering on every parent update
    const flakes = useMemo(() => {
        return new Array(50).fill(0).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 5 + Math.random() * 10, // 5-15s
            animationDelay: Math.random() * 15, // 0-15s delay
            opacity: 0.4 + Math.random() * 0.6,
            size: 2 + Math.random() * 4 // 2-6px
        }));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden print:hidden" aria-hidden="true">
             {flakes.map((flake) => (
                 <div 
                    key={flake.id}
                    className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                    style={{
                        left: `${flake.left}%`,
                        top: '-10px', // Start slightly above
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        opacity: flake.opacity,
                        animation: `snowfall ${flake.animationDuration}s linear infinite`,
                        animationDelay: `-${flake.animationDelay}s` // Negative delay to start mid-animation
                    }}
                 />
             ))}
        </div>
    );
};

const HomeSection: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleVolumeChange = () => setIsMuted(video.muted);

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('volumechange', handleVolumeChange);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('volumechange', handleVolumeChange);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch((error) => {
                    console.error("Autoplay prevented or interrupted:", error);
                });
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    return (
        <section id="home" className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden group print:min-h-0 print:p-0 print:block">
            {/* Video Background */}
            <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline 
                poster="https://placehold.co/1920x1080/1e1b4b/FFFFFF?text=Jaakko+Design"
                className="absolute top-0 left-0 w-full h-full object-cover z-0 print:hidden"
                aria-hidden="true"
                tabIndex={-1}
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-blue-fluid-smoke-43093-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Snow Animation Overlay */}
            <SnowOverlay />

            {/* Reduced overlay opacity (from 50% to 20%) to make animation significantly more visible */}
            <div className="absolute inset-0 bg-gray-900/20 z-0 pointer-events-none print:hidden"></div>
            {/* Gradient for text readability - slightly lighter than before */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-transparent to-gray-900/80 z-0 pointer-events-none print:hidden"></div>

            {/* Video Controls - Positioned bottom-left with better mobile spacing */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 ease-in-out print:hidden">
                <button 
                    onClick={togglePlay}
                    className="p-2.5 bg-white/10 backdrop-blur-md hover:bg-white/25 rounded-full text-white/90 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 border border-white/10 shadow-lg"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    aria-pressed={isPlaying}
                    title={isPlaying ? "Pause background" : "Play background"}
                >
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3.86987C5 2.53654 6.44444 1.70321 7.6 2.36988L20.6 9.86988C21.7556 10.5365 21.7556 12.2032 20.6 12.8699L7.6 20.3699C6.44444 21.0365 5 20.2032 5 18.8699V3.86987Z"/></svg>
                    )}
                </button>
                <button 
                    onClick={toggleMute}
                    className="p-2.5 bg-white/10 backdrop-blur-md hover:bg-white/25 rounded-full text-white/90 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 border border-white/10 shadow-lg"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    aria-pressed={isMuted}
                    title={isMuted ? "Unmute sound" : "Mute sound"}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    )}
                </button>
            </div>

            {/* Main content container with adjusted padding for header clearance and better mobile spacing */}
            <div className="relative z-10 max-w-4xl mx-auto text-white w-full flex flex-col items-center justify-center pt-24 pb-16 md:py-0 print:text-black print:block print:pt-0 print:pb-0 print:w-full">
                {/* Print only contact info */}
                <div className="hidden print:block text-gray-600 mb-6 text-sm text-center">
                    <p>jaakko.kkallio@gmail.com &bull; +358 442457835 &bull; {t.home.location}</p>
                    <p>www.jaakkodesign.com</p>
                </div>

                <div className="flex flex-col-reverse md:flex-col items-center gap-6 sm:gap-8 print:block print:clearfix">
                     {/* Text color light blue (blue-200), reduced size for mobile */}
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4 animate-on-scroll zoom-in text-blue-200 drop-shadow-lg leading-tight print:text-4xl print:text-black print:drop-shadow-none print:mb-2">{t.home.greeting}</h1>
                    
                    {/* Responsive image size: Larger on all screens for prominence, distinct white sticker-like border */}
                    <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 mx-auto bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-[6px] border-white group/avatar animate-on-scroll zoom-in print:float-right print:w-32 print:h-32 print:shadow-none print:border-0 print:mb-4 relative" style={{ transitionDelay: '0.4s' }}>
                         <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 z-10 rounded-full pointer-events-none"></div>
                        <EditableImage 
                            storageKey="home-avatar"
                            defaultSrc="https://lh3.googleusercontent.com/a/ACg8ocIbYAtYBynI5k_UqBs1sOOl8RnaqJ3VHv89wBhQZTyr4OOJ2EtFHQ=s288-c-no"
                            alt="Jaakko"
                            wrapperClassName="w-full h-full"
                            className="w-full h-full object-cover transform group-hover/avatar:scale-110 transition-transform duration-700 ease-in-out"
                        />
                    </div>
                </div>

                <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-8 animate-on-scroll fade-in-up text-white/90 drop-shadow-md print:text-black print:drop-shadow-none print:text-left print:text-xl print:font-bold print:mb-4" style={{ transitionDelay: '0.2s' }}>{t.home.role}</p>
                
                <p className="mt-4 sm:mt-8 text-sm sm:text-lg max-w-2xl mx-auto animate-on-scroll fade-in-up text-white/80 drop-shadow-sm px-2 sm:px-4 print:text-black print:drop-shadow-none print:px-0 print:text-left print:max-w-full print:mt-2" style={{ transitionDelay: '0.6s' }}>
                    {t.home.description}
                </p>
            </div>
        </section>
    );
};

export default HomeSection;
