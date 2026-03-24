'use client'

import React, { useState } from 'react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-10 bg-white border border-gray-200 rounded-2xl shadow-lg">
                {/* Logo */}
                <h1 className="text-4xl font-extrabold text-black text-center mb-8">MyApp</h1>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-black placeholder-gray-400"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-black placeholder-gray-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Log In
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Don't have an account? <a href="#" className="text-black font-medium hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;