'use client'

import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import { Inter } from 'next/font/google';
import { UserCircle, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({
    subsets: ['latin'],
});

const TopBar = () => {
    const [dropDown, setDropDown] = useState(false);

    return (
        <div className="w-full flex justify-between items-center">

            {/* Logo */}
            <Link href="/admin/dashboard" className="flex items-center gap-3">
                <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={40}
                    height={40}
                />
                <div className={`${inter.className} font-bold text-lg text-black tracking-tight`}>
                    PnV Skin Care Center
                </div>
            </Link>

            {/* Profile */}
            <div className="relative">

                <div
                    className="flex items-center gap-1.5 cursor-pointer"
                    onClick={() => setDropDown(!dropDown)}
                >
                    <UserCircle className="w-5 h-5 text-black" />
                    <span className="text-sm text-black/70">Profile</span>
                </div>

                <AnimatePresence>
                    {dropDown && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                        >
                            <Link
                                href="/admin/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <UserCircle className="w-4 h-4" />
                                Profile
                            </Link>

                            <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default TopBar;