'use client'

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, Calendar, BookOpen, TrendingUp } from 'lucide-react';

const Dashboard = () => {
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

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const usersRes = await fetch(`${API_BASE_URL}/api/users/list`);
            const usersData = usersRes.ok ? await usersRes.json() : [];
            setUsers(usersData);

            const appointmentsRes = await fetch(`${API_BASE_URL}/api/admin/appointments/list`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : [];
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

    const appointmentChartData = appointments.map(apt => ({
        date: apt.date,
        booked: apt.booked_count,
        available: apt.max_capacity - apt.booked_count
    }));

    const statusDistribution = [
        {
            name: 'Open',
            value: appointments.filter(a => a.status === 'open').length,
            color: '#111827'
        },
        {
            name: 'Closed',
            value: appointments.filter(a => a.status === 'closed').length,
            color: '#d1d5db'
        }
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
        <div className="min-h-screen">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm">Booking system overview</p>
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
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <h2 className="text-sm font-medium text-gray-700 mb-4">Recent Users</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Username</th>
                            <th className="px-4 py-3 text-left">Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.slice(0, 5).map(user => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3">{user.id}</td>
                                <td className="px-4 py-3 text-gray-900">{user.username}</td>
                                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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