'use client'

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, Calendar, BookOpen, TrendingUp} from 'lucide-react';
import { authAxios } from "@/lib/auth";
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAppointments: 0,
        totalBookings: 0,
        activeUsers: 0
    });

    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Users
            const usersRes = await authAxios.get(`${API_BASE_URL}/api/users/list`);
            const usersData = usersRes?.data || [];
            setUsers(usersData);

            // Appointments
            const appointmentsRes = await authAxios.get(`${API_BASE_URL}/api/admin/appointments/list`);
            const appointmentsData = appointmentsRes?.data || [];
            setAppointments(appointmentsData);

            setStats({
                totalUsers: usersData.length,
                totalAppointments: appointmentsData.length,
                totalBookings: appointmentsData.reduce((sum, apt) => sum + apt.booked_count, 0),
                activeUsers: usersData.filter(u => u.role === 'user').length
            });

            setError(null);
        } catch (err) {
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getUserTime = (user) =>
        user.createdAt ||
        user.created_at ||
        user.time ||
        user.updatedAt ||
        user.updated_at ||
        '';

    const formatTime = (value) => {
        if (!value) return '-';

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const sortedUsers = [...users].sort((a, b) => {
        const aTime = new Date(getUserTime(a) || 0).getTime();
        const bTime = new Date(getUserTime(b) || 0).getTime();
        return bTime - aTime;
    });

    const totalPages = Math.max(1, Math.ceil(sortedUsers.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = sortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);


    const appointmentChartData = appointments.map(apt => ({
        date: apt.date,
        booked: apt.booked_count,
        available: apt.max_capacity - apt.booked_count
    }));

    const statusDistribution = [
        { name: 'Open', value: appointments.filter(a => a.status === 'open').length, color: '#111827' },
        { name: 'Closed', value: appointments.filter(a => a.status === 'closed').length, color: '#d1d5db' }
    ];

    const StatCard = ({ icon: Icon, title, value }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-100">
                <Icon className="text-gray-700" size={20} />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 text-sm">Booking system overview</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 text-sm text-gray-700 border border-gray-200 bg-white p-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Users} title="Total Users" value={stats.totalUsers} />
                <StatCard icon={Calendar} title="Appointments" value={stats.totalAppointments} />
                <StatCard icon={BookOpen} title="Bookings" value={stats.totalBookings} />
                <StatCard icon={TrendingUp} title="Active Users" value={stats.activeUsers} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">Capacity</h2>
                    {appointmentChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={appointmentChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="booked" fill="#111827" />
                                <Bar dataKey="available" fill="#9ca3af" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-10">No data</p>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">Status</h2>
                    {statusDistribution.some(s => s.value > 0) ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-10">No data</p>
                    )}
                </div>
            </div>

            {/* Users Table */}
            {/*<div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">*/}
            {/*    <h2 className="text-sm font-medium text-gray-700 mb-4">Recent Users</h2>*/}
            {/*    <div className="overflow-x-auto">*/}
            {/*        <table className="w-full text-sm">*/}
            {/*            <thead className="border-b border-gray-200 text-gray-500 text-xs uppercase">*/}
            {/*            <tr>*/}
            {/*                <th className="px-4 py-3 text-left">ID</th>*/}
            {/*                <th className="px-4 py-3 text-left">Username</th>*/}
            {/*                <th className="px-4 py-3 text-left">Email</th>*/}
            {/*            </tr>*/}
            {/*            </thead>*/}
            {/*            <tbody>*/}
            {/*            {users.slice(0, 5).map(user => (*/}
            {/*                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">*/}
            {/*                    <td className="px-4 py-3">{user.id}</td>*/}
            {/*                    <td className="px-4 py-3 text-gray-900">{user.username}</td>*/}
            {/*                    <td className="px-4 py-3 text-gray-600">{user.email}</td>*/}
            {/*                </tr>*/}
            {/*            ))}*/}
            {/*            </tbody>*/}
            {/*        </table>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*table*/}
            <div className="mb-6 border border-black/10 bg-white">
                <div className="border-b border-black/10 px-4 py-3">
                    <h2 className="text-sm font-medium text-black">Recent Users</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-black">
                        <thead className="border-b border-black/10 text-xs uppercase text-black/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">ID</th>
                            <th className="px-4 py-3 text-left font-medium">Username</th>
                            <th className="px-4 py-3 text-left font-medium">Email</th>
                            <th className="px-4 py-3 text-left font-medium">Time</th>
                        </tr>
                        </thead>

                        <tbody>
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="border-b border-black/10 last:border-b-0">
                                    <td className="px-4 py-3">{user.id}</td>
                                    <td className="px-4 py-3">{user.username}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3 text-black/70">
                                        {formatTime(getUserTime(user))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-black/50">
                                    No users found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 text-sm">
        <span className="text-black/60">
            {sortedUsers.length === 0
                ? '0 users'
                : `${startIndex + 1}-${Math.min(startIndex + paginatedUsers.length, sortedUsers.length)} of ${sortedUsers.length}`}
        </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border border-black/10 px-3 py-1.5 text-black disabled:opacity-40"
                        >
                            Prev
                        </button>

                        <span className="min-w-[80px] text-center text-black/60">
                Page {currentPage} / {totalPages}
            </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border border-black/10 px-3 py-1.5 text-black disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-sm font-medium text-gray-700 mb-4">Appointments</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Time</th>
                            <th className="px-4 py-3 text-left">Capacity</th>
                            <th className="px-4 py-3 text-left">Booked</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.slice(0, 5).map(apt => (
                            <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3">{apt.date}</td>
                                <td className="px-4 py-3">{apt.start_time}</td>
                                <td className="px-4 py-3">{apt.max_capacity}</td>
                                <td className="px-4 py-3">{apt.booked_count}</td>
                                <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs rounded-md border ${
                                            apt.status === 'open'
                                                ? 'border-gray-300 text-gray-700'
                                                : 'border-gray-200 text-gray-400'
                                        }`}>
                                            {apt.status}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;