
import React, { useState, useEffect, useRef } from 'react';

interface EditableImageProps {
    storageKey: string;
    defaultSrc: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    onLoad?: () => void;
    clickToUpload?: boolean;
}

const EditableImage: React.FC<EditableImageProps> = ({ 
    storageKey, 
    defaultSrc, 
    alt, 
    className, 
    wrapperClassName,
    onLoad,
    clickToUpload = false
}) => {
    const [src, setSrc] = useState(defaultSrc);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setSrc(saved);
        } else {
            setSrc(defaultSrc);
        }
    }, [storageKey, defaultSrc]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Basic validation
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File is too large. Please select an image under 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                try {
                    localStorage.setItem(storageKey, result);
                    setSrc(result);
                    // Dispatch custom event to notify other components (like App.tsx)
                    window.dispatchEvent(new CustomEvent('image-updated'));
                } catch (error) {
                    console.error("Storage failed", error);
                    alert("Failed to save image. Local storage might be full.");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    return (
        <div 
            className={`relative group/edit ${wrapperClassName || ''} ${clickToUpload ? 'cursor-pointer' : ''}`}
            onClick={clickToUpload ? triggerUpload : undefined}
        >
            <img 
                src={src} 
                alt={alt} 
                className={className}
                onLoad={onLoad} 
            />
            
            <div 
                onClick={!clickToUpload ? triggerUpload : (e) => e.stopPropagation()}
                className={`absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer transition-opacity z-30 backdrop-blur-sm shadow-md ${clickToUpload ? 'opacity-40 group-hover/edit:opacity-100' : 'opacity-0 group-hover/edit:opacity-100'}`}
                title="Change Image"
                role="button"
                aria-label="Change image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
            </div>
            
            {clickToUpload && (
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/edit:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-black/40 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">Click to change</span>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default EditableImage;
