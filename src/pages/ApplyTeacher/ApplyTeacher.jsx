import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../../components/Shared/Loading';
import { Link } from 'react-router';
import { MdDashboardCustomize } from 'react-icons/md';

const ApplyTeacher = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { role, roleLoading } = useUserRole();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    // Fetch current teacher request
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

    if (roleLoading) {
        return <Loading></Loading>
    }

    return (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gray-200 px-4">
            <div className=" max-w-xl w-full p-6 bg-white shadow-md rounded border text-gray-500 border-gray-300">
                <h2 className="text-2xl font-bold text-center mb-4">Apply to Become a Teacher</h2>

                {/* Already a teacher */}
                {!roleLoading && role === 'teacher' && (
                    <div>
                        <p className="text-green-600 text-xl font-semibold text-center mb-5">
                            ✅ You are now a Teacher!
                        </p>
                        <Link to="/dashboard" className="flex justify-center">
                            <div className="relative inline-flex items-center px-8 py-2 overflow-hidden text-lg font-medium text-green-600 border-2 border-green-600 rounded-full hover:text-white group hover:bg-gray-50">
                                <span className="absolute left-0 block w-full h-0 transition-all bg-green-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                                <span className="relative">
                                    <span className='flex items-center justify-center'>
                                        <MdDashboardCustomize className="mr-2" size={25} />
                                        <h2>Go to Dashboard</h2></span>
                                </span>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Show application form and status only if not yet a teacher */}
                {!roleLoading && role !== 'teacher' && (
                    <>
                        {status === 'accepted' && (
                            <p className="text-green-600 font-semibold text-center mb-4">
                                ✅ You are now a Teacher!
                            </p>
                        )}

                        {status === 'rejected' && (
                            <div className="text-center mb-4">
                                <p className="text-red-600 font-semibold mb-2">
                                    ❌ Your previous application was rejected.
                                </p>
                                <button className="btn btn-warning btn-sm" onClick={handleReapply}>
                                    Reapply
                                </button>
                            </div>
                        )}

                        {status === 'pending' && (
                            <p className="text-yellow-600 font-medium text-center mb-4">
                                🕓 Your request is under review.
                            </p>
                        )}

                        {!status && (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <input
                                    type="text"
                                    value={user?.displayName || ''}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100 focus:outline-none focus:border-gray-400"
                                />

                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100 focus:outline-none focus:border-gray-400"
                                />

                                <select
                                    {...register('experience', { required: true })}
                                    className="select select-bordered w-full focus:outline-none focus:border-gray-400"
                                >
                                    <option value="">Select Experience</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="mid-level">Mid-level</option>
                                    <option value="experienced">Experienced</option>
                                </select>
                                {errors.experience && <p className="text-red-500">Experience is required</p>}

                                <input
                                    type="text"
                                    {...register('title', { required: true })}
                                    className="input input-bordered w-full focus:outline-none focus:border-gray-400"
                                    placeholder="Your title or specialization"
                                />
                                {errors.title && <p className="text-red-500">Title is required</p>}

                                <select
                                    {...register('category', { required: true })}
                                    className="select select-bordered w-full focus:outline-none focus:border-gray-400"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="Academic Skills">Academic Skills</option>
                                    <option value="Machine Learning">Machine Learning</option>
                                    <option value="Graphics and MS Office">Graphics and MS Office</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                                {errors.category && <p className="text-red-500">Category is required</p>}

                                <button className="btn text-white bg-gray-500 hover:bg-gray-600 transition w-full">Submit Application</button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div >
    );
};

export default ApplyTeacher;
