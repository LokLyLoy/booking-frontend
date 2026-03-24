'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { UserCircle, LogOut, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // <- Import js-cookie

const inter = Inter({
    subsets: ["latin"],
});

const TopBar = ({ onMenuClick }) => {
    const [dropDown, setDropDown] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        // Remove the access_token cookie
        Cookies.remove("access_token", { path: "/" });

        // Redirect to login page
        router.push("/login");
    };

    return (
        <header className="w-full flex items-center justify-between px-4 md:px-6 h-14 border-black/10 bg-white">

            {/* LEFT */}
            <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-1.5 rounded-md hover:bg-black/5 transition"
                >
                    <Menu className="w-5 h-5 text-black" />
                </button>

                {/* Logo */}
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded-md"
                    />
                    <span className="hidden md:block text-lg font-bold text-black tracking-tight">
                        PnV Skin Care Center
                    </span>
                </Link>
            </div>

            {/* RIGHT */}
            <div className="relative">
                <button
                    onClick={() => setDropDown(!dropDown)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/5 transition"
                >
                    <UserCircle className="w-5 h-5 text-black" />
                    <span className="hidden md:block text-sm text-gray-600">Profile</span>
                </button>

                <AnimatePresence>
                    {dropDown && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="absolute right-0 mt-2 w-40 bg-white border border-black/10 rounded-lg p-1"
                        >
                            <Link
                                href="/admin/profile"
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-black/5 hover:text-black transition"
                            >
                                <UserCircle className="w-4 h-4" />
                                Profile
                            </Link>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-black/5 hover:text-black transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default TopBar;