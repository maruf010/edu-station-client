import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MyEnrollClass = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: enrolled = [], isLoading, refetch } = useQuery({
        queryKey: ['enrollments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/enrollments?email=${user.email}`);
            return res.data;
        }
    });

    const openFeedbackModal = (enroll) => {
        setSelectedClass(enroll);
        setIsModalOpen(true);
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const feedbackText = form.feedback.value;

        const feedbackData = {
            studentName: user.displayName,
            studentEmail: user.email,
            studentImage: user.photoURL || '',
            classId: selectedClass.classId,
            className: selectedClass.className,
            feedback: feedbackText,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await axiosSecure.post('/feedbacks', feedbackData);
            if (res.data.insertedId) {
                Swal.fire('Success', 'Feedback submitted!', 'success');
                form.reset();
                setIsModalOpen(false);
                refetch();
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to submit feedback.', 'error');
        }
    };

    if (isLoading) return <p className="text-center py-6">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">My Enrolled Classes</h2>
            {enrolled.length === 0 ? (
                <p className="text-center">You haven’t enrolled in any classes yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolled.map((enroll) => (
                        <div key={enroll._id} className="p-4 border rounded bg-white shadow">
                            <img src={enroll.classImage} alt={enroll.className} className="w-full h-40 object-cover rounded mb-3" />
                            <h3 className="text-xl font-semibold mb-1">{enroll.className}</h3>
                            <p><strong>Teacher:</strong> {enroll.teacherName}</p>
                            <p><strong>Email:</strong> {enroll.teacherEmail}</p>
                            <p><strong>Price:</strong> ${enroll.price}</p>
                            <p><strong>Transaction ID:</strong> {enroll.transactionId}</p>
                            <p><strong>Date:</strong> {new Date(enroll.date).toLocaleString()}</p>

                            <button
                                className="btn btn-sm mt-3 bg-indigo-600 text-white hover:bg-indigo-700"
                                onClick={() => openFeedbackModal(enroll)}
                            >
                                Give Feedback
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Feedback Modal */}
            {isModalOpen && selectedClass && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Feedback for: {selectedClass.className}</h3>
                        <form onSubmit={handleFeedbackSubmit}>
                            <textarea
                                name="feedback"
                                className="textarea textarea-bordered w-full h-32 mb-4"
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
