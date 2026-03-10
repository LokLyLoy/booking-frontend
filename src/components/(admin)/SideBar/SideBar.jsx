"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    Users,
    UserCircle,
    LogOut,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SideBar = () => {
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
                { title: "Pending Bookings", href: "/admin/bookings/pending" },
                { title: "Confirmed Bookings", href: "/admin/bookings/confirmed" },
                { title: "Cancelled Bookings", href: "/admin/bookings/cancelled" },
            ],
        },
        {
            title: "Users",
            icon: Users,
            children: [
                { title: "All Users", href: "/admin/users" },
                { title: "Create User", href: "/admin/users/create" },
            ],
        },
        {
            title: "Profile",
            href: "/admin/profile",
            icon: UserCircle,
        },
        {
            title: "Logout",
            href: "/admin/logout",
            icon: LogOut,
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
        <aside className="w-[270px] min-h-screen bg-[#f8f8f8] border-r border-gray-200 p-4">
            <nav className="space-y-2">
                {adminSidebar.map((item, index) => {
                    const Icon = item.icon;
                    const hasChildren = !!item.children;
                    const parentActive = hasChildren && isParentActive(item.children);
                    const linkActive = item.href && pathname === item.href;

                    if (hasChildren) {
                        return (
                            <div key={index} className="rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => toggleMenu(item.title)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                                        parentActive
                                            ? "bg-gray-200 text-gray-900 font-semibold"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className="shrink-0" />
                                        <span className="text-sm">{item.title}</span>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: openMenus[item.title] ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <ChevronDown size={18} />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openMenus[item.title] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-6 mt-2 border-l border-gray-200 pl-4 space-y-1 pb-1">
                                                {item.children.map((child, childIndex) => {
                                                    const childActive = pathname === child.href;

                                                    return (
                                                        <motion.div
                                                            key={childIndex}
                                                            initial={{ x: -8, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            exit={{ x: -8, opacity: 0 }}
                                                            transition={{
                                                                duration: 0.2,
                                                                delay: childIndex * 0.04,
                                                            }}
                                                        >
                                                            <Link
                                                                href={child.href}
                                                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                                                    childActive
                                                                        ? "bg-white text-gray-900 font-semibold shadow-sm"
                                                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                                                }`}
                                                            >
                                                                <span>{child.title}</span>
                                                            </Link>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                                linkActive
                                    ? "bg-gray-200 text-gray-900 font-semibold"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className="text-sm">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default SideBar;