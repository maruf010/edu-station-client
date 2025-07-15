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

    const { data: givenFeedbacks = [], refetch: refetchFeedbacks } = useQuery({
        queryKey: ['given-feedbacks', user?.email, classId],
        enabled: !!user?.email && !!classId,
        queryFn: async () => {
            const res = await axiosSecure.get(`/feedbacks?email=${user.email}&classId=${classId}`);
            return res.data;
        }
    });

    const { mutate: submitAssignment, isPending: submitting } = useMutation({
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

    const getSubmissionHash = (submission) => `${submission.marks || ''}-${submission.review || ''}`;

    const handleViewSubmission = (submission) => {
        setViewSubmission(submission);
        const currentHash = getSubmissionHash(submission);
        if (
            (submission.marks !== undefined || submission.review) &&
            submission.viewedHash !== currentHash
        ) {
            markAsViewed(submission._id, currentHash);
        }
    };

    const isSubmitted = (assignmentId) =>
        submissions.find(sub => sub.assignmentId === assignmentId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!submissionText.trim()) return toast.error("Submission text required");

        submitAssignment({
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

    const hasGivenFeedback = (assignmentTitle) => {
        return givenFeedbacks.some(
            fb => fb.assignmentTitle === assignmentTitle && fb.studentEmail === user.email
        );
    };

    const { mutate: submitFeedback } = useMutation({
        mutationFn: (payload) => axiosSecure.post('/feedbacks', payload),
        onSuccess: () => {
            toast.success('Feedback submitted!');
            setFeedbackModal(null);
            setFeedbackRating(0);
            refetchFeedbacks(); // ✅ refetch feedback list
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

        submitFeedback(payload);
    };

    if (isLoadingAssignments || isLoadingSubmissions || classLoading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">{classData?.name} Assignments</h2>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-600">No assignments found for this class.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map(assignment => {
                        const submission = isSubmitted(assignment._id);
                        const showNotification =
                            submission &&
                            (submission.marks !== undefined || submission.review) &&
                            submission.viewedHash !== getSubmissionHash(submission);

                        return (
                            <div key={assignment._id} className="border border-gray-300 hover:border-blue-400 rounded p-4 bg-white shadow">
                                <h3 className="text-xl font-semibold">{assignment.title}</h3>
                                <p className="mt-1 text-gray-700">{assignment.description}</p>
                                <p className="mt-2 text-sm">
                                    <strong>Deadline:</strong>{" "}
                                    <span className="text-red-600">{new Date(assignment.deadline).toLocaleString()}</span>
                                </p>

                                <div className="mt-3 flex justify-between">
                                    {submission ? (
                                        <>
                                            <button
                                                onClick={() => handleViewSubmission(submission)}
                                                className={`btn btn-sm relative ${showNotification ? 'bg-yellow-100 border-yellow-400 text-yellow-800 animate-pulse' : 'bg-green-100 border-green-400 text-green-700'}`}
                                            >
                                                View Submission
                                                {showNotification && <span className="ml-2 animate-bounce">🔔</span>}
                                            </button>
                                            <button
                                                onClick={() => setFeedbackModal(assignment)}
                                                className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                                disabled={hasGivenFeedback(assignment.title)}
                                            >
                                                {hasGivenFeedback(assignment.title) ? 'Feedback Given' : 'Give Feedback'}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedAssignment(assignment)}
                                            className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
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

            {/* Submit Assignment Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white mx-2 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-semibold">Submit: {selectedAssignment.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                className="textarea textarea-bordered w-full focus:outline-none focus:border-blue-300"
                                rows="4"
                                placeholder="Write your answer..."
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                required
                            />
                            <input
                                type="url"
                                className="input input-bordered w-full focus:outline-none focus:border-blue-300"
                                placeholder="Attachment link (optional)"
                                value={attachmentUrl}
                                onChange={(e) => setAttachmentUrl(e.target.value)}
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" className="btn btn-outline" onClick={() => setSelectedAssignment(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn bg-green-600 text-white">
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Submission Modal */}
            {viewSubmission && (
                <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white mx-2 p-6 rounded-xl shadow-lg w-full max-w-lg space-y-4">
                        <h3 className="text-xl font-semibold text-green-600">📄 Your Submission</h3>
                        <p><strong>Submitted At:</strong> {new Date(viewSubmission.submittedAt).toLocaleString()}</p>
                        <div className='border border-gray-300 p-3 rounded'>
                            <p className="whitespace-pre-line">{viewSubmission.submissionText}</p>

                            {viewSubmission.attachmentUrl && (
                                <p className='mt-2'>
                                    <strong>Attachment Link:</strong>{" "}
                                    <a href={viewSubmission.attachmentUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                                        View File
                                    </a>
                                </p>
                            )}
                        </div>

                        {(viewSubmission.marks !== undefined || viewSubmission.review) && (
                            <div className=" p-3 rounded border border-green-300 space-y-1">
                                <p><strong>Teacher's Mark:</strong> {viewSubmission.marks ?? 'Not marked yet'}</p>
                                <p><strong>Review:</strong> {viewSubmission.review || 'No review yet'}</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button className="btn" onClick={() => setViewSubmission(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {feedbackModal && (
                <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white mx-2 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">Give Feedback: {feedbackModal.title}</h3>
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <div className='flex items-center gap-2'>
                                <label className="font-medium">Rating:</label>
                                <StarRatings
                                    rating={feedbackRating}
                                    starRatedColor="#facc15"
                                    starHoverColor="#fbbf24"
                                    changeRating={setFeedbackRating}
                                    numberOfStars={5}
                                    starDimension="28px"
                                    starSpacing="4px"
                                />
                            </div>
                            <textarea
                                name="feedback"
                                className="textarea focus:border-blue-300 focus:outline-none textarea-bordered w-full"
                                placeholder="Write your feedback..."
                                rows={3}
                                maxLength={40}
                                required
                            ></textarea>

                            <div className="flex justify-end gap-3">
                                <button type="button" className="btn bg-red-600 hover:bg-red-700 text-white" onClick={() => setFeedbackModal(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white">
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

export default StudentAssignments;
