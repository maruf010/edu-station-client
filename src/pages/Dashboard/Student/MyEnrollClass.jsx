import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import StarRatings from 'react-star-ratings';
import Loading from '../../../components/Shared/Loading';
import { Link } from 'react-router';

const MyEnrollClass = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rating, setRating] = useState(0);
    const classesPerPage = 6;

    // Fetch Enrolled Classes
    const { data: enrolled = [], isLoading, refetch } = useQuery({
        queryKey: ['enrollments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/enrollments?email=${user.email}`);
            return res.data;
        }
    });
    console.log(enrolled);


    // Fetch Feedbacks Given by the User
    const { data: feedbacks = [] } = useQuery({
        queryKey: ['myFeedbacks', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/feedback?email=${user.email}`);
            return res.data;
        }
    });

    const openFeedbackModal = (enroll) => {
        setSelectedClass(enroll);
        setIsModalOpen(true);
        setRating(0);
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const feedbackText = form.feedback.value;

        if (rating === 0) {
            return Swal.fire('Warning', 'Please provide a rating.', 'warning');
        }

        const feedbackData = {
            studentName: user.displayName,
            studentEmail: user.email,
            studentImage: user.photoURL || '',
            classId: selectedClass.classId,
            className: selectedClass.className,
            feedback: feedbackText,
            rating,
        };

        try {
            const res = await axiosSecure.post('/feedbacks', feedbackData);
            if (res.data.insertedId) {
                Swal.fire('✅ Success!', 'Your feedback has been submitted.', 'success');
                refetch();
                form.reset();
                setIsModalOpen(false);
                setRating(0);
            }
        } catch (err) {
            if (err?.response?.status === 400) {
                Swal.fire('⚠️ Already Submitted', err.response.data.message, 'info');
                setIsModalOpen(false);
            } else {
                console.error(err);
                Swal.fire('Error', err?.response?.data?.message || 'Something went wrong.', 'error');
            }
        }
    };

    // Pagination
    const indexOfLast = currentPage * classesPerPage;
    const currentClasses = enrolled.slice(indexOfLast - classesPerPage, indexOfLast);
    const totalPages = Math.ceil(enrolled.length / classesPerPage);

    if (isLoading) return <Loading />;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">My Enrolled Classes</h2>

            {enrolled.length === 0 ? (
                <p className="text-center">You haven’t enrolled in any classes yet.</p>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentClasses.map((enroll) => {
                            const alreadySubmitted = feedbacks.some(f => f.classId === enroll.classId);
                            return (
                                <div key={enroll._id} className="p-4 border rounded bg-white shadow">
                                    <img src={enroll.classImage} alt={enroll.className} className="w-full h-40 object-cover rounded mb-3" />
                                    <h3 className="text-xl font-semibold mb-1">{enroll.className}</h3>
                                    <p><strong>Teacher:</strong> {enroll.teacherName}</p>
                                    <p><strong>Email:</strong> {enroll.teacherEmail}</p>
                                    <p><strong>Price:</strong> ${enroll.price}</p>
                                    <p><strong>Transaction ID:</strong> {enroll.transactionId}</p>
                                    <p className='mt-2'><strong>Date:</strong> {new Date(enroll.date).toLocaleString()}</p>

                                    <div className='flex justify-between items-center mt-3'>
                                        <div>
                                            {alreadySubmitted ? (
                                                <button className="btn btn-sm bg-gray-400 text-white cursor-not-allowed" disabled>
                                                    Feedback Submitted
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                                    onClick={() => openFeedbackModal(enroll)}
                                                >
                                                    Give Feedback
                                                </button>
                                            )}
                                        </div>
                                        <div>
                                            <Link to={`/dashboard/assignments/${enroll.classId}`}>
                                                <button className="btn btn-sm bg-green-600 text-white hover:bg-green-800">
                                                    View Assignments
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-4 items-center">
                            <button
                                className="btn btn-sm bg-gray-200 hover:bg-gray-300"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn btn-sm bg-gray-200 hover:bg-gray-300"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Feedback Modal */}
            {isModalOpen && selectedClass && (
                <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h3 className="text-lg font-bold mb-4">Feedback for: {selectedClass.className}</h3>

                        <form onSubmit={handleFeedbackSubmit}>
                            <label className="block mb-1 font-medium">Rating:</label>
                            <StarRatings
                                rating={rating}
                                starRatedColor="#facc15"
                                starHoverColor="#fbbf24"
                                changeRating={(rate) => setRating(rate)}
                                numberOfStars={5}
                                name='rating'
                                starDimension="30px"
                                starSpacing="4px"
                            />

                            <label className="block mt-4 mb-1 font-medium">Your Feedback:</label>
                            <textarea
                                name="feedback"
                                className="textarea textarea-bordered w-full h-28 mb-4"
                                placeholder="Write your feedback..."
                                required
                            ></textarea>

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-sm bg-green-600 text-white">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEnrollClass;
