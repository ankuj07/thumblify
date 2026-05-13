'use client'
import SectionTitle from "../components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon, MessageSquareIcon, TwitterIcon, LinkedinIcon, ClockIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('Name is required');
        if (!formData.email.trim()) return toast.error('Email is required');
        if (!formData.message.trim()) return toast.error('Message is required');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Message sent! We will reply within 24 hours.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle
                text1="Contact"
                text2="Grow your channel"
                text3="Have questions about our Thumbnail Maker? Ready to scale your views? Let's talk."
            />

            <div className="max-w-5xl mx-auto mt-16 grid lg:grid-cols-[1fr_320px] gap-10">

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5 text-slate-300">

                    <div className="grid sm:grid-cols-2 gap-5">
                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 320, damping: 70 }}
                        >
                            <p className="mb-2 font-medium text-sm">Your Name</p>
                            <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors bg-white/4">
                                <UserIcon className="size-4 text-slate-400 shrink-0" />
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full p-3 outline-none bg-transparent text-white placeholder:text-slate-500 text-sm"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 280, damping: 70 }}
                        >
                            <p className="mb-2 font-medium text-sm">Email ID</p>
                            <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors bg-white/4">
                                <MailIcon className="size-4 text-slate-400 shrink-0" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full p-3 outline-none bg-transparent text-white placeholder:text-slate-500 text-sm"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 260, damping: 70 }}
                    >
                        <p className="mb-2 font-medium text-sm">Subject</p>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-slate-700 focus:border-pink-500 transition-colors bg-[#0d0d0d] text-slate-300 outline-none text-sm"
                        >
                            <option value="">Select a subject</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="billing">Billing Issue</option>
                            <option value="general">General Query</option>
                            <option value="other">Other</option>
                        </select>
                    </motion.div>

                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70 }}
                    >
                        <p className="mb-2 font-medium text-sm">Message</p>
                        <div className="rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors bg-white/4">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={7}
                                placeholder="Describe your issue or question in detail..."
                                className="resize-none w-full p-3 outline-none bg-transparent text-white placeholder:text-slate-500 text-sm rounded-lg"
                            />
                            <div className="flex justify-end pr-3 pb-2">
                                <span className="text-xs text-slate-500">{formData.message.length} characters</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-10 py-3 rounded-full transition-all font-medium"
                        initial={{ y: 80, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70 }}
                    >
                        {loading ? (
                            <>
                                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                Send Message
                                <ArrowRightIcon className="size-4" />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* RIGHT INFO CARDS */}
                <div className="space-y-4">

                    <motion.div
                        className="p-5 rounded-2xl bg-white/4 border border-white/10"
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70 }}
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className="size-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                                <MailIcon className="size-4 text-pink-400" />
                            </div>
                            <p className="text-sm font-medium text-zinc-200">Email Us</p>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">support@thubmlify.com</p>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-2xl bg-white/4 border border-white/10"
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 260, damping: 70, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className="size-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                                <ClockIcon className="size-4 text-pink-400" />
                            </div>
                            <p className="text-sm font-medium text-zinc-200">Response Time</p>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">We typically reply within 24 hours on business days.</p>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-2xl bg-white/4 border border-white/10"
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                                <MessageSquareIcon className="size-4 text-pink-400" />
                            </div>
                            <p className="text-sm font-medium text-zinc-200">Follow Us</p>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
                            >
                                <TwitterIcon className="size-3.5" />
                                Twitter
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-colors"
                            >
                                <LinkedinIcon className="size-3.5" />
                                LinkedIn
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-2xl bg-pink-500/8 border border-pink-500/20"
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 220, damping: 70, delay: 0.3 }}
                    >
                        <p className="text-xs text-pink-300 font-medium mb-1">Quick Tip</p>
                        <p className="text-xs text-zinc-400">
                            For faster help, mention your registered email and describe the issue clearly with steps to reproduce.
                        </p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}