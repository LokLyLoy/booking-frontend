import React from "react";
import TopBar from "@/components/(admin)/TopBar/TopBar";
import SideBar from "@/components/(admin)/SideBar/SideBar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="hidden md:flex h-16 bg-white items-center px-6 border-b border-gray-200">
                <TopBar />
            </header>

            <main className="flex">
                <SideBar />

                <section className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children}
                </section>
            </main>
        </div>
    );
}