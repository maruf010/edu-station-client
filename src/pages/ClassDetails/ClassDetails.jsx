// ClassDetails.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Payment/CheckoutForm';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Shared/Loading';
import toast from 'react-hot-toast';
import StarRatings from 'react-star-ratings';
import useUserRole from '../../hooks/useUserRole';
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever, MdDescription, MdEventAvailable } from "react-icons/md";
import { IoIosPricetags } from 'react-icons/io';
import { IoPersonAdd } from 'react-icons/io5';
import { FaChalkboardTeacher } from 'react-icons/fa';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);


const ClassDetails = () => {
    const { user } = useAuth();
    const { role } = useUserRole();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { id: classId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [visibleCount, setVisibleCount] = useState(2);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: classData, isLoading, error } = useQuery({
        queryKey: ['class-details', classId],
        queryFn: async () => (await axios.get(`/classes/approved/${classId}`)).data
    });
console.log(classData);

    const { data: enrollments = [], isLoading: enrollmentsLoading, refetch: refetchEnrollments } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: async () => (await axiosSecure.get(`/enrollments?email=${user.email}`)).data,
        enabled: !!user?.email
    });


    const isAlreadyEnrolled = useMemo(
        () => enrollments.some(e => e.classId === classId),
        [enrollments, classId]
    );

    const { data: feedbacks = [], isLoading: fbLoading, refetch: refetchFeedbacks } = useQuery({
        queryKey: ['class-feedbacks', classId],
        queryFn: async () => (await axios.get(`/feedbacks?classId=${classId}`)).data
    });

    const myFeedback = feedbacks.find(fb => fb.studentEmail === user?.email);

    const feedbackMutation = useMutation({
        mutationFn: (newFeedback) => axiosSecure.post("/feedbacks", newFeedback),
        onSuccess: () => {
            toast.success("Feedback submitted");
            refetchFeedbacks();
            setFeedbackText("");
            setRating(0);
        },
        onError: () => toast.error("You already submitted feedback.")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updated }) =>
            axiosSecure.patch(`/feedbacks/${id}`, updated),
        onSuccess: () => {
            toast.success("Feedback updated");
            refetchFeedbacks();
            setShowEditModal(false);
        },
        onError: () => toast.error("Failed to update")
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/feedbacks/${id}`),
        onSuccess: () => {
            toast.success("Feedback deleted");
            refetchFeedbacks();
            setDeleteTarget(null);
        },
        onError: () => toast.error("Failed to delete feedback")
    });

    const handleAddToWishlist = async () => {
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

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        if (!rating || !feedbackText) {
            toast.error("All fields required");
            return;
        }
        const newFeedback = {
            classId,
            studentEmail: user.email,
            studentName: user.displayName,
            studentImage: user.photoURL,
            rating,
            feedback: feedbackText,
            className: classData.name
        };
        feedbackMutation.mutate(newFeedback);
    };

    const handleEditClick = (fb) => {
        setEditingFeedback(fb);
        setRating(fb.rating);
        setFeedbackText(fb.feedback);
        setShowEditModal(true);
    };

    const handleUpdateFeedback = (e) => {
        e.preventDefault();
        const updated = {
            rating,
            feedback: feedbackText
        };
        updateMutation.mutate({ id: editingFeedback._id, updated });
    };

    if (isLoading || enrollmentsLoading) return <Loading />;
    if (error || !classData) return <p className="text-center text-red-500 py-8">Failed to load class details.</p>;

    return (
        <div className='bg-gray-200'>
            <div className="max-w-5xl mx-auto p-4 space-y-5 ">
                {/* Class Info */}
                <div className="lg:flex bg-white gap-5 shadow-lg rounded p-8 overflow-hidden">
                    <img src={classData.image} className="lg:w-1/2 object-cover h-80 lg:h-96 w-full" />
                    <div className="lg:w-1/2  space-y-3">
                        <h2 className="text-2xl font-bold mt-3">{classData.name}</h2>

                        <div className="text-gray-600 flex items-center gap-2">
                            <MdDescription />
                            <strong className='hidden md:flex'>Description:</strong>
                            <span>{classData.description}</span>
                        </div>

                        <div className="text-gray-600 flex items-center gap-2">
                            <FaChalkboardTeacher />
                            <strong>Instructor:</strong>
                            <span>{classData.teacherName}</span>
                        </div>

                        <div className="text-gray-600 flex items-center gap-2">
                            <MdEventAvailable />
                            <strong>Available Seat:</strong>
                            <span>${classData.seats}</span>
                        </div>

                        <div className="text-gray-600 flex items-center gap-2">
                            <IoPersonAdd />
                            <strong>Enrolled:</strong>
                            <span className=''>{classData.enrolled || 0}</span>
                        </div>

                        <div className="text-gray-600 flex items-center gap-2">
                            <IoIosPricetags />
                            <strong>Price:</strong>
                            <span>${classData.price}</span>
                        </div>


                        <div className="flex gap-3 pt-4">
                            <button
                                disabled={isAlreadyEnrolled}
                                onClick={() => setShowModal(true)}
                                className={`btn ${isAlreadyEnrolled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
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

                {/* Feedback Form */}
                {/* {isAlreadyEnrolled && !myFeedback && (
                    <form onSubmit={handleSubmitFeedback} className="bg-white shadow p-5 rounded space-y-4">
                        <h3 className="text-xl font-semibold">Leave Feedback</h3>
                        <StarRatings
                            rating={rating}
                            starRatedColor="#facc15"
                            changeRating={(rate) => setRating(rate)}
                            numberOfStars={5}
                            name="rating"
                            starDimension="25px"
                            starSpacing="3px"
                        />
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none"
                            rows="3"
                            placeholder="Write your feedback..."
                        ></textarea>
                        <button type="submit" className="btn bg-blue-600 hover:bg-blue-800 text-white cursor-pointer">Submit</button>
                    </form>
                )} */}

                {/* Feedback List */}
                <div className="bg-white shadow p-6 rounded">
                    <h3 className="text-xl font-semibold mb-4">Student Feedback</h3>
                    {fbLoading ? (
                        <Loading />
                    ) : feedbacks.length === 0 ? (
                        <p className='text-2xl font-bold'>No feedbacks yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {feedbacks.slice(0, visibleCount).map(fb => (
                                <div key={fb._id} className="border border-gray-400 p-4 rounded-lg flex justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src={fb.studentImage} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-medium">{fb.studentName}</p>
                                                <p className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <StarRatings
                                            rating={fb.rating}
                                            starRatedColor="#facc15"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
                                        <p className="mt-2">{fb.feedback}</p>
                                    </div>

                                    <div>
                                        {(user?.email === fb.studentEmail || role === 'admin') && (
                                            <div className="flex gap-4 mt-2">
                                                {user?.email === fb.studentEmail && (
                                                    <button onClick={() => handleEditClick(fb)} className="cursor-pointer text-blue-500 text-sm"><CiEdit size={25} /></button>
                                                )}
                                                <button onClick={() => setDeleteTarget(fb)} className="cursor-pointer text-red-500 text-sm"><MdDeleteForever size={25} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {visibleCount < feedbacks.length && (
                                <button onClick={() => setVisibleCount(prev => prev + 2)} className="cursor-pointer text-blue-600 mt-4 font-medium">Show More</button>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white border p-6 rounded-lg w-full max-w-lg relative">
                            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowModal(false)}>✕</button>
                            <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    classData={classData}
                                    closeModal={() => {
                                        setShowModal(false);
                                        navigate('/dashboard/my-enroll-class');
                                        refetchFeedbacks();
                                        refetchEnrollments();
                                    }}
                                />
                            </Elements>
                        </div>
                    </div>
                )}

                {/* Edit Feedback Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white mx-5 p-6 border border-gray-400 rounded-lg w-full max-w-lg relative">
                            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowEditModal(false)}>✕</button>
                            <h3 className="text-lg font-semibold mb-4">Edit Feedback</h3>
                            <form onSubmit={handleUpdateFeedback} className="space-y-4">
                                <StarRatings
                                    rating={rating}
                                    starRatedColor="#facc15"
                                    changeRating={setRating}
                                    numberOfStars={5}
                                    name="rating"
                                    starDimension="25px"
                                    starSpacing="3px"
                                />
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    rows="4"
                                ></textarea>
                                <button type="submit" className="btn bg-blue-600 text-white cursor-pointer">Update</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteTarget && (
                    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white border mx-5 border-gray-400 p-6 rounded-lg w-full max-w-md relative text-center">
                            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this feedback?</h3>
                            <p className="mb-6 text-gray-600">This action cannot be undone.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setDeleteTarget(null)} className="btn bg-gray-300 text-black cursor-pointer">Cancel</button>
                                <button onClick={() => deleteMutation.mutate(deleteTarget._id)} className="btn bg-red-500 text-white cursor-pointer">Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassDetails;
