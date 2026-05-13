import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SoftBackdrop from "../components/SoftBackdrop";
import api from "../configs/api";
import { toast } from "sonner";
import { motion } from "motion/react";
import { UserIcon, MailIcon, CalendarIcon, ImageIcon, StarIcon, PencilIcon, CheckIcon, XIcon, SparklesIcon } from "lucide-react";

const Profile = () => {
    const { user, setUser, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/user/profile');
            setProfileData(data);
            setNewName(data.user.name);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) return toast.error('Name is required');
        setSaving(true);
        try {
            const { data } = await api.put('/api/user/profile', { name: newName });
            setUser(data.user);
            setProfileData((prev: any) => ({ ...prev, user: data.user }));
            toast.success(data.message);
            setEditing(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [isLoggedIn]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="size-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <>
            <SoftBackdrop />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 70 }}
                className="pt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pb-20"
            >
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* HEADER CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 70 }}
                        className="p-8 rounded-2xl bg-white/6 border border-white/10 shadow-xl"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <div className="size-20 rounded-full bg-gradient-to-b from-pink-500 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
                                {profileData?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>

                            {/* Name + Email */}
                            <div className="flex-1 text-center sm:text-left">
                                {editing ? (
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-white/20 bg-black/30 text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500 text-lg font-bold"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={saving}
                                            className="size-9 rounded-lg bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition"
                                        >
                                            <CheckIcon className="size-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => { setEditing(false); setNewName(profileData?.user?.name); }}
                                            className="size-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                                        >
                                            <XIcon className="size-4 text-zinc-300" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <h1 className="text-2xl font-bold text-zinc-100">{profileData?.user?.name}</h1>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="size-7 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition"
                                        >
                                            <PencilIcon className="size-3.5 text-zinc-400" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-400 text-sm">
                                    <MailIcon className="size-4" />
                                    <span>{profileData?.user?.email}</span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-500 text-xs mt-1">
                                    <CalendarIcon className="size-3.5" />
                                    <span>Joined {new Date(profileData?.user?.createdAt).toDateString()}</span>
                                </div>
                            </div>

                            {/* Credits Badge */}
                            <div className="px-5 py-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
                                <p className="text-xs text-pink-300 mb-1">Credits Left</p>
                                <p className="text-3xl font-black text-pink-400">{profileData?.user?.credits ?? 0}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {
                                icon: <ImageIcon className="size-5 text-pink-400" />,
                                label: "Total Generated",
                                value: profileData?.totalThumbnails || 0,
                                delay: 0.2
                            },
                            {
                                icon: <SparklesIcon className="size-5 text-pink-400" />,
                                label: "This Month",
                                value: profileData?.thisMonthThumbnails || 0,
                                delay: 0.3
                            },
                            {
                                icon: <StarIcon className="size-5 text-pink-400" />,
                                label: "Credits Remaining",
                                value: profileData?.user?.credits ?? 0,
                                delay: 0.4
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: stat.delay, type: "spring", stiffness: 260, damping: 70 }}
                                className="p-5 rounded-2xl bg-white/6 border border-white/10 text-center"
                            >
                                <div className="size-10 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-3">
                                    {stat.icon}
                                </div>
                                <p className="text-3xl font-black text-zinc-100 mb-1">{stat.value}</p>
                                <p className="text-xs text-zinc-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* ACCOUNT INFO */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 70 }}
                        className="p-6 rounded-2xl bg-white/6 border border-white/10"
                    >
                        <h2 className="text-lg font-bold text-zinc-100 mb-4">Account Info</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-b border-white/8">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <UserIcon className="size-4" />
                                    <span>Full Name</span>
                                </div>
                                <span className="text-zinc-200 text-sm font-medium">{profileData?.user?.name}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-white/8">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <MailIcon className="size-4" />
                                    <span>Email</span>
                                </div>
                                <span className="text-zinc-200 text-sm font-medium">{profileData?.user?.email}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                                    <CalendarIcon className="size-4" />
                                    <span>Member Since</span>
                                </div>
                                <span className="text-zinc-200 text-sm font-medium">{new Date(profileData?.user?.createdAt).toDateString()}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* QUICK ACTIONS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 70 }}
                        className="grid sm:grid-cols-2 gap-4"
                    >
                        <button
                            onClick={() => navigate('/generate')}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 transition text-white font-medium"
                        >
                            <SparklesIcon className="size-5" />
                            Generate New Thumbnail
                        </button>
                        <button
                            onClick={() => navigate('/my-generation')}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-white/6 border border-white/10 hover:bg-white/10 transition text-zinc-200 font-medium"
                        >
                            <ImageIcon className="size-5" />
                            View My Generations
                        </button>
                    </motion.div>

                </div>
            </motion.div>
        </>
    );
};

export default Profile;