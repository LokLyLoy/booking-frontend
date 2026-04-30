'use client'

import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, Eye, Trash2, AlertTriangle, X, SquarePen, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { authAxios } from "@/lib/auth";
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const itemsPerPage = 8;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await authAxios.get(`${API_BASE_URL}/api/admin/appointments/list`);
            setAppointments(res.data || []);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!appointmentToDelete) return;
        
        try {
            setIsDeleting(true);
            await authAxios.delete(`${API_BASE_URL}/api/admin/appointments/delete/${appointmentToDelete.id}`);
            setAppointments(prev => prev.filter(apt => apt.id !== appointmentToDelete.id));
            setIsDeleteModalOpen(false);
            setAppointmentToDelete(null);
        } catch (err) {
            console.error('Failed to delete appointment:', err);
            alert('Failed to delete appointment. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (appointment) => {
        setAppointmentToDelete(appointment);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (apt) => {
        // Convert date from DD-MM-YYYY to YYYY-MM-DD for the input field if it's in that format
        let formattedDate = apt.date;
        if (apt.date.includes('-')) {
            const parts = apt.date.split('-');
            if (parts[0].length === 2) { // DD-MM-YYYY
                const [day, month, year] = parts;
                formattedDate = `${year}-${month}-${day}`;
            }
        }
        
        setEditFormData({
            ...apt,
            date: formattedDate,
            time: apt.start_time
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            setIsUpdating(true);
            
            // Format date back to DD-MM-YYYY for backend
            let formattedDate = editFormData.date;
            if (editFormData.date.includes('-')) {
                const parts = editFormData.date.split('-');
                if (parts[0].length === 4) { // YYYY-MM-DD
                    const [year, month, day] = parts;
                    formattedDate = `${day}-${month}-${year}`;
                }
            }

            const payload = {
                date: formattedDate,
                time: editFormData.time,
                max_capacity: parseInt(editFormData.max_capacity),
                status: editFormData.status
            };

            await authAxios.put(`${API_BASE_URL}/api/admin/appointments/${editFormData.id}/update`, payload);
            
            await fetchAppointments();
            setIsEditModalOpen(false);
            setEditFormData(null);
        } catch (err) {
            console.error('Failed to update appointment:', err);
            alert('Failed to update appointment. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredAppointments = appointments.filter(apt => 
        apt.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.start_time.toLowerCase().includes(searchTerm.toLowerCase())
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

    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        if (!sortConfig.key || !sortConfig.direction) return 0;
        let aVal, bVal;
        switch (sortConfig.key) {
            case 'date':
                // Convert DD-MM-YYYY to comparable string YYYY-MM-DD
                aVal = a.date.split('-').reverse().join('-');
                bVal = b.date.split('-').reverse().join('-');
                break;
            case 'start_time': aVal = a.start_time; bVal = b.start_time; break;
            case 'max_capacity': aVal = a.max_capacity; bVal = b.max_capacity; break;
            case 'booked_count': aVal = a.booked_count; bVal = b.booked_count; break;
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

    const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sortedAppointments.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="px-6 py-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
                    <p className="text-gray-500 text-sm">Manage and monitor all booking slots.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchAppointments}
                        className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors border border-gray-200 bg-white shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <Link href="/admin/appointments/create">
                        <button className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm">
                            <Plus size={18} />
                            New Appointment
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filter section */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by date, time, or status..."
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
                                {[{ label: 'Date', key: 'date' }, { label: 'Time', key: 'start_time' }, { label: 'Capacity', key: 'max_capacity' }, { label: 'Booked', key: 'booked_count' }, { label: 'Status', key: 'status' }].map(({ label, key }) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="inline-flex items-center">
                                            {label}<SortIcon col={key} />
                                        </span>
                                    </th>
                                ))}
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
                                currentData.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-sm text-gray-900">{apt.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{apt.start_time}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{apt.max_capacity}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="min-w-[20px] font-medium">{apt.booked_count}</span>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                                    <div 
                                                        className="h-full bg-black transition-all duration-500" 
                                                        style={{ width: `${Math.min(100, (apt.booked_count / apt.max_capacity) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                apt.status === 'open' 
                                                ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                                                : 'bg-gray-50 border-gray-200 text-gray-500'
                                            }`}>
                                                {apt.status}
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
                                                    onClick={() => openEditModal(apt)}
                                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                                    title="Edit Appointment"
                                                >
                                                    <SquarePen size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(apt)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Delete Appointment"
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
                                        No appointments found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-black/10 px-6 py-4 text-sm bg-white">
                    <span className="text-black/60">
                        {sortedAppointments.length === 0
                            ? '0 appointments'
                            : `${startIndex + 1}-${Math.min(startIndex + currentData.length, sortedAppointments.length)} of ${sortedAppointments.length}`}
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

            {/* Edit Appointment Modal */}
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
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Edit Appointment</h3>
                                    <button 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isUpdating}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleUpdate} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
                                            <input 
                                                type="date"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                                value={editFormData.date}
                                                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time</label>
                                            <input 
                                                type="time"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                                value={editFormData.time}
                                                onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Max Capacity</label>
                                            <input 
                                                type="number"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                                value={editFormData.max_capacity}
                                                onChange={(e) => setEditFormData({...editFormData, max_capacity: e.target.value})}
                                                required
                                                min="1"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                                            <select 
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                                value={editFormData.status}
                                                onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                                            >
                                                <option value="open">Open</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
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
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isDeleting}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Appointment</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Are you sure you want to delete the appointment for <span className="font-semibold text-gray-900">{appointmentToDelete?.date}</span> at <span className="font-semibold text-gray-900">{appointmentToDelete?.start_time}</span>? This action cannot be undone.
                                </p>
                            </div>
                            
                            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="inline-flex justify-center items-center px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    {isDeleting ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : 'Delete'}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isDeleting}
                                    className="inline-flex justify-center items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all shadow-sm disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Appointments;