'use client'
import { motion } from "motion/react";
import SoftBackdrop from "../components/SoftBackdrop";
import { CheckIcon, ZapIcon, ImageIcon, SparklesIcon, ShieldCheckIcon, RefreshCwIcon, SearchIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: <ZapIcon className="size-5 text-pink-400" />,
        title: "AI-Powered Generation",
        desc: "Google Gemini AI use karke seconds mein professional quality thumbnails generate hoti hain — koi manual effort nahi.",
    },
    {
        icon: <ImageIcon className="size-5 text-pink-400" />,
        title: "5 Unique Styles",
        desc: "Bold & Graphic, Tech/Futuristic, Minimalist, Photorealistic, Illustrated — har niche ke liye ek style.",
    },
    {
        icon: <RefreshCwIcon className="size-5 text-pink-400" />,
        title: "Regenerate Anytime",
        desc: "Same settings se ek click mein dobara generate karo jab tak perfect na lage.",
    },
    {
        icon: <SparklesIcon className="size-5 text-pink-400" />,
        title: "Multiple Aspect Ratios",
        desc: "YouTube (16:9), Instagram (1:1), Shorts (9:16) — sab supported hain.",
    },
    {
        icon: <SearchIcon className="size-5 text-pink-400" />,
        title: "Search & Filter",
        desc: "Apni saari generations search karo, style se filter karo, date se sort karo.",
    },
    {
        icon: <ShieldCheckIcon className="size-5 text-pink-400" />,
        title: "Secure & Private",
        desc: "Tumhari thumbnails sirf tumhari — Google Login se secure, koi data share nahi.",
    },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <>
            <SoftBackdrop />

            {/* ── HERO ── */}
            <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32 pt-44 pb-24">
                <div className="absolute top-40 -z-10 left-1/4 size-72 bg-pink-600 blur-[300px]" />

                <motion.div
                    className="flex items-center gap-2 rounded-full p-1 pr-3 text-pink-100 bg-pink-200/15"
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 70 }}
                >
                    <span className="bg-pink-800 text-white text-xs px-3.5 py-1 rounded-full">About</span>
                    <p className="flex items-center gap-1 text-sm">
                        Thubmlify ke baare mein
                        <ChevronRightIcon size={14} />
                    </p>
                </motion.div>

                <motion.h1
                    className="text-5xl/17 md:text-6xl/21 font-medium max-w-3xl text-center mt-6"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70 }}
                >
                    Ek <span className="move-gradient px-3 rounded-xl">student project</span> — jo kaam karta hai
                </motion.h1>

                <motion.p
                    className="text-base text-center text-slate-300 max-w-xl mt-6 leading-relaxed"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70 }}
                >
                    Thubmlify ek personal project hai — ek student ne banaya, real problem solve karne ke liye.
                    YouTube creators ke liye thumbnail design karna mushkil aur time-consuming hota hai.
                    Ye tool us problem ko AI se solve karta hai.
                </motion.p>
            </div>

            {/* ── MISSION ── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-24">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70 }}
                        className="space-y-6"
                    >
                        <p className="text-center font-medium text-pink-600 px-6 py-2 rounded-full bg-pink-950/70 border border-pink-800 w-max">
                            Mission
                        </p>
                        <h2 className="text-3xl font-semibold text-white leading-snug">
                            Design skills nahi? <br />
                            <span className="text-slate-400 font-normal">Koi baat nahi.</span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Har creator ka sapna hota hai ki uske videos zyada log dekhen. Lekin ek achha thumbnail
                            banane ke liye Photoshop seekhna, ghante invest karna — ye sab possible nahi hota
                            specially jab tum akele kaam kar rahe ho.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Thubmlify ka mission simple hai —{" "}
                            <span className="text-white">AI ki power ko har creator tak pahunchana</span>,
                            chahe wo beginner ho ya pro. Sirf apna idea likho, thumbnail ready.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 70 }}
                        className="space-y-4"
                    >
                        {[
                            { label: "Koi design skill nahi chahiye", sub: "Bas title aur style — baaki AI" },
                            { label: "Koi expensive software nahi", sub: "Browser mein kaam karo, kuch install mat karo" },
                            { label: "Koi time waste nahi", sub: "30 seconds mein professional result" },
                            { label: "Koi hidden charges nahi", sub: "Free mein try karo, koi credit card nahi" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950"
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 320, damping: 70 }}
                            >
                                <CheckIcon className="size-5 text-pink-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-white text-sm font-medium">{item.label}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── TECH STACK ── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-24">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="p-px rounded-2xl bg-gradient-to-br from-pink-600 to-slate-800"
                        initial={{ y: 60, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70 }}
                    >
                        <div className="bg-slate-950 rounded-2xl p-8 md:p-12">
                            <p className="text-center font-medium text-pink-600 px-6 py-2 rounded-full bg-pink-950/70 border border-pink-800 w-max mx-auto mb-6">
                                Tech Stack
                            </p>
                            <h2 className="text-2xl font-semibold text-center text-white mb-2">
                                Kaise bana hai Thubmlify?
                            </h2>
                            <p className="text-slate-400 text-center text-sm mb-10 max-w-lg mx-auto">
                                Modern tools aur AI ka combination — ek student project jo production-ready feel deta hai.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: "React + TypeScript", role: "Frontend" },
                                    { name: "Node + Express", role: "Backend" },
                                    { name: "MongoDB", role: "Database" },
                                    { name: "Google Gemini AI", role: "Image Generation" },
                                    { name: "Cloudinary", role: "Image Storage" },
                                    { name: "TailwindCSS", role: "Styling" },
                                    { name: "Framer Motion", role: "Animations" },
                                    { name: "Google OAuth", role: "Authentication" },
                                ].map((tech, i) => (
                                    <motion.div
                                        key={i}
                                        className="text-center p-4 rounded-xl border border-slate-800 bg-black/30"
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.07, type: "spring", stiffness: 320, damping: 70 }}
                                    >
                                        <p className="text-white text-sm font-medium">{tech.name}</p>
                                        <p className="text-slate-500 text-xs mt-1">{tech.role}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── FEATURES ── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-24">
                <motion.p
                    className="text-center font-medium text-pink-600 px-10 py-2 rounded-full bg-pink-950/70 border border-pink-800 w-max mx-auto"
                    initial={{ y: 120, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70 }}
                >
                    Features
                </motion.p>
                <motion.h3
                    className="text-3xl font-semibold text-center mx-auto mt-4"
                    initial={{ y: 120, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70 }}
                >
                    Sab kuch jo chahiye
                </motion.h3>
                <motion.p
                    className="text-slate-300 text-center mt-2 max-w-xl mx-auto"
                    initial={{ y: 120, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70 }}
                >
                    Ek tool mein sab — generate, manage, download, share.
                </motion.p>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-16 px-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className={`${i === 1 ? 'p-px rounded-[13px] bg-linear-to-br from-pink-600 to-slate-800' : ''}`}
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, type: "spring", stiffness: 320, damping: 70 }}
                        >
                            <div className="p-6 rounded-xl space-y-4 border border-slate-800 bg-slate-950 max-w-80 w-full min-h-[180px]">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-medium text-white">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="px-4 md:px-16 lg:px-24 xl:px-32 pb-28">
                <motion.div
                    className="relative max-w-2xl mx-auto text-center p-12 rounded-2xl border border-pink-900 bg-pink-950/30 overflow-hidden"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70 }}
                >
                    <div className="absolute -z-10 size-60 top-0 left-1/2 -translate-x-1/2 bg-pink-600 blur-[120px] opacity-20" />
                    <h2 className="text-3xl font-semibold text-white mb-3">Try karo abhi</h2>
                    <p className="text-slate-400 mb-8">
                        Pehli thumbnail free mein — koi credit card nahi, koi hidden fee nahi.
                    </p>
                    <button
                        onClick={() => navigate('/generate')}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 h-11 transition font-medium"
                    >
                        Generate now
                    </button>
                </motion.div>
            </div>
        </>
    );
}