import { useEffect, useState } from "react"
import SoftBackdrop from "../components/SoftBackdrop"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../configs/api"
import { toast } from "sonner"
import { motion } from "motion/react"
import { FolderIcon, PlusIcon, TrashIcon, ImageIcon, SparklesIcon, XIcon } from "lucide-react"

const Collections = () => {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()

    const [collections, setCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [selectedCollection, setSelectedCollection] = useState<any>(null)

    const fetchCollections = async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/collection')
            setCollections(data.collections || [])
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!newName.trim()) return toast.error('Collection name required!')
        try {
            setCreating(true)
            const { data } = await api.post('/api/collection/create', { name: newName })
            toast.success('Collection created!')
            setCollections(prev => [data.collection, ...prev])
            setNewName('')
            setShowInput(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('Delete this collection?')
        if (!confirm) return
        try {
            await api.delete(`/api/collection/delete/${id}`)
            toast.success('Collection deleted!')
            setCollections(prev => prev.filter(c => c._id !== id))
            if (selectedCollection?._id === id) setSelectedCollection(null)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return }
        fetchCollections()
    }, [isLoggedIn])

    return (
        <>
            <SoftBackdrop />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 70 }}
                className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pb-20"
            >
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 flex items-center justify-between flex-wrap gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-200">Collections</h1>
                        <p className="text-sm text-zinc-400 mt-1">Apni thumbnails ko folders mein organize karo</p>
                    </div>
                    <button
                        onClick={() => setShowInput(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-medium transition-all text-sm"
                    >
                        <PlusIcon className="size-4" />
                        New Collection
                    </button>
                </motion.div>

                {/* CREATE INPUT */}
                {showInput && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-white/6 border border-white/10"
                    >
                        <FolderIcon className="size-5 text-pink-400 shrink-0" />
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            placeholder="Collection name... e.g. Gaming, Tech, Vlogs"
                            autoFocus
                            className="flex-1 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500 text-sm"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={creating}
                            className="px-4 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition disabled:opacity-60"
                        >
                            {creating ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            onClick={() => { setShowInput(false); setNewName('') }}
                            className="size-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition"
                        >
                            <XIcon className="size-4 text-zinc-400" />
                        </button>
                    </motion.div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-white/6 border border-white/10 animate-pulse" />
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && collections.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center min-h-[50vh] text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
                            <FolderIcon className="size-9 text-pink-400" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-100 mb-2">Koi collection nahi hai!</h2>
                        <p className="text-zinc-400 text-sm max-w-sm mb-6">
                            Thumbnails organize karne ke liye collection banao — Gaming, Tech, Vlogs etc
                        </p>
                        <button
                            onClick={() => setShowInput(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 text-white font-medium text-sm"
                        >
                            <PlusIcon className="size-4" />
                            Pehli Collection Banao
                        </button>
                    </motion.div>
                )}

                {/* COLLECTIONS GRID */}
                {!loading && collections.length > 0 && !selectedCollection && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {collections.map((col, index) => (
                            <motion.div
                                key={col._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.07 }}
                                onClick={() => setSelectedCollection(col)}
                                className="group relative cursor-pointer p-5 rounded-2xl bg-white/6 border border-white/10 hover:border-pink-500/30 hover:bg-white/8 transition-all"
                            >
                                {/* Folder Icon */}
                                <div className="size-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-3">
                                    <FolderIcon className="size-6 text-pink-400" />
                                </div>

                                <h3 className="text-sm font-semibold text-zinc-100 mb-1">{col.name}</h3>
                                <p className="text-xs text-zinc-500">
                                    {col.thumbnails?.length || 0} thumbnails
                                </p>

                                {/* Thumbnail Preview */}
                                {col.thumbnails?.length > 0 && (
                                    <div className="flex gap-1 mt-3">
                                        {col.thumbnails.slice(0, 3).map((t: any, i: number) => (
                                            <div key={i} className="size-8 rounded overflow-hidden bg-zinc-800">
                                                {t.image_url && (
                                                    <img src={t.image_url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        ))}
                                        {col.thumbnails.length > 3 && (
                                            <div className="size-8 rounded bg-white/10 flex items-center justify-center text-xs text-zinc-400">
                                                +{col.thumbnails.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(col._id) }}
                                    className="absolute top-3 right-3 size-7 rounded-lg bg-black/30 hover:bg-red-500/20 hidden group-hover:flex items-center justify-center transition"
                                >
                                    <TrashIcon className="size-3.5 text-zinc-400 hover:text-red-400" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* SELECTED COLLECTION — Thumbnails */}
                {selectedCollection && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Back button */}
                        <button
                            onClick={() => setSelectedCollection(null)}
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-pink-300 transition mb-6"
                        >
                            ← Back to Collections
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                <FolderIcon className="size-5 text-pink-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-zinc-100">{selectedCollection.name}</h2>
                                <p className="text-xs text-zinc-500">{selectedCollection.thumbnails?.length || 0} thumbnails</p>
                            </div>
                        </div>

                        {selectedCollection.thumbnails?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                                <ImageIcon className="size-10 text-zinc-600 mb-3" />
                                <p className="text-zinc-400 font-medium">Is collection mein koi thumbnail nahi hai</p>
                                <p className="text-zinc-500 text-sm mt-1">My Generations se thumbnails add karo</p>
                                <button
                                    onClick={() => navigate('/my-generation')}
                                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 text-white text-sm font-medium"
                                >
                                    <SparklesIcon className="size-4" />
                                    My Generations pe jao
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {selectedCollection.thumbnails.map((thumb: any, index: number) => (
                                    <motion.div
                                        key={thumb._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.07 }}
                                        onClick={() => navigate(`/generate/${thumb._id}`)}
                                        className="cursor-pointer rounded-2xl bg-white/6 border border-white/10 hover:border-pink-500/30 overflow-hidden transition group"
                                    >
                                        <div className="aspect-video bg-gray-200 overflow-hidden">
                                            {thumb.image_url && (
                                                <img
                                                    src={thumb.image_url}
                                                    alt={thumb.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-zinc-100 line-clamp-1">{thumb.title}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{new Date(thumb.createdAt).toDateString()}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </>
    )
}

export default Collections