'use client'

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye, Trash2, SquarePen, Calendar, User, Phone, Tag, X, AlertCircle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { authAxios } from "@/lib/auth";
import { AnimatePresence, motion } from 'framer-motion';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const itemsPerPage = 8;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await authAxios.get(`${API_BASE_URL}/api/admin/booking/list`);
            setBookings(res.data || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (booking) => {
        setEditFormData({
            id: booking.id,
            status: booking.status,
            customer_name: booking.customer_name
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateStatus = async (e) => {
        if (e) e.preventDefault();
        try {
            setIsUpdating(true);
            const res = await authAxios.put(`${API_BASE_URL}/api/admin/booking/${editFormData.id}/status`, {
                status: editFormData.status
            });

            if (res.data && res.data.booking) {
                setBookings(prev => prev.map(b => 
                    b.id === res.data.booking.id ? { ...b, status: res.data.booking.status } : b
                ));
            } else {
                // Fallback to fetch all if response doesn't have updated booking
                await fetchBookings();
            }
            
            setIsEditModalOpen(false);
            setEditFormData(null);
        } catch (err) {
            console.error('Failed to update booking status:', err);
            alert('Failed to update booking status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredBookings = bookings.filter(booking => 
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.appointment?.date && booking.appointment.date.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key !== key) return { key, direction: 'asc' };
            if (prev.direction === 'asc') return { key, direction: 'desc' };
            if (prev.direction === 'desc') return { key: null, direction: null };
            return { key, direction: 'asc' };
        });
        setCurrentPage(1);
    };

    const sortedBookings = [...filteredBookings].sort((a, b) => {
        if (!sortConfig.key || !sortConfig.direction) return 0;
        let aVal, bVal;
        switch (sortConfig.key) {
            case 'id': aVal = a.id; bVal = b.id; break;
            case 'customer_name': aVal = a.customer_name?.toLowerCase(); bVal = b.customer_name?.toLowerCase(); break;
            case 'appointment_date':
                aVal = a.appointment?.date ? a.appointment.date.split('-').reverse().join('-') : '';
                bVal = b.appointment?.date ? b.appointment.date.split('-').reverse().join('-') : '';
                break;
            case 'status': aVal = a.status; bVal = b.status; break;
            default: return 0;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ col }) => {
        if (sortConfig.key !== col) return <ChevronsUpDown size={14} className="ml-1 opacity-40" />;
        if (sortConfig.direction === 'asc') return <ChevronUp size={14} className="ml-1 text-gray-700" />;
        return <ChevronDown size={14} className="ml-1 text-gray-700" />;
    };

    const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sortedBookings.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="px-6 py-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
                    <p className="text-gray-500 text-sm">Monitor and manage customer reservations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchBookings}
                        className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Filter section */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by customer, phone, status or date..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 bg-white shadow-sm transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th
                                    onClick={() => handleSort('id')}
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                >
                                    <span className="inline-flex items-center">ID<SortIcon col="id" /></span>
                                </th>
                                <th
                                    onClick={() => handleSort('customer_name')}
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                >
                                    <span className="inline-flex items-center">Customer<SortIcon col="customer_name" /></span>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th
                                    onClick={() => handleSort('appointment_date')}
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                >
                                    <span className="inline-flex items-center">Appointment<SortIcon col="appointment_date" /></span>
                                </th>
                                <th
                                    onClick={() => handleSort('status')}
                                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                >
                                    <span className="inline-flex items-center">Status<SortIcon col="status" /></span>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : currentData.length > 0 ? (
                                currentData.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-gray-500">#{booking.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-gray-900">{booking.customer_name}</span>
                                                {booking.note && <span className="text-xs text-gray-400 truncate max-w-[150px]">{booking.note}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{booking.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {booking.appointment ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{booking.appointment.date}</span>
                                                    <span className="text-xs text-gray-400">{booking.appointment.start_time}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                booking.status === 'confirmed' 
                                                ? 'bg-green-50 border-green-100 text-green-700' 
                                                : booking.status === 'pending'
                                                ? 'bg-amber-50 border-amber-100 text-amber-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-500'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(booking)}
                                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                    title="Edit Booking"
                                                >
                                                    <SquarePen size={18} />
                                                </button>
                                                <button 
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Delete Booking"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No bookings found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-black/10 px-6 py-4 text-sm bg-white">
                    <span className="text-black/60">
                        {sortedBookings.length === 0
                            ? '0 bookings'
                            : `${startIndex + 1}-${Math.min(startIndex + currentData.length, sortedBookings.length)} of ${sortedBookings.length}`}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border border-black/10 px-3 py-1.5 text-black disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            Prev
                        </button>

                        <span className="min-w-[80px] text-center text-black/60">
                            Page {currentPage} / {totalPages || 1}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="border border-black/10 px-3 py-1.5 text-black disabled:opacity-40 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Booking Status Modal */}
            <AnimatePresence>
                {isEditModalOpen && editFormData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                            onClick={() => !isUpdating && setIsEditModalOpen(false)}
                        />
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Update Booking Status</h3>
                                    <button 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isUpdating}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Booking #{editFormData.id}</p>
                                            <p className="text-xs text-gray-500">Customer: {editFormData.customer_name}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleUpdateStatus} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">New Status</label>
                                        <select 
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                            value={editFormData.status}
                                            onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                                            disabled={isUpdating}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="cursor-pointer flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 focus:outline-none transition-all shadow-sm disabled:opacity-50"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <RefreshCw size={16} className="animate-spin mr-2" />
                                                    Updating...
                                                </>
                                            ) : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            disabled={isUpdating}
                                            className="cursor-pointer flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 focus:outline-none transition-all shadow-sm disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Bookings;