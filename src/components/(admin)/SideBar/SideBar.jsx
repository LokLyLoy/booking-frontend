import React from 'react';

const SideBar = () => {
    const adminSidebar = [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
        },
        {
            title: "Appointments",
            children: [
                { title: "All Appointments", href: "/admin/appointments" },
                { title: "Create Appointment", href: "/admin/appointments/create" },
            ],
        },
        {
            title: "Bookings",
            children: [
                { title: "All Bookings", href: "/admin/bookings" },
                { title: "Pending Bookings", href: "/admin/bookings/pending" },
                { title: "Confirmed Bookings", href: "/admin/bookings/confirmed" },
                { title: "Cancelled Bookings", href: "/admin/bookings/cancelled" },
            ],
        },
        {
            title: "Users",
            children: [
                { title: "All Users", href: "/admin/users" },
                { title: "Create User", href: "/admin/users/create" },
            ],
        },
        {
            title: "Profile",
            href: "/admin/profile",
        },
        {
            title: "Logout",
            href: "/admin/logout",
        },
    ];

    return (
        <div>
            Side Bar worked!
        </div>
    );
};

export default SideBar;