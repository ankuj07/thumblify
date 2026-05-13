import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import About from "./pages/About";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Collections from "./pages/Collections";




/* ================= 404 PAGE ================= */
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
                <h1 className="text-[120px] md:text-[180px] font-black text-white/5 leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-2">
                        <p className="text-4xl font-bold text-zinc-100">Page Not Found</p>
                        <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                            Oops! Yeh page exist nahi karta. Shayad link galat hai ya page move ho gaya hai.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 mt-16">
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-medium transition-all"
                >
                    Go Home
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/6 text-zinc-300 font-medium transition-all"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

/* ================= APP ================= */
export default function App() {
    const { pathname } = useLocation();

    const hideFooter = ['/generate', '/login', '/preview', '/profile', '/analytics', '/collections'].some(p => pathname.startsWith(p));
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#f4f4f5',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '14px',
                    }
                }}
            />
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:id" element={<Generate />} />
                <Route path="/my-generation" element={<MyGeneration />} />
                <Route path="/preview" element={<YtPreview />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/collections" element={<Collections />} />


                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            {!hideFooter && <Footer />}
        </>
    );
}