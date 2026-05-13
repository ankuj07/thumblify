import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleContactScroll = () => {
        setIsOpen(false);
        if (pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur-md border-b border-white/5"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/'>
                    <img src="/logo.svg" alt="logo" className="h-8.5 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link
                        to='/'
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="hover:text-pink-300 transition"
                    >
                        Home
                    </Link>
                    <Link to='/generate' className="hover:text-pink-300 transition">Generate</Link>

                    {isLoggedIn ? (
                        <Link to='/my-generation' className="hover:text-pink-300 transition">
                            My Generations
                        </Link>
                    ) : (
                        <Link to='/about' className="hover:text-pink-300 transition">
                            About
                        </Link>
                    )}

                    <button
                        onClick={handleContactScroll}
                        className="hover:text-pink-300 transition"
                    >
                        Contact us
                    </button>
                </div>

                <div className="flex items-center gap-3">

                    {/* CREDITS BADGE */}
                    {isLoggedIn && user && (
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm">
                            <span className="text-yellow-400">⚡</span>
                            <span className="text-zinc-200 font-medium">{user.credits}</span>
                            <span className="text-zinc-400 text-xs">credits</span>
                        </div>
                    )}

                    {isLoggedIn ? (
                        <div className="relative group py-1">
                            {/* AVATAR */}
                            <button className="rounded-full size-9 bg-white/20 border-2 border-white/10 flex items-center justify-center font-medium text-white transition hover:border-pink-500/50">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </button>

                            {/* DROPDOWN */}
                            <div className="absolute hidden group-hover:block top-full right-0 pt-3">
                                <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden min-w-[160px] shadow-2xl">

                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-white/8">
                                        <p className="text-sm font-medium text-zinc-100">{user?.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                                    </div>

                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        👤 Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/analytics')}
                                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        📊 Analytics
                                    </button>
                                    <button
                                        onClick={() => navigate('/my-generation')}
                                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        🖼️ My Generations
                                    </button>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/8"
                                    >
                                        🚪 Logout
                                    </button>

                                    <button
                                        onClick={() => navigate('/collections')}
                                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        📁 Collections
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
                        >
                            Get Started
                        </button>
                    )}

                    <button onClick={() => setIsOpen(true)} className="md:hidden">
                        <MenuIcon size={26} className="active:scale-90 transition" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-500 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link
                    onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    to='/'
                    className="hover:text-pink-400 transition"
                >
                    Home
                </Link>
                <Link onClick={() => setIsOpen(false)} to='/generate' className="hover:text-pink-400 transition">
                    Generate
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link onClick={() => setIsOpen(false)} to='/my-generation' className="hover:text-pink-400 transition">
                            My Generations
                        </Link>
                        <Link onClick={() => setIsOpen(false)} to='/profile' className="hover:text-pink-400 transition">
                            Profile
                        </Link>
                        <Link onClick={() => setIsOpen(false)} to='/analytics' className="hover:text-pink-400 transition">
                            Analytics
                        </Link>
                        <Link onClick={() => setIsOpen(false)} to='/collections' className="hover:text-pink-400 transition">
                            Collections
                        </Link>
                    </>
                ) : (
                    <Link onClick={() => setIsOpen(false)} to='/about' className="hover:text-pink-400 transition">
                        About
                    </Link>
                )}

                <button onClick={handleContactScroll} className="hover:text-pink-400 transition">
                    Contact us
                </button>

                {/* Mobile Credits */}
                {isLoggedIn && user && (
                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm">
                        <span className="text-yellow-400">⚡</span>
                        <span className="text-zinc-200 font-medium">{user.credits}</span>
                        <span className="text-zinc-400 text-xs">credits</span>
                    </div>
                )}

                {isLoggedIn ? (
                    <button
                        onClick={() => { setIsOpen(false); logout(); }}
                        className="text-red-400 font-medium"
                    >
                        Logout
                    </button>
                ) : (
                    <Link onClick={() => setIsOpen(false)} to='/login' className="px-8 py-2 bg-pink-600 rounded-full">
                        Login
                    </Link>
                )}

                <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 active:ring-3 active:ring-white aspect-square size-12 p-1 items-center justify-center bg-white/10 hover:bg-white/20 transition text-white rounded-full flex border border-white/10"
                >
                    <XIcon size={24} />
                </button>
            </div>
        </>
    );
}