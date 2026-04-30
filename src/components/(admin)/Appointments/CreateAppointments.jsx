'use client'

import React, { useState } from 'react';
import { Calendar, Clock, Users, ArrowLeft, Save, RefreshCw, AlertCircle, CheckCircle2, LayersPlus } from 'lucide-react';
import { authAxios } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CreateAppointments = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        max_capacity: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'max_capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!formData.date || !formData.time || formData.max_capacity <= 0) {
            setError('Please fill in all fields correctly.');
            setLoading(false);
            return;
        }

        try {
            // Format date from YYYY-MM-DD to DD-MM-YYYY as per requirement
            const [year, month, day] = formData.date.split('-');
            const formattedDate = `${day}-${month}-${year}`;

            const payload = {
                date: formattedDate,
                time: formData.time,
                max_capacity: formData.max_capacity
            };

            await authAxios.post(`${API_BASE_URL}/api/admin/appointments/create`, payload);
            
            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/appointments');
            }, 1500);
        } catch (err) {
            console.error('Failed to create appointment:', err);
            setError(err.response?.data?.message || 'Failed to create appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/admin/appointments"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Create New Appointment</h1>
                    <p className="text-gray-500 text-sm">Add a new time slot for bookings.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Feedback Messages */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                            <AlertCircle size={18} />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {success && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                            <CheckCircle2 size={18} />
                            <p>Appointment created successfully!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                Date
                            </label>
                            <input 
                                type="date"
                                name="date"
                                required
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                value={formData.date}
                                onChange={handleChange}
                                disabled={loading || success}
                            />
                        </div>

                        {/* Time Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                Start Time
                            </label>
                            <input 
                                type="time"
                                name="time"
                                required
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                value={formData.time}
                                onChange={handleChange}
                                disabled={loading || success}
                            />
                        </div>

                        {/* Capacity Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Users size={16} className="text-gray-400" />
                                Max Capacity
                            </label>
                            <input 
                                type="number"
                                name="max_capacity"
                                required
                                min="1"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                                value={formData.max_capacity}
                                onChange={handleChange}
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {loading ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <LayersPlus size={18} />
                            )}
                            {loading ? 'Creating...' : 'Create Appointment'}
                        </button>
                        <Link 
                            href="/admin/appointments"
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAppointments;