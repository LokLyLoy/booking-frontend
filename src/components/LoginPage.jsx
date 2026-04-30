'use client'

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { motion } from "framer-motion";
import Image from "next/image";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await login(username, password);
            if (success) {
                router.push("/admin/dashboard");
            } else {
                alert("Invalid username or password");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ffffff] text-[#000000] font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] px-6 py-10"
            >
                {/* Logo/Icon Area */}
                <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 flex items-center justify-center text-white">
                         <Image 
                            src="/images/logo.png"
                            alt="logo"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>

                <div className="text-center mb-5">
                    <h1 className="text-[32px] font-bold tracking-tight mb-2">
                        Welcome back
                    </h1>
                    <p className="text-[#6e6e73] text-sm">
                        Please enter your details to sign in.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1 text-[#1d1d1f]">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-base"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <label className="block text-sm font-medium text-[#1d1d1f]">
                                Password
                            </label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-base"
                            placeholder="••••••••"
                            required
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full h-12 bg-black text-white font-semibold rounded-xl hover:bg-[#1d1d1f] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Continue"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
