"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SideBar = ({ open, setOpen }) => {
    const pathname = usePathname();

    const adminSidebar = [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Appointments",
            icon: CalendarDays,
            children: [
                { title: "All Appointments", href: "/admin/appointments" },
                { title: "Create Appointment", href: "/admin/appointments/create" },
            ],
        },
        {
            title: "Bookings",
            icon: BookOpen,
            children: [
                { title: "All Bookings", href: "/admin/bookings" },
                { title: "Pending", href: "/admin/bookings/pending" },
                { title: "Confirmed", href: "/admin/bookings/confirmed" },
                { title: "Cancelled", href: "/admin/bookings/cancelled" },
            ],
        },
    ];

    const getDefaultOpenMenus = () => {
        const openMenus = {};
        adminSidebar.forEach((item) => {
            if (item.children) {
                openMenus[item.title] = item.children.some((child) =>
                    pathname.startsWith(child.href)
                );
            }
        });
        return openMenus;
    };

    const [openMenus, setOpenMenus] = useState(getDefaultOpenMenus);

    const toggleMenu = (title) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isParentActive = (children) => {
        return children?.some((child) => pathname.startsWith(child.href));
    };

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed md:static top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-black/10 p-3 transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <nav className="space-y-1">
                    {adminSidebar.map((item, index) => {
                        const Icon = item.icon;
                        const hasChildren = !!item.children;
                        const parentActive =
                            hasChildren && isParentActive(item.children);
                        const linkActive = pathname === item.href;

                        if (hasChildren) {
                            return (
                                <div key={index}>
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition
                                        ${
                                            parentActive
                                                ? "bg-black/5 text-black font-medium"
                                                : "text-gray-500 hover:bg-black/5 hover:text-black"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} />
                                            {item.title}
                                        </div>

                                        <motion.div
                                            animate={{
                                                rotate: openMenus[item.title]
                                                    ? 180
                                                    : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown size={16} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {openMenus[item.title] && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-6 mt-1 space-y-1"
                                            >
                                                {item.children.map(
                                                    (child, childIndex) => {
                                                        const childActive =
                                                            pathname === child.href;

                                                        return (
                                                            <Link
                                                                key={childIndex}
                                                                href={child.href}
                                                                onClick={() =>
                                                                    setOpen(false)
                                                                }
                                                                className={`block px-3 py-1.5 rounded-md text-sm transition
                                                                ${
                                                                    childActive
                                                                        ? "bg-black/10 text-black font-medium"
                                                                        : "text-gray-500 hover:text-black hover:bg-black/5"
                                                                }`}
                                                            >
                                                                {child.title}
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                                ${
                                    linkActive
                                        ? "bg-black/5 text-black font-medium"
                                        : "text-gray-500 hover:bg-black/5 hover:text-black"
                                }`}
                            >
                                <Icon size={18} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default SideBar;