import { useEffect, useState } from "react"
import SoftBackdrop from "../components/SoftBackdrop"
import type { IThumbnail, ICollection } from "../../assets/assets";
import { useNavigate, Link } from "react-router-dom"
import { DownloadIcon, ArrowUpRightIcon, TrashIcon, ImageIcon, SparklesIcon, SearchIcon, FolderIcon, PlusIcon, FolderOpenIcon, XIcon } from "lucide-react"
import { useAuth } from "../context/AuthContext";
import api from "../configs/api";
import { toast } from "sonner";
import { motion } from "motion/react";

/* ================= SKELETON CARD ================= */
const SkeletonCard = () => (
    <div className="mb-8 rounded-2xl bg-white/6 border border-white/10 overflow-hidden break-inside-avoid animate-pulse">
        <div className="w-full aspect-video bg-white/10" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="flex gap-2">
                <div className="h-5 bg-white/10 rounded w-20" />
                <div className="h-5 bg-white/10 rounded w-16" />
                <div className="h-5 bg-white/10 rounded w-12" />
            </div>
            <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
    </div>
);

/* ================= EMPTY STATE ================= */
const EmptyState = ({ onGenerate }: { onGenerate: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 70 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
        <div className="w-24 h-24 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6">
            <ImageIcon className="size-10 text-pink-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Koi thumbnail nahi bani abhi!</h2>
        <p className="text-zinc-400 text-sm max-w-sm mb-8">
            Apna pehla AI thumbnail banao — sirf title aur style choose karo, baaki AI karega!
        </p>
        <button
            onClick={onGenerate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-medium transition-all duration-200"
        >
            <SparklesIcon className="size-4" />
            Generate Your First Thumbnail
        </button>
    </motion.div>
);

/* ================= MAIN COMPONENT ================= */
const MyGeneration = () => {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()

    const aspectRatioClassMap: Record<string, string> = {
        '16:9': 'aspect-video',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]'
    }

    const [thumbnails, setThumbnails] = useState<IThumbnail[]>([])
    const [loading, setLoading] = useState(false)

    // Search & Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStyle, setFilterStyle] = useState('All')
    const [sortBy, setSortBy] = useState('Latest')

    // ✅ Collections states
    const [collections, setCollections] = useState<ICollection[]>([])
    const [activeCollection, setActiveCollection] = useState<string | null>(null)
    const [newCollectionName, setNewCollectionName] = useState('')
    const [showNewInput, setShowNewInput] = useState(false)
    const [assigningThumb, setAssigningThumb] = useState<string | null>(null)

    // ✅ Filtered thumbnails logic
    const filteredThumbnails = thumbnails
        .filter(t => {
            const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchStyle = filterStyle === 'All' || t.style === filterStyle
            const matchCollection = activeCollection === null
                ? true
                : activeCollection === 'uncollected'
                    ? !t.collectionId
                    : t.collectionId === activeCollection
            return matchSearch && matchStyle && matchCollection
        })
        .sort((a, b) => {
            if (sortBy === 'Latest') return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
            return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        })

    const fetchThumbnails = async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/user/thumbnails')
            setThumbnails(data.thumbnails || [])
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setLoading(false);
        }
    }

    // ✅ Collections fetch
    const fetchCollections = async () => {
        try {
            const { data } = await api.get('/api/collection')
            setCollections(data.collections || [])
        } catch (error: any) {
            console.error(error)
        }
    }

    // ✅ New collection banao
    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) return toast.error('Collection name required')
        try {
            const { data } = await api.post('/api/collection/create', { name: newCollectionName.trim() })
            toast.success(data.message)
            setCollections([data.collection, ...collections])
            setNewCollectionName('')
            setShowNewInput(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    }

    // ✅ Collection delete
    const handleDeleteCollection = async (id: string) => {
        const confirm = window.confirm('Collection delete karo? Thumbnails uncollected ho jayengi.')
        if (!confirm) return
        try {
            const { data } = await api.delete(`/api/collection/delete/${id}`)
            toast.success(data.message)
            setCollections(collections.filter(c => c._id !== id))
            if (activeCollection === id) setActiveCollection(null)
            setThumbnails(thumbnails.map(t => t.collectionId === id ? { ...t, collectionId: null } : t))
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    }

    // ✅ Thumbnail ko collection assign karo
    const handleAssignCollection = async (thumbnailId: string, collectionId: string | null) => {
        try {
            const { data } = await api.patch('/api/collection/assign', { thumbnailId, collectionId })
            setThumbnails(thumbnails.map(t => t._id === thumbnailId ? { ...t, collectionId: data.thumbnail.collectionId } : t))
            toast.success('Updated!')
            setAssigningThumb(null)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    }

    const handleDownload = (image_url: string) => {
        const link = document.createElement('a');
        link.href = image_url.replace('/upload', '/upload/fl_attachment')
        document.body.appendChild(link);
        link.click()
        link.remove()
    }

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('Are you sure you want to delete this thumbnail?')
        if (!confirm) return;
        try {
            const { data } = await api.delete(`/api/thumbnail/delete/${id}`)
            toast.success(data.message)
            setThumbnails(thumbnails.filter((t) => t._id !== id));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchThumbnails()
            fetchCollections()
        }
    }, [isLoggedIn])

    return (
        <>
            <SoftBackdrop />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 70 }}
                className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32"
            >
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 70 }}
                    className="mb-8 flex items-center justify-between flex-wrap gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
                        <p className="text-sm text-zinc-400 mt-1">View and manage all your AI-generated thumbnails</p>
                    </div>

                    {!loading && thumbnails.length > 0 && (
                        <div className="flex items-center gap-4 text-sm">
                            <div className="px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-center">
                                <p className="text-zinc-400 text-xs">Total Generated</p>
                                <p className="text-zinc-100 font-bold text-lg">{thumbnails.length}</p>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/6 border border-white/10 text-center">
                                <p className="text-zinc-400 text-xs">This Month</p>
                                <p className="text-zinc-100 font-bold text-lg">
                                    {thumbnails.filter(t => {
                                        const date = new Date(t.createdAt!)
                                        const now = new Date()
                                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                                    }).length}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/generate')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-medium transition-all text-sm"
                            >
                                <SparklesIcon className="size-4" />
                                New Thumbnail
                            </button>
                        </div>
                    )}
                </motion.div>

                <div className="flex gap-8">

                    {/* ✅ COLLECTIONS SIDEBAR */}
                    {!loading && thumbnails.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 70 }}
                            className="hidden lg:flex flex-col gap-1 w-52 shrink-0"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Collections</span>
                                <button
                                    onClick={() => setShowNewInput(!showNewInput)}
                                    className="text-zinc-400 hover:text-pink-400 transition"
                                >
                                    <PlusIcon className="size-4" />
                                </button>
                            </div>

                            {/* New collection input */}
                            {showNewInput && (
                                <div className="flex gap-1 mb-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newCollectionName}
                                        onChange={e => setNewCollectionName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
                                        placeholder="Collection name..."
                                        className="flex-1 px-2 py-1.5 rounded-lg bg-white/8 border border-white/10 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-pink-500/50"
                                    />
                                    <button
                                        onClick={handleCreateCollection}
                                        className="px-2 py-1 rounded-lg bg-pink-500/20 text-pink-400 text-xs hover:bg-pink-500/30 transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            {/* All thumbnails */}
                            <button
                                onClick={() => setActiveCollection(null)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition text-left ${activeCollection === null ? 'bg-pink-500/15 text-pink-300 border border-pink-500/20' : 'text-zinc-400 hover:bg-white/6'}`}
                            >
                                <FolderOpenIcon className="size-4 shrink-0" />
                                <span className="truncate">All</span>
                                <span className="ml-auto text-xs opacity-60">{thumbnails.length}</span>
                            </button>

                            {/* Uncollected */}
                            <button
                                onClick={() => setActiveCollection('uncollected')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition text-left ${activeCollection === 'uncollected' ? 'bg-pink-500/15 text-pink-300 border border-pink-500/20' : 'text-zinc-400 hover:bg-white/6'}`}
                            >
                                <FolderIcon className="size-4 shrink-0" />
                                <span className="truncate">Uncollected</span>
                                <span className="ml-auto text-xs opacity-60">{thumbnails.filter(t => !t.collectionId).length}</span>
                            </button>

                            {/* User collections */}
                            {collections.map(col => (
                                <div key={col._id} className="group relative">
                                    <button
                                        onClick={() => setActiveCollection(col._id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition text-left ${activeCollection === col._id ? 'bg-pink-500/15 text-pink-300 border border-pink-500/20' : 'text-zinc-400 hover:bg-white/6'}`}
                                    >
                                        <FolderIcon className="size-4 shrink-0" />
                                        <span className="truncate">{col.name}</span>
                                        <span className="ml-auto text-xs opacity-60">{thumbnails.filter(t => t.collectionId === col._id).length}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCollection(col._id)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center size-5 rounded hover:bg-red-500/20 text-red-400 transition"
                                    >
                                        <XIcon className="size-3" />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">

                        {/* SEARCH & FILTER */}
                        {!loading && thumbnails.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 70 }}
                                className="flex flex-wrap items-center gap-3 mb-6"
                            >
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/6 border border-white/10 flex-1 min-w-[200px]">
                                    <SearchIcon className="size-4 text-zinc-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by title..."
                                        className="bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500 w-full"
                                    />
                                </div>

                                <select
                                    value={filterStyle}
                                    onChange={(e) => setFilterStyle(e.target.value)}
                                    className="px-3 py-2 rounded-xl bg-white/6 border border-white/10 text-sm text-zinc-300 outline-none bg-[#0d0d0d]"
                                >
                                    <option value="All">All Styles</option>
                                    <option value="Bold & Graphic">Bold & Graphic</option>
                                    <option value="Tech/Futuristic">Tech/Futuristic</option>
                                    <option value="Minimalist">Minimalist</option>
                                    <option value="Photorealistic">Photorealistic</option>
                                    <option value="Illustrated">Illustrated</option>
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 rounded-xl bg-white/6 border border-white/10 text-sm text-zinc-300 outline-none bg-[#0d0d0d]"
                                >
                                    <option value="Latest">Latest First</option>
                                    <option value="Oldest">Oldest First</option>
                                </select>

                                {(searchQuery || filterStyle !== 'All' || sortBy !== 'Latest') && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setFilterStyle('All'); setSortBy('Latest'); }}
                                        className="px-3 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm hover:bg-pink-500/20 transition"
                                    >
                                        Clear
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* LOADING */}
                        {loading && (
                            <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
                                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!loading && thumbnails.length === 0 && (
                            <EmptyState onGenerate={() => navigate('/generate')} />
                        )}

                        {/* NO RESULTS */}
                        {!loading && thumbnails.length > 0 && filteredThumbnails.length === 0 && (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                                <SearchIcon className="size-10 text-zinc-600 mb-4" />
                                <p className="text-zinc-400 font-medium">Koi thumbnail nahi mili!</p>
                                <p className="text-zinc-500 text-sm mt-1">Search ya filter change karo</p>
                            </div>
                        )}

                        {/* GRID */}
                        {!loading && filteredThumbnails.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8"
                            >
                                {filteredThumbnails.map((thumb: IThumbnail, index: number) => {
                                    const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || '16:9']
                                    return (
                                        <motion.div
                                            key={thumb._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 70 }}
                                            onClick={() => navigate(`/generate/${thumb._id}`)}
                                            className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid hover:border-pink-500/30 hover:shadow-pink-500/10"
                                        >
                                            {/* IMAGE */}
                                            <div className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-gray-200`}>
                                                {thumb.image_url ? (
                                                    <img
                                                        src={thumb.image_url}
                                                        alt={thumb.title}
                                                        onLoad={(e) => {
                                                            const img = e.target as HTMLImageElement;
                                                            setTimeout(() => {
                                                                img.classList.remove('opacity-0', 'blur-md', 'scale-110');
                                                                img.classList.add('opacity-100', 'scale-100', 'blur-0');
                                                            }, 800);
                                                        }}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-0 scale-110 blur-md"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                                                        {thumb.isGenerating ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="size-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                                                <span>Generating...</span>
                                                            </div>
                                                        ) : 'No image'}
                                                    </div>
                                                )}
                                                {thumb.isGenerating && (
                                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 text-sm font-medium text-white">
                                                        <div className="size-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                                                        <span>Generating...</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="p-4 space-y-2">
                                                <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">{thumb.title}</h3>
                                                <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                                                    <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.style}</span>
                                                    <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.color_scheme}</span>
                                                    <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.aspect_ratio}</span>
                                                </div>

                                                {/* ✅ Collection badge */}
                                                {thumb.collectionId && (
                                                    <div className="flex items-center gap-1 text-xs text-pink-400">
                                                        <FolderIcon className="size-3" />
                                                        <span>{collections.find(c => c._id === thumb.collectionId)?.name || 'Collection'}</span>
                                                    </div>
                                                )}

                                                <p className="text-xs text-zinc-500">{new Date(thumb.createdAt!).toDateString()}</p>
                                            </div>

                                            {/* ACTION BUTTONS */}
                                            <div
                                                onClick={e => e.stopPropagation()}
                                                className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5"
                                            >
                                                {/* ✅ Collection assign button */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setAssigningThumb(assigningThumb === thumb._id ? null : thumb._id)}
                                                        className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all cursor-pointer flex items-center justify-center"
                                                    >
                                                        <FolderIcon className="size-3.5" />
                                                    </button>

                                                    {/* Dropdown */}
                                                    {assigningThumb === thumb._id && (
                                                        <div className="absolute bottom-8 right-0 w-44 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                                                            <p className="text-xs text-zinc-500 px-3 pt-2 pb-1">Add to collection</p>
                                                            <button
                                                                onClick={() => handleAssignCollection(thumb._id, null)}
                                                                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-white/8 transition"
                                                            >
                                                                Remove from collection
                                                            </button>
                                                            {collections.map(col => (
                                                                <button
                                                                    key={col._id}
                                                                    onClick={() => handleAssignCollection(thumb._id, col._id)}
                                                                    className={`w-full text-left px-3 py-2 text-xs transition flex items-center gap-2 ${thumb.collectionId === col._id ? 'text-pink-400 bg-pink-500/10' : 'text-zinc-300 hover:bg-white/8'}`}
                                                                >
                                                                    <FolderIcon className="size-3" />
                                                                    {col.name}
                                                                </button>
                                                            ))}
                                                            {collections.length === 0 && (
                                                                <p className="text-xs text-zinc-500 px-3 py-2">Koi collection nahi — pehle banao</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <TrashIcon
                                                    onClick={() => handleDelete(thumb._id)}
                                                    className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all cursor-pointer"
                                                />
                                                <DownloadIcon
                                                    onClick={() => handleDownload(thumb.image_url!)}
                                                    className='size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all cursor-pointer'
                                                />
                                                <Link
                                                    target="_blank"
                                                    to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}`}
                                                >
                                                    <ArrowUpRightIcon className='size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all cursor-pointer' />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default MyGeneration