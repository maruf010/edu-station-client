import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Payment/CheckoutForm';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK); // Stripe public key

const ClassDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const [showModal, setShowModal] = useState(false);

    // Fetch class details
    const { data: classData, isLoading, error, refetch } = useQuery({
        queryKey: ['class-details', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/classes/approved/${id}`);
            return res.data;
        }
    });

    // Fetch feedbacks for this class
    const { data: feedbacks = [], isLoading: fbLoading } = useQuery({
        queryKey: ['class-feedbacks', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/feedbacks?classId=${id}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;
    if (error || !classData) return <p className="text-center text-red-500 py-8">Failed to load class details.</p>;

    return (
        <div className="max-w-7xl min-h-screen flex flex-col gap-10 mx-auto p-6">
            {/* Class Info */}
            <div className="lg:flex bg-white shadow-xl">
                <div>
                    <img src={classData.image} alt={classData.name} className="w-full h-[350px] object-cover" />
                </div>
                <div className="lg:ml-16 p-8 lg:p-0">
                    <h2 className="text-3xl font-bold mb-2">{classData.name}</h2>
                    <div className="flex gap-4 items-center mt-4">
                        <img src={classData.teacherImage} alt="Teacher" className="w-16 h-16 rounded-full" />
                        <div>
                            <p><strong>{classData.teacherName}</strong></p>
                            <p className="text-sm text-gray-600">{classData.teacherEmail}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-4">{classData.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p><strong>Price:</strong> ${classData.price}</p>
                            <p><strong>Available Seats:</strong> {classData.seats}</p>
                            <p><strong>Enrolled:</strong> {classData.enrolled || 0}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setShowModal(true)} className="btn bg-blue-600 text-white hover:bg-blue-700">
                            Pay Now
                        </button>
                        <button className="btn bg-gray-300 text-black hover:bg-gray-400">Add to Wishlist</button>
                    </div>
                </div>
            </div>

            {/* Feedbacks Section */}
            <div className="bg-white shadow p-6 rounded">
                <h3 className="text-2xl font-semibold mb-4">Student Feedback</h3>
                {fbLoading ? (
                    <Loading></Loading>
                ) : feedbacks.length === 0 ? (
                    <p className="text-center text-gray-500">No feedback available yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {feedbacks.map((fb) => (
                            <li key={fb._id} className="border p-4 rounded shadow-sm">
                                <p className="mb-1"><strong>{fb.studentName}</strong> <span className="text-sm text-gray-400">({new Date(fb.createdAt).toLocaleDateString()})</span></p>
                                <p className="text-gray-700">{fb.feedback}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Payment Modal */}
            {showModal && (
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
                                refetch={refetch}
                                classData={classData}
                                closeModal={() => setShowModal(false)}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetails;
