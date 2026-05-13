import React, { useState, useEffect } from "react"
import SoftBackdrop from "../components/SoftBackdrop";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [state, setState] = useState<"login" | "register">("login")
    const { user, login, signUp, googleLogin } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (state === 'login') {
            login({ email: formData.email, password: formData.password })
        } else {
            signUp(formData)
        }
    }

    // ✅ Google Login handler
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // access_token se userinfo lete hain
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const profile = await res.json();
            // ab idToken ki jagah access_token bhejo — backend adjust karenge
            await googleLogin(tokenResponse.access_token);
        },
        onError: () => {
            console.log('Google login failed');
        }
    });

    useEffect(() => {
        if (user) navigate('/')
    }, [user, navigate])

    return (
        <>
            <SoftBackdrop />
            <div className='min-h-screen flex items-center justify-center'>
                <form
                    onSubmit={handleSubmit}
                    className="sm:w-87.5 w-full text-center bg-gray-900 border border-gray-800 rounded-2xl px-8">

                    <h1 className="text-white text-3xl mt-10 font-medium">
                        {state === "login" ? "Login" : "Sign up"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>

                    {/* ✅ Google Button */}
                    <button
                        type="button"
                        onClick={() => handleGoogleLogin()}
                        className="mt-6 w-full h-11 rounded-full border border-gray-700 bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center gap-3 text-white text-sm font-medium"
                    >
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-700"/>
                        <span className="text-gray-500 text-xs">or</span>
                        <div className="flex-1 h-px bg-gray-700"/>
                    </div>

                    {state !== "login" && (
                        <div className="flex items-center w-full bg-gray-800 border border-gray-700 focus-within:border-pink-500 transition-colors duration-200 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                            <input type="text" name="name" placeholder="Name" className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}

                    <div className="flex items-center mt-4 w-full bg-gray-800 border border-gray-700 focus-within:border-pink-500 transition-colors duration-200 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                        <input type="email" name="email" placeholder="Email id" className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="flex items-center mt-4 w-full bg-gray-800 border border-gray-700 focus-within:border-pink-500 transition-colors duration-200 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <input type="password" name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="mt-4 text-left">
                        <button type="button" className="text-sm text-pink-400 hover:underline">
                            Forget password?
                        </button>
                    </div>

                    <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-pink-600 hover:bg-pink-500 transition">
                        {state === "login" ? "Login" : "Sign up"}
                    </button>

                    <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer">
                        {state === "login" ? "Don't have an account?" : "Already have an account?"}
                        <span className="text-pink-400 hover:underline ml-1">click here</span>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Login