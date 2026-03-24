"use client";

import React, { useState } from "react";
import TopBar from "@/components/(admin)/TopBar/TopBar";
import SideBar from "@/components/(admin)/SideBar/SideBar";

export default function AdminLayout({ children }) {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

            <header className="sticky top-0 flex h-16 bg-white items-center px-4 md:px-6 border-b border-gray-200">
                <TopBar onMenuClick={() => setOpenSidebar(true)} />
            </header>

            <div className="flex flex-1 overflow-hidden">

                <div className="h-full overflow-y-auto">
                    <SideBar open={openSidebar} setOpen={setOpenSidebar} />
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}