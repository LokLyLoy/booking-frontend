"use client";

import React, { useState } from "react";
import TopBar from "@/components/(admin)/TopBar/TopBar";
import SideBar from "@/components/(admin)/SideBar/SideBar";

export default function AdminLayout({ children }) {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Topbar (NOW visible on mobile) */}
            <header className="flex h-16 bg-white items-center px-4 md:px-6 border-b border-gray-200">
                <TopBar onMenuClick={() => setOpenSidebar(true)} />
            </header>

            <main className="flex">

                {/* Sidebar */}
                <SideBar open={openSidebar} setOpen={setOpenSidebar} />

                {/* Content */}
                <section className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children}
                </section>

            </main>
        </div>
    );
}