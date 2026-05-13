import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    colorSchemes,
    type AspectRatio,
    type IThumbnail,
    type ThumbnailStyle
} from "../../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import api from "../configs/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCwIcon, LinkIcon, CheckIcon, LayoutTemplateIcon, XIcon } from "lucide-react";

// ── Types ──
interface ITemplate {
    _id: string;
    title: string;
    category: string;
    style: string;
    color_scheme: string;
    aspect_ratio: string;
    prompt: string;
    preview_emoji: string;
}

const CATEGORIES = ['All', 'Gaming', 'Tech', 'Finance', 'Cooking', 'Motivation'];

const Generate = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    const [title, setTitle] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
    const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);
    const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
    const [styleDropdownOpen, setstyleDropdownOpen] = useState(false);

    // ── Template states ──
    const [templatePanelOpen, setTemplatePanelOpen] = useState(false);
    const [templates, setTemplates] = useState<ITemplate[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

    const noCredits = isLoggedIn && user !== null && user.credits <= 0;

    // ── Fetch templates ──
    const fetchTemplates = async (category: string) => {
        setTemplatesLoading(true);
        try {
            const params = category !== 'All' ? `?category=${category}` : '';
            const { data } = await api.get(`/api/template${params}`);
            setTemplates(data.templates);
        } catch (error) {
            toast.error('Templates load nahi hue');
        } finally {
            setTemplatesLoading(false);
        }
    };

    const handleOpenTemplates = () => {
        setTemplatePanelOpen(true);
        fetchTemplates(activeCategory);
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        fetchTemplates(cat);
    };

    // ── Apply template to form ──
    const handleApplyTemplate = (template: ITemplate) => {
        setTitle(template.title);
        setAdditionalDetails(template.prompt);
        setStyle(template.style as ThumbnailStyle);
        setAspectRatio(template.aspect_ratio as AspectRatio);
        setColorSchemeId(template.color_scheme);
        setAppliedTemplate(template._id);
        setTemplatePanelOpen(false);
        toast.success(`Template applied — "${template.title}"`);
    };

    // ── Generate ──
    const handleGenerate = async () => {
        if (!isLoggedIn) return toast.error('Please login to generate thumbnails');
        if (noCredits) return toast.error('Credits khatam ho gaye! Upgrade karo.');
        if (!title.trim()) return toast.error('Title is required');
        setLoading(true);

        try {
            const { data } = await api.post('/api/thumbnail/generate', {
                title,
                prompt: additionalDetails,
                style,
                aspect_ratio: aspectRatio,
                color_scheme: colorSchemeId,
                text_overlay: true,
            });
            if (data.thumbnail) {
                toast.success(data.message);
                setThumbnail(data.thumbnail);
                setLoading(false);
                setAppliedTemplate(null);
                navigate('/generate/' + data.thumbnail._id);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    // ── Regenerate — current settings bhi bhejo ──
    const handleRegenerate = async () => {
        if (!id) return;
        if (noCredits) return toast.error('Credits khatam ho gaye! Upgrade karo.');
        setLoading(true);
        setThumbnail(prev => prev ? { ...prev, image_url: '', isGenerating: true } : null);

        try {
            const { data } = await api.post(`/api/thumbnail/regenerate/${id}`, {
                title,
                prompt: additionalDetails,
                style,
                aspect_ratio: aspectRatio,
                color_scheme: colorSchemeId,
                text_overlay: true,
            });
            if (data.thumbnail) {
                toast.success('Thumbnail regenerate ho raha hai...');
                setThumbnail(data.thumbnail);
                setLoading(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchThumbnail = async () => {
        try {
            const { data } = await api.get(`/api/user/thumbnail/${id}`);
            setThumbnail(data.thumbnail as IThumbnail);
            setLoading(!data?.thumbnail?.image_url);
            setAdditionalDetails(data?.thumbnail?.user_prompt);
            setTitle(data?.thumbnail?.title);
            setColorSchemeId(data?.thumbnail?.color_scheme);
            setAspectRatio(data?.thumbnail?.aspect_ratio);
            setStyle(data?.thumbnail?.style);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (isLoggedIn && id) fetchThumbnail();
    }, [id, isLoggedIn]);

    useEffect(() => {
        if (!id || !isLoggedIn || !loading) return;
        const interval = setInterval(() => { fetchThumbnail(); }, 5000);
        return () => clearInterval(interval);
    }, [id, isLoggedIn, loading]);

    useEffect(() => {
        if (!id && thumbnail) setThumbnail(null);
    }, [pathname]);

    return (
        <>
            <SoftBackdrop />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 70 }}
                className="pt-24 min-h-screen"
            >
                <main className="max-w-6xl m-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
                    <div className="grid lg:grid-cols-[400px_1fr] gap-8">

                        {/* LEFT PANEL — pointer-events-none hata diya taaki regenerate kaam kare */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 70 }}
                            className="space-y-6"
                        >
                            <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">

                                {/* Header + Templates button */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-100 mb-1">
                                            {id ? 'Regenerate Thumbnail' : 'Create Your Thumbnail'}
                                        </h2>
                                        <p className="text-sm text-zinc-400">
                                            {id ? 'Settings badlo aur dobara generate karo' : 'Describe your vision and let AI bring it to life'}
                                        </p>
                                    </div>
                                    {/* Templates button — sirf new generate pe dikhao */}
                                    {!id && (
                                        <button
                                            onClick={handleOpenTemplates}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-xs font-medium transition-all shrink-0"
                                        >
                                            <LayoutTemplateIcon className="size-3.5" />
                                            Templates
                                        </button>
                                    )}
                                </div>

                                {/* Applied template badge */}
                                {appliedTemplate && !id && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                        <LayoutTemplateIcon className="size-3.5 text-pink-400" />
                                        <p className="text-xs text-pink-400">Template applied — customize karo ya generate karo</p>
                                    </div>
                                )}

                                {/* Credits khatam warning */}
                                {noCredits && (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <span className="text-red-400 text-lg">⚠️</span>
                                        <div>
                                            <p className="text-sm font-medium text-red-400">Credits khatam ho gaye!</p>
                                            <p className="text-xs text-zinc-400">Aur thumbnails generate karne ke liye upgrade karo.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Low credits warning */}
                                {isLoggedIn && user && user.credits === 1 && (
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                        <span className="text-yellow-400 text-lg">⚡</span>
                                        <p className="text-sm text-yellow-400">Sirf <strong>1 credit</strong> bachi hai!</p>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Title or Topic</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            maxLength={100}
                                            placeholder="e.g., 10 tips for better sleep"
                                            className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        />
                                        <div className="flex justify-end">
                                            <span className="text-xs text-zinc-400">{title.length}/100</span>
                                        </div>
                                    </div>

                                    <AspectRatioSelector value={aspectRatio} onChange={(ratio) => setAspectRatio(ratio)} />
                                    <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setstyleDropdownOpen} />
                                    <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                                    {/* Additional prompts */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                                        </label>
                                        <textarea
                                            value={additionalDetails}
                                            onChange={(e) => setAdditionalDetails(e.target.value)}
                                            rows={3}
                                            placeholder="Add any specific elements, mood, or style preferences..."
                                            className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Generate button */}
                                {!id && (
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading || noCredits}
                                        className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-gradient-to-b from-pink-500 to-pink-600 hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
                                    >
                                        {loading ? 'Generating...' : noCredits ? '0 Credits — Upgrade Karo' : `Generate Thumbnail (${user?.credits ?? ''} left)`}
                                    </button>
                                )}

                                {/* Regenerate button */}
                                {id && (
                                    <button
                                        onClick={handleRegenerate}
                                        disabled={loading || noCredits}
                                        className="flex items-center justify-center gap-2 text-[15px] w-full py-3.5 rounded-xl font-medium border border-pink-500 text-pink-400 hover:bg-pink-500/10 disabled:cursor-not-allowed disabled:opacity-70 transition-colors duration-200"
                                    >
                                        <RefreshCwIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                                        {loading ? 'Regenerating...' : `Regenerate (${user?.credits ?? ''} credits left)`}
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* RIGHT PANEL */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 70 }}
                        >
                            <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-zinc-100">Preview</h2>
                                    {id && thumbnail?.image_url && (
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/6 text-zinc-300 text-xs transition-all"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckIcon className="size-3.5 text-green-400" />
                                                    <span className="text-green-400">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LinkIcon className="size-3.5" />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />
                            </div>
                        </motion.div>

                    </div>
                </main>
            </motion.div>

            {/* ════════ TEMPLATE PANEL ════════ */}
            <AnimatePresence>
                {templatePanelOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setTemplatePanelOpen(false)}
                        />

                        {/* Slide panel */}
                        <motion.div
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                        <LayoutTemplateIcon className="size-4 text-pink-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Template Library</h3>
                                        <p className="text-zinc-500 text-xs">Click karo — form automatically fill ho jaayega</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTemplatePanelOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/8 text-zinc-400 transition"
                                >
                                    <XIcon className="size-4" />
                                </button>
                            </div>

                            {/* Category filter */}
                            <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto scrollbar-hide">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                            activeCategory === cat
                                                ? 'bg-pink-600 text-white'
                                                : 'bg-white/6 text-zinc-400 hover:bg-white/10 border border-white/10'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Templates list */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {templatesLoading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : templates.length === 0 ? (
                                    <div className="text-center text-zinc-500 py-16">
                                        <p className="text-3xl mb-2">📭</p>
                                        <p className="text-sm">Koi template nahi mila</p>
                                    </div>
                                ) : (
                                    templates.map((template) => (
                                        <motion.button
                                            key={template._id}
                                            onClick={() => handleApplyTemplate(template)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all group ${
                                                appliedTemplate === template._id
                                                    ? 'border-pink-500 bg-pink-500/10'
                                                    : 'border-white/10 bg-white/4 hover:border-pink-500/40 hover:bg-white/8'
                                            }`}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl shrink-0">{template.preview_emoji}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium leading-snug">{template.title}</p>
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/20">
                                                            {template.category}
                                                        </span>
                                                        <span className="text-xs text-zinc-500">{template.style}</span>
                                                        <span className="text-xs text-zinc-600">•</span>
                                                        <span className="text-xs text-zinc-500">{template.aspect_ratio}</span>
                                                    </div>
                                                </div>
                                                {appliedTemplate === template._id && (
                                                    <CheckIcon className="size-4 text-pink-400 shrink-0 mt-0.5" />
                                                )}
                                            </div>
                                        </motion.button>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10">
                                <p className="text-center text-zinc-600 text-xs">
                                    {templates.length} templates available
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Generate;