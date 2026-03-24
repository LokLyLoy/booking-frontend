'use client'

import React, { useState } from 'react';
import {useRouter} from "next/navigation";
import { login } from "@/lib/auth";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isFocused, setIsFocused] = useState({ username: false, password: false });

    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            router.push("/admin/dashboard");
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md px-8 py-12">
                {/* Minimalist Logo/Brand */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-light tracking-tight text-black">
                        Welcome back
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 font-light">
                        Sign in to continue
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setIsFocused({ ...isFocused, username: true })}
                            onBlur={() => setIsFocused({ ...isFocused, username: false })}
                            className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-black text-black text-lg transition-colors peer"
                            placeholder=" "
                            required
                        />
                        <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                            isFocused.username || username
                                ? '-top-3 text-xs text-gray-400'
                                : 'top-3 text-gray-400 text-lg'
                        }`}>
                            Username
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsFocused({ ...isFocused, password: true })}
                            onBlur={() => setIsFocused({ ...isFocused, password: false })}
                            className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-black text-black text-lg transition-colors peer"
                            placeholder=" "
                            required
                        />
                        <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                            isFocused.password || password
                                ? '-top-3 text-xs text-gray-400'
                                : 'top-3 text-gray-400 text-lg'
                        }`}>
                            Password
                        </label>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-black" />
                            <span className="ml-2 text-gray-500 font-light">Remember me</span>
                        </label>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors font-light">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300 rounded-none"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;