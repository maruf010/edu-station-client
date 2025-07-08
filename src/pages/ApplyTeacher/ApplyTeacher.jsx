import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const ApplyTeacher = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // Fetch current user's request
    const { data: existingRequest, refetch } = useQuery({
        queryKey: ['teacherRequest', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/teacherRequests/${user.email}`);
            return res.data;
        }
    });

    const status = existingRequest?.status;

    const onSubmit = async (data) => {
        const teacherData = {
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            experience: data.experience,
            title: data.title,
            category: data.category,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            const res = await axiosSecure.post('/teacherRequests', teacherData);
            if (res.data.insertedId) {
                toast.success('Application submitted!');
                reset();
                refetch();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Already applied.');
        }
    };

    const handleReapply = async () => {
        const res = await axiosSecure.patch(`/teacherRequests/reapply/${user.email}`);
        if (res.data.modifiedCount > 0) {
            toast.success('Reapplied successfully!');
            refetch();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-xl p-6 bg-white shadow-md rounded">
                <h2 className="text-2xl font-bold text-center mb-4">Apply to Teach</h2>

                {status === 'accepted' && (
                    <p className="text-green-600 font-semibold text-center">✅ You are now a Teacher!</p>
                )}

                {status === 'rejected' && (
                    <div className="text-center">
                        <p className="text-red-600 font-semibold mb-2">❌ Your previous request was rejected.</p>
                        <button className="btn btn-warning" onClick={handleReapply}>Reapply</button>
                    </div>
                )}

                {status === 'pending' && (
                    <p className="text-yellow-600 font-medium text-center">🕓 Your request is under review.</p>
                )}

                {!status && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="text" value={user?.displayName || ''} readOnly className="input input-bordered w-full bg-gray-100" />
                        <input type="email" value={user?.email || ''} readOnly className="input input-bordered w-full bg-gray-100" />

                        <select {...register('experience', { required: true })} className="select select-bordered w-full">
                            <option value="">Select Experience</option>
                            <option value="beginner">Beginner</option>
                            <option value="mid-level">Mid-level</option>
                            <option value="experienced">Experienced</option>
                        </select>
                        {errors.experience && <p className="text-red-500">Experience is required</p>}

                        <input type="text" {...register('title', { required: true })} className="input input-bordered w-full" placeholder="Your title or specialization" />
                        {errors.title && <p className="text-red-500">Title is required</p>}

                        <select {...register('category', { required: true })} className="select select-bordered w-full">
                            <option value="">Select Category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Machine Learning">Machine Learning</option>
                        </select>
                        {errors.category && <p className="text-red-500">Category is required</p>}

                        <button className="btn btn-primary w-full">Submit Application</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ApplyTeacher;
