import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import CheckoutForm from '../../Payment/CheckoutForm';
import { useNavigate } from 'react-router';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Wishlist = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { data: wishlist = [], refetch: refetchWishlist } = useQuery({
        queryKey: ['wishlist', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
            return res.data;
        },
    });

    const { data: enrollments = [], refetch: refetchEnrollments } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/enrollments?email=${user.email}`);
            return res.data;
        },
    });

    const isEnrolled = (classId) => enrollments.some(e => e.classId === classId);

    const handleDelete = async (id) => {
        await axiosSecure.delete(`/wishlist/${id}`);
        toast.success('Removed from wishlist');
        refetchWishlist();
    };

    const handlePayClick = (item) => {
        const classInfo = {
            classId: item.classId || item._id,
            className: item.className,
            classImage: item.image,
            teacherName: item.teacherName,
            teacherEmail: item.teacherEmail,
            price: item.price,
            _id: item._id,
        };
        setSelectedClass(classInfo);
        setShowModal(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>

            {wishlist.length === 0 ? (
                <p className='text-gray-500 font-medium'>No items in wishlist!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map(item => {
                        const enrolled = isEnrolled(item.classId);
                        return (
                            <div key={item._id} className="shadow-md p-4 rounded">
                                <img src={item.image} alt={item.className} className="h-40 object-cover w-full" />
                                <h3 className="text-xl font-semibold my-2">Course: {item.className}</h3>
                                <div className='space-y-1'>
                                    <p>Instructor: {item.teacherName}</p>
                                    <p>Email: {item.teacherEmail}</p>
                                    <p>Added At: {item.addedAt}</p>
                                    <p>Price: ${item.price}</p>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handlePayClick(item)}
                                        disabled={enrolled}
                                        className={`btn ${enrolled ? 'bg-gray-400' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                    >
                                        {enrolled ? 'Already Enrolled' : 'Pay Now'}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && selectedClass && (
                <div className="fixed inset-0 z-50  bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-red-600 text-xl font-bold"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                classData={selectedClass}
                                wishlistId={selectedClass._id}
                                fromWishlist
                                refetch={refetchWishlist}
                                refetchEnrollments={refetchEnrollments}
                                closeModal={() => {
                                    setShowModal(false);
                                    navigate('/dashboard/my-enroll-class');
                                }}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
