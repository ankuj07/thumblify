import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SoftBackdrop from "../components/SoftBackdrop";
import api from "../configs/api";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import { ImageIcon, SparklesIcon, TrendingUpIcon, PaletteIcon } from "lucide-react";

const COLORS = ['#ec4899', '#f43f5e', '#a855f7', '#3b82f6', '#10b981'];

const Analytics = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [thumbnails, setThumbnails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/user/thumbnails');
            setThumbnails(data.thumbnails || []);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        fetchData();
    }, [isLoggedIn]);

    /* ===== DATA PROCESSING ===== */

    // Monthly data — last 6 months
    const monthlyData = (() => {
        const months: Record<string, number> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            months[key] = 0;
        }
        thumbnails.forEach(t => {
            const d = new Date(t.createdAt);
            const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            if (months[key] !== undefined) months[key]++;
        });
        return Object.entries(months).map(([month, count]) => ({ month, count }));
    })();

    // Style breakdown
    const styleData = (() => {
        const styles: Record<string, number> = {};
        thumbnails.forEach(t => {
            styles[t.style] = (styles[t.style] || 0) + 1;
        });
        return Object.entries(styles).map(([name, value]) => ({ name, value }));
    })();

    // Color scheme breakdown
    const colorData = (() => {
        const colors: Record<string, number> = {};
        thumbnails.forEach(t => {
            if (t.color_scheme) {
                colors[t.color_scheme] = (colors[t.color_scheme] || 0) + 1;
            }
        });
        return Object.entries(colors).map(([name, value]) => ({ name, value }));
    })();

    // Aspect ratio breakdown
    const aspectData = (() => {
        const aspects: Record<string, number> = {};
        thumbnails.forEach(t => {
            aspects[t.aspect_ratio || '16:9'] = (aspects[t.aspect_ratio || '16:9'] || 0) + 1;
        });
        return Object.entries(aspects).map(([name, value]) => ({ name, value }));
    })();

    // Most used style
    const topStyle = styleData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A';

    // This month count
    const thisMonth = thumbnails.filter(t => {
        const d = new Date(t.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

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
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* HEADER */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
                        <p className="text-sm text-zinc-400 mt-1">Teri thumbnail generation ki insights</p>
                    </motion.div>

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { icon: <ImageIcon className="size-5 text-pink-400" />, label: "Total", value: thumbnails.length },
                            { icon: <SparklesIcon className="size-5 text-pink-400" />, label: "This Month", value: thisMonth },
                            { icon: <TrendingUpIcon className="size-5 text-pink-400" />, label: "Top Style", value: topStyle, small: true },
                            { icon: <PaletteIcon className="size-5 text-pink-400" />, label: "Styles Used", value: styleData.length },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08 }}
                                className="p-4 rounded-2xl bg-white/6 border border-white/10 text-center"
                            >
                                <div className="size-9 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-2">
                                    {stat.icon}
                                </div>
                                <p className={`font-black text-zinc-100 mb-1 ${stat.small ? 'text-sm' : 'text-2xl'}`}>{stat.value}</p>
                                <p className="text-xs text-zinc-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* MONTHLY BAR CHART */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl bg-white/6 border border-white/10"
                    >
                        <h2 className="text-base font-semibold text-zinc-100 mb-6">Monthly Generation</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={monthlyData}>
                                <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                                <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f4f4f5' }}
                                />
                                <Bar dataKey="count" fill="#ec4899" radius={[6, 6, 0, 0]} name="Thumbnails" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* PIE CHARTS */}
                    <div className="grid sm:grid-cols-3 gap-4">

                        {/* Style Pie */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-2xl bg-white/6 border border-white/10"
                        >
                            <h2 className="text-sm font-semibold text-zinc-100 mb-4">Style Breakdown</h2>
                            {styleData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={styleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                                            {styleData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f4f4f5', fontSize: '12px' }} />
                                        <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-zinc-500 text-sm">No data yet</div>
                            )}
                        </motion.div>

                        {/* Color Scheme Pie */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-6 rounded-2xl bg-white/6 border border-white/10"
                        >
                            <h2 className="text-sm font-semibold text-zinc-100 mb-4">Color Scheme</h2>
                            {colorData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={colorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                                            {colorData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f4f4f5', fontSize: '12px' }} />
                                        <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-zinc-500 text-sm">No data yet</div>
                            )}
                        </motion.div>

                        {/* Aspect Ratio Pie */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-6 rounded-2xl bg-white/6 border border-white/10"
                        >
                            <h2 className="text-sm font-semibold text-zinc-100 mb-4">Aspect Ratio</h2>
                            {aspectData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={aspectData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                                            {aspectData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f4f4f5', fontSize: '12px' }} />
                                        <Legend wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-zinc-500 text-sm">No data yet</div>
                            )}
                        </motion.div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
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

export default Analytics;