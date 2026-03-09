import React from "react";
import TopBar from "@/components/(admin)/TopBar/TopBar";
import SideBar from "@/components/(admin)/SideBar/SideBar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Bar */}
            <header className="h-16 bg-white flex items-center px-6">
                <TopBar />
            </header>

            {/* Main Layout */}
            <main className="flex">

                {/* Sidebar */}
                <aside className="w-64 h-[calc(100vh-64px)] bg-white">
                    <SideBar />
                </aside>

                {/* Content */}
                <section className="flex-1 p-6 overflow-y-auto">
                    {children}
                </section>

            </main>
        </div>
    );
}