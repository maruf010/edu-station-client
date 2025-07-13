import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';
import toast from 'react-hot-toast';
import StarRatings from 'react-star-ratings';

const StudentAssignments = () => {
    const { classId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewSubmission, setViewSubmission] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');

    const [feedbackModal, setFeedbackModal] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(0);

    const { data: classData = {}, isLoading: classLoading } = useQuery({
        queryKey: ['class-info', classId],
        queryFn: () => axiosSecure.get(`/class/${classId}`).then(res => res.data),
        enabled: !!classId,
    });

    const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignments', classId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/assignments/${classId}`);
            return res.data;
        },
        enabled: !!classId,
    });

    const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
        queryKey: ['submissions', user?.email, classId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions?email=${user.email}&classId=${classId}`);
            return res.data;
        },
        enabled: !!user?.email && !!classId,
    });

    const { data: feedbacks = [] } = useQuery({
        queryKey: ['myFeedbacks', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/feedback?email=${user.email}`);
            return res.data;
        }
    });

    const submitAssignment = useMutation({
        mutationFn: async (payload) => {
            const res = await axiosSecure.post('/submissions', payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['submissions', user?.email, classId]);
            toast.success('Assignment submitted!');
            setSelectedAssignment(null);
            setSubmissionText('');
            setAttachmentUrl('');
        },
        onError: () => toast.error('Submission failed'),
    });

    const markAsViewed = async (id, currentHash) => {
        try {
            await axiosSecure.patch(`/submissions/viewed/${id}`, { viewedHash: currentHash });
            queryClient.invalidateQueries(['submissions', user?.email, classId]);
        } catch {
            console.error('Failed to mark as viewed');
        }
    };

    const getSubmissionHash = (submission) => {
        return `${submission.marks || ''}-${submission.review || ''}`;
    };

    const handleViewSubmission = (submission) => {
        setViewSubmission(submission);
        const currentHash = getSubmissionHash(submission);
        if ((submission.marks !== undefined || submission.review) && submission.viewedHash !== currentHash) {
            markAsViewed(submission._id, currentHash);
        }
    };

    const isSubmitted = (assignmentId) => {
        return submissions.find(sub => sub.assignmentId === assignmentId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!submissionText.trim()) return toast.error("Submission text required");
        submitAssignment.mutate({
            assignmentId: selectedAssignment._id,
            classId,
            studentEmail: user.email,
            studentName: user.displayName,
            studentImage: user.photoURL,
            submissionText,
            attachmentUrl,
            submittedAt: new Date(),
            viewedHash: '',
        });
    };

    const submitFeedback = useMutation({
        mutationFn: (payload) => axiosSecure.post('/feedbacks', payload),
        onSuccess: () => {
            toast.success('Feedback submitted!');
            setFeedbackModal(null);
            setFeedbackRating(0);
            queryClient.invalidateQueries(['myFeedbacks', user?.email]);
        },
        onError: (err) => {
            if (err?.response?.status === 400) {
                toast.error(err.response.data.message);
                setFeedbackModal(null);
            } else {
                toast.error('Failed to submit feedback');
            }
        }
    });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const feedbackText = form.feedback.value;
        if (feedbackRating === 0) return toast.error('Please provide a rating');

        const payload = {
            studentName: user.displayName,
            studentEmail: user.email,
            studentImage: user.photoURL || '',
            classId,
            className: classData.name || '',
            assignmentTitle: feedbackModal.title || '',
            feedback: feedbackText,
            rating: feedbackRating,
        };

        submitFeedback.mutate(payload);
    };

    if (isLoadingAssignments || isLoadingSubmissions || classLoading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">{classData?.name} - Assignments</h2>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-600">No assignments available.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map(assignment => {
                        const submission = isSubmitted(assignment._id);
                        const feedbackGiven = feedbacks.find(f => f.assignmentTitle === assignment.title && f.classId === classId);

                        const currentHash = submission ? getSubmissionHash(submission) : '';
                        const showNotification = submission && (submission.marks !== undefined || submission.review) && submission.viewedHash !== currentHash;

                        return (
                            <div key={assignment._id} className="border p-4 bg-white rounded shadow">
                                <h3 className="text-xl font-semibold">{assignment.title}</h3>
                                <p className="text-sm mt-1 text-gray-600">{assignment.description}</p>
                                <p className="text-sm mt-1 text-red-500">Deadline: {new Date(assignment.deadline).toLocaleString()}</p>

                                <div className="mt-3 flex justify-between items-center gap-2 flex-wrap">
                                    {submission ? (
                                        <>
                                            <button
                                                onClick={() => handleViewSubmission(submission)}
                                                className={`btn btn-sm relative border ${
                                                    showNotification ? 'bg-yellow-100 text-yellow-800 animate-pulse border-yellow-400' : 'bg-green-100 text-green-700 border-green-400'
                                                }`}
                                            >
                                                📄 View Submission
                                                {showNotification && <span className="ml-2 animate-bounce">🔔</span>}
                                            </button>

                                            <button
                                                className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                                onClick={() => setFeedbackModal(assignment)}
                                                disabled={!!feedbackGiven}
                                            >
                                                {feedbackGiven ? "Feedback Given" : "Give Feedback"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => setSelectedAssignment(assignment)}
                                        >
                                            Submit Assignment
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Submit Modal */}
            {selectedAssignment && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-xl mb-3">Submit: {selectedAssignment.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <textarea
                                className="textarea textarea-bordered w-full"
                                rows="4"
                                placeholder="Write your answer..."
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                required
                            />
                            <input
                                type="url"
                                className="input input-bordered w-full"
                                placeholder="Attachment link"
                                value={attachmentUrl}
                                onChange={(e) => setAttachmentUrl(e.target.value)}
                            />
                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn bg-green-600 text-white hover:bg-green-700"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setSelectedAssignment(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

            {/* View Submission Modal */}
            {viewSubmission && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-xl mb-4">📄 Your Submission</h3>
                        <div className='space-y-2'>
                            <p><strong>Submitted:</strong> {new Date(viewSubmission.submittedAt).toLocaleString()}</p>
                            <p>{viewSubmission.submissionText}</p>
                            {viewSubmission.attachmentUrl && (
                                <p><strong>Attachment:</strong> <a href={viewSubmission.attachmentUrl} target="_blank" className="text-blue-600 underline">View File</a></p>
                            )}
                            {(viewSubmission.marks !== undefined || viewSubmission.review) && (
                                <div className="bg-blue-50 p-3 rounded border mt-2 space-y-1">
                                    <p><strong>Mark:</strong> {viewSubmission.marks} / 100</p>
                                    <p><strong>Review:</strong> {viewSubmission.review || 'No review yet'}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setViewSubmission(null)}>Close</button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* Feedback Modal */}
            {feedbackModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="text-xl font-bold mb-4">Give Feedback: {feedbackModal.title}</h3>
                        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                            <label className="block font-medium">Rating:</label>
                            <StarRatings
                                rating={feedbackRating}
                                starRatedColor="#facc15"
                                starHoverColor="#fbbf24"
                                changeRating={(rate) => setFeedbackRating(rate)}
                                numberOfStars={5}
                                name="rating"
                                starDimension="28px"
                                starSpacing="4px"
                            />
                            <textarea
                                name="feedback"
                                className="textarea textarea-bordered w-full"
                                placeholder="Write your feedback..."
                                rows={4}
                                required
                            ></textarea>

                            <div className="modal-action">
                                <button type="submit" className="btn bg-green-600 text-white">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setFeedbackModal(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default StudentAssignments;
