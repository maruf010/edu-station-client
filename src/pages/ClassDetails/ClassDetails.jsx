import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Payment/CheckoutForm';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Shared/Loading';
import toast from 'react-hot-toast';
import StarRatings from 'react-star-ratings';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const ClassDetails = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { id: classId } = useParams();

    const [showModal, setShowModal] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const {
        data: classData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['class-details', classId],
        queryFn: async () => {
            const res = await axios.get(`/classes/approved/${classId}`);
            return res.data;
        },
    });

    const {
        data: enrollments = [],
        isLoading: enrollmentsLoading,
        refetch: refetchEnrollments
    } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/enrollments?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    const isAlreadyEnrolled = useMemo(
        () => enrollments.some(e => e.classId === classId),
        [enrollments, classId]
    );

    useEffect(() => {
        if (user && classId) {
            axiosSecure
                .get(`/wishlist?email=${user.email}`)
                .then((res) => {
                    const found = res.data.find((item) => item.classId === classId);
                    if (found) setIsWishlisted(true);
                });
        }
    }, [user, classId, axiosSecure]);

    const { data: feedbacks = [], isLoading: fbLoading } = useQuery({
        queryKey: ['class-feedbacks', classId],
        queryFn: async () => {
            const res = await axios.get(`/feedbacks?classId=${classId}`);
            return res.data;
        },
    });

    const handleAddToWishlist = async () => {
        if (!classData) return;
        const wishlistData = {
            classId: classData._id,
            className: classData.name,
            image: classData.image,
            price: classData.price,
            teacherName: classData.teacherName,
            teacherEmail: classData.teacherEmail,
            userEmail: user.email,
            addedAt: new Date()
        };

        try {
            await axiosSecure.post('/wishlist', wishlistData);
            setIsWishlisted(true);
            toast.success('Added to wishlist');
        } catch {
            toast.error('Already in wishlist or enrolled');
        }
    };

    if (isLoading || enrollmentsLoading) return <Loading />;
    if (error || !classData) return <p className="text-center text-red-500 py-8">Failed to load class details.</p>;

    return (
        <div className="max-w-7xl min-h-screen flex flex-col gap-10 mx-auto p-6">
            {/* Class Info */}
            <div className="lg:flex bg-white shadow-xl rounded overflow-hidden">
                <div className="lg:w-1/2">
                    <img
                        src={classData.image}
                        alt={classData.name}
                        className="w-full h-[350px] object-cover"
                    />
                </div>
                <div className="lg:w-1/2 lg:ml-8 p-6 space-y-4">
                    <h2 className="text-3xl font-bold">{classData.name}</h2>
                    <div className="flex items-center gap-4">
                        <img
                            src={classData.teacherImage}
                            alt="Teacher"
                            className="w-14 h-14 rounded-full"
                        />
                        <div>
                            <p><strong>{classData.teacherName}</strong></p>
                            <p className="text-sm text-gray-600">{classData.teacherEmail}</p>
                        </div>
                    </div>
                    <p className="text-gray-700">{classData.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>Price:</strong> ${classData.price}</p>
                        <p><strong>Seats:</strong> {classData.seats}</p>
                        <p><strong>Enrolled:</strong> {classData.enrolled || 0}</p>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            disabled={isAlreadyEnrolled}
                            onClick={() => setShowModal(true)}
                            className={`btn ${isAlreadyEnrolled
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isAlreadyEnrolled ? 'Already Enrolled' : 'Pay Now'}
                        </button>
                        {!isAlreadyEnrolled && (
                            <button
                                onClick={handleAddToWishlist}
                                disabled={isWishlisted}
                                className={`btn ${isWishlisted ? 'bg-gray-300 text-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                            >
                                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Feedbacks */}
            <div className="bg-white shadow p-6 rounded">
                <h3 className="text-2xl font-semibold mb-4">Student Feedback</h3>
                {fbLoading ? (
                    <Loading />
                ) : feedbacks.length === 0 ? (
                    <p className="text-center text-gray-500">No feedback available yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {feedbacks.map((fb) => (
                            <li key={fb._id} className="border p-4 rounded shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={fb.studentImage}
                                        alt={fb.studentName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium">{fb.studentName}</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(fb.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <StarRatings
                                    rating={fb.rating}
                                    starRatedColor="#facc15"
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="20px"
                                    starSpacing="2px"
                                />
                                <p className="mt-2 text-gray-700">{fb.feedback}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Payment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-opacity-50 flex items-center justify-center">
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
                                classData={classData}
                                closeModal={() => {
                                    setShowModal(false);
                                    refetch(); // update seats/enrolled
                                    refetchEnrollments();
                                }}
                                refetch={refetch}
                                refetchEnrollments={refetchEnrollments}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetails;
