import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';
import toast from 'react-hot-toast';

const StudentAssignments = () => {
    const { classId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewSubmission, setViewSubmission] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');

    // 🔹 Fetch assignments
    const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignments', classId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/assignments/${classId}`);
            return res.data;
        },
        enabled: !!classId,
    });

    // 🔹 Fetch submissions
    const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
        queryKey: ['submissions', user?.email, classId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/submissions?email=${user.email}&classId=${classId}`);
            return res.data;
        },
        enabled: !!user?.email && !!classId,
    });

    // 🔹 Submit assignment
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

    // 🔹 Mark as viewed when student sees teacher mark/review
    const markAsViewed = async (id, currentHash) => {
        try {
            await axiosSecure.patch(`/submissions/viewed/${id}`, { viewedHash: currentHash });
            queryClient.invalidateQueries(['submissions', user?.email, classId]);
        } catch (err) {
            console.error('Failed to mark as viewed');
        }
    };

    const getSubmissionHash = (submission) => {
        return `${submission.marks || ''}-${submission.review || ''}`;
    };

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

    const isSubmitted = (assignmentId) => {
        return submissions.find(sub => sub.assignmentId === assignmentId);
    };

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
            viewedHash: '', // nothing to compare yet
        });
    };

    if (isLoadingAssignments || isLoadingSubmissions) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Assignments</h2>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-600">No assignments found for this class.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map(assignment => {
                        const submission = isSubmitted(assignment._id);

                        let showNotification = false;
                        if (submission && (submission.marks !== undefined || submission.review)) {
                            const currentHash = getSubmissionHash(submission);
                            if (submission.viewedHash !== currentHash) {
                                showNotification = true;
                            }
                        }

                        return (
                            <div key={assignment._id} className="border border-gray-200 rounded p-4 bg-white shadow">
                                <h3 className="text-lg font-semibold">Title: {assignment.title}</h3>
                                <p className="mt-1 text-gray-700">{assignment.description}</p>
                                <p className="mt-1 text-sm">
                                    <strong>Deadline:</strong>{' '}
                                    {new Date(assignment.deadline).toLocaleString()}
                                </p>

                                <div className='text-end'>
                                    {submission ? (
                                        <button
                                            className={`btn btn-sm mt-2 relative ${showNotification
                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-400 animate-pulse'
                                                : 'bg-green-100 text-green-700 border-green-400'
                                                } hover:bg-green-200`}
                                            onClick={() => handleViewSubmission(submission)}
                                        >
                                            📄 View Submission
                                            {showNotification && (
                                                <span className="ml-2 animate-bounce">🔔</span>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-sm mt-2 bg-indigo-600 text-white hover:bg-indigo-700"
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
                                placeholder="Attachment link (optional)"
                                value={attachmentUrl}
                                onChange={(e) => setAttachmentUrl(e.target.value)}
                            />
                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn bg-green-600 text-white hover:bg-green-700"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
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
                        <div className='border border-gray-300 p-3 rounded-lg space-y-3'>
                            <p className="text-gray-700">
                                <strong>Submitted At:</strong>{' '}
                                {new Date(viewSubmission.submittedAt).toLocaleString()}
                            </p>
                            <p className="text-gray-800 whitespace-pre-line">
                                {viewSubmission.submissionText}
                            </p>

                            {viewSubmission.attachmentUrl && (
                                <div>
                                    <strong>Attachment:</strong>{' '}
                                    <a
                                        href={viewSubmission.attachmentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View File
                                    </a>
                                </div>
                            )}

                            {(viewSubmission.marks !== undefined || viewSubmission.review) && (
                                <div className="bg-gray-50 p-3 rounded border border-blue-300 space-y-1">
                                    <p className="text-sm">
                                        <strong>Teacher's Mark:</strong>{' '}
                                        {viewSubmission.marks !== undefined
                                            ? `${viewSubmission.marks} / 100`
                                            : 'Not marked yet'}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Review:</strong>{' '}
                                        {viewSubmission.review || 'No review yet'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={() => setViewSubmission(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default StudentAssignments;
