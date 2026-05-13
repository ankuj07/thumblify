import type React from "react";
import type { ThumbnailStyle } from "../../assets/assets";
import { CpuIcon, ImageIcon, PenToolIcon, SquareIcon, SparklesIcon, ChevronDown } from "lucide-react";

const StyleSelector = ({
    value,
    onChange,
    isOpen,
    setIsOpen
}: {
    value: ThumbnailStyle;
    onChange: (style: ThumbnailStyle) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) => {

    const styleDescriptions: Record<ThumbnailStyle, string> = {
        "Bold & Graphic": "High contrast, bold typography, striking visuals",
        "Minimalist": "Clean, simple, lots of white space",
        "Photorealistic": "Photo-based, natural looking",
        "Illustrated": "Hand-drawn, artistic, creative",
        "Tech/Futuristic": "Modern, sleek, tech-inspired",
    };

    const styleIcons: Record<ThumbnailStyle, React.ReactNode> = {
        "Bold & Graphic": <SparklesIcon className="h-4 w-4" />,
        "Minimalist": <SquareIcon className="h-4 w-4" />,
        "Photorealistic": <ImageIcon className="h-4 w-4" />,
        "Illustrated": <PenToolIcon className="h-4 w-4" />,
        "Tech/Futuristic": <CpuIcon className="h-4 w-4" />,
    };

    const styles: ThumbnailStyle[] = [
        "Bold & Graphic",
        "Minimalist",
        "Photorealistic",
        "Illustrated",
        "Tech/Futuristic"
    ];

    return (
        <div className="relative space-y-3 dark">
            <label className='block text-sm font-medium text-zinc-200'>Thumbnail Style</label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-lg border border-white/12 bg-white/5 text-zinc-100 flex items-center justify-between hover:bg-white/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`${value === "Bold & Graphic" ? "text-pink-400" : value === "Minimalist" ? "text-blue-400" : value === "Photorealistic" ? "text-emerald-400" : value === "Illustrated" ? "text-amber-400" : "text-purple-400"}`}>
                        {styleIcons[value]}
                    </div>
                    <div className="space-y-1 text-left">
                        <div className="font-medium text-white">{value}</div>
                        <div className="text-xs text-zinc-400">
                            {styleDescriptions[value]}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <SparklesIcon className="w-4 h-4 text-zinc-400 mr-2" />
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute bottom-0 z-50 mt-1 w-64 left-0 right-15 mx-auto rounded-md border border-white/12 bg-black/20 backdrop-blur-3xl shadow-lg">                          {styles.map((style) => (
                    <button
                        key={style}
                        type="button"
                        onClick={() => {
                            onChange(style);
                            setIsOpen(false);
                        }}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition- hover:bg-back/30 ${value === style
                            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30'
                            : 'hover:bg-white/10 text-zinc-300'
                            }`}
                    >
                        <div className={`${style === "Bold & Graphic" ? "text-pink-400" : style === "Minimalist" ? "text-blue-400" : style === "Photorealistic" ? "text-emerald-400" : style === "Illustrated" ? "text-amber-400" : "text-purple-400"}`}>
                            {styleIcons[style]}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="font-medium text-white">{style}</div>
                            <div className="text-xs text-zinc-400">
                                {styleDescriptions[style]}
                            </div>
                        </div>
                    </button>
                ))}
                </div>
            )}
        </div>
    );
};

export default StyleSelector;