// import React, { useState } from 'react';
// import { useParams } from 'react-router';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import useAuth from '../../../hooks/useAuth';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import Loading from '../../../components/Shared/Loading';
// import toast from 'react-hot-toast';
// import StarRatings from 'react-star-ratings';

// const StudentAssignments = () => {
//     const { classId } = useParams();
//     const { user } = useAuth();
//     const axiosSecure = useAxiosSecure();
//     const queryClient = useQueryClient();

//     const [selectedAssignment, setSelectedAssignment] = useState(null);
//     const [viewSubmission, setViewSubmission] = useState(null);
//     const [submissionText, setSubmissionText] = useState('');
//     const [attachmentUrl, setAttachmentUrl] = useState('');

//     const [feedbackModal, setFeedbackModal] = useState(null);
//     const [feedbackRating, setFeedbackRating] = useState(0);

//     const { data: classData = {}, isLoading: classLoading } = useQuery({
//         queryKey: ['class-info', classId],
//         queryFn: () => axiosSecure.get(`/class/${classId}`).then(res => res.data),
//         enabled: !!classId,
//     });

//     const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
//         queryKey: ['assignments', classId],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/assignments/${classId}`);
//             return res.data;
//         },
//         enabled: !!classId,
//     });

//     const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
//         queryKey: ['submissions', user?.email, classId],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/submissions?email=${user.email}&classId=${classId}`);
//             return res.data;
//         },
//         enabled: !!user?.email && !!classId,
//     });

//     const { data: feedbacks = [] } = useQuery({
//         queryKey: ['myFeedbacks', user?.email],
//         enabled: !!user?.email,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/feedback?email=${user.email}`);
//             return res.data;
//         }
//     });

//     const submitAssignment = useMutation({
//         mutationFn: async (payload) => {
//             const res = await axiosSecure.post('/submissions', payload);
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['submissions', user?.email, classId]);
//             toast.success('Assignment submitted!');
//             setSelectedAssignment(null);
//             setSubmissionText('');
//             setAttachmentUrl('');
//         },
//         onError: () => toast.error('Submission failed'),
//     });

//     const markAsViewed = async (id, currentHash) => {
//         try {
//             await axiosSecure.patch(`/submissions/viewed/${id}`, { viewedHash: currentHash });
//             queryClient.invalidateQueries(['submissions', user?.email, classId]);
//         } catch {
//             console.error('Failed to mark as viewed');
//         }
//     };

//     const getSubmissionHash = (submission) => {
//         return `${submission.marks || ''}-${submission.review || ''}`;
//     };

//     const handleViewSubmission = (submission) => {
//         setViewSubmission(submission);
//         const currentHash = getSubmissionHash(submission);
//         if ((submission.marks !== undefined || submission.review) && submission.viewedHash !== currentHash) {
//             markAsViewed(submission._id, currentHash);
//         }
//     };

//     const isSubmitted = (assignmentId) => {
//         return submissions.find(sub => sub.assignmentId === assignmentId);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!submissionText.trim()) return toast.error("Submission text required");
//         submitAssignment.mutate({
//             assignmentId: selectedAssignment._id,
//             classId,
//             studentEmail: user.email,
//             studentName: user.displayName,
//             studentImage: user.photoURL,
//             submissionText,
//             attachmentUrl,
//             submittedAt: new Date(),
//             viewedHash: '',
//         });
//     };

//     const submitFeedback = useMutation({
//         mutationFn: (payload) => axiosSecure.post('/feedbacks', payload),
//         onSuccess: () => {
//             toast.success('Feedback submitted!');
//             setFeedbackModal(null);
//             setFeedbackRating(0);
//             queryClient.invalidateQueries(['myFeedbacks', user?.email]);
//         },
//         onError: (err) => {
//             if (err?.response?.status === 400) {
//                 toast.error(err.response.data.message);
//                 setFeedbackModal(null);
//             } else {
//                 toast.error('Failed to submit feedback');
//             }
//         }
//     });

//     const handleFeedbackSubmit = (e) => {
//         e.preventDefault();
//         const form = e.target;
//         const feedbackText = form.feedback.value;
//         if (feedbackRating === 0) return toast.error('Please provide a rating');

//         const payload = {
//             studentName: user.displayName,
//             studentEmail: user.email,
//             studentImage: user.photoURL || '',
//             classId,
//             className: classData.name || '',
//             assignmentTitle: feedbackModal.title || '',
//             feedback: feedbackText,
//             rating: feedbackRating,
//         };

//         submitFeedback.mutate(payload);
//     };

//     if (isLoadingAssignments || isLoadingSubmissions || classLoading) return <Loading />;

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <h2 className="text-2xl font-bold mb-4 text-center">{classData?.name} - Assignments</h2>

//             {assignments.length === 0 ? (
//                 <p className="text-center text-gray-600">No assignments available.</p>
//             ) : (
//                 <div className="space-y-4">
//                     {assignments.map(assignment => {
//                         const submission = isSubmitted(assignment._id);
//                         const feedbackGiven = feedbacks.find(f => f.assignmentTitle === assignment.title && f.classId === classId);

//                         const currentHash = submission ? getSubmissionHash(submission) : '';
//                         const showNotification = submission && (submission.marks !== undefined || submission.review) && submission.viewedHash !== currentHash;

//                         return (
//                             <div key={assignment._id} className="border p-4 bg-white rounded shadow">
//                                 <h3 className="text-xl font-semibold">{assignment.title}</h3>
//                                 <p className="text-sm mt-1 text-gray-600">{assignment.description}</p>
//                                 <p className="text-sm mt-1 text-red-500">Deadline: {new Date(assignment.deadline).toLocaleString()}</p>

//                                 <div className="mt-3 flex justify-between items-center gap-2 flex-wrap">
//                                     {submission ? (
//                                         <>
//                                             <button
//                                                 onClick={() => handleViewSubmission(submission)}
//                                                 className={`btn btn-sm relative border ${
//                                                     showNotification ? 'bg-yellow-100 text-yellow-800 animate-pulse border-yellow-400' : 'bg-green-100 text-green-700 border-green-400'
//                                                 }`}
//                                             >
//                                                 📄 View Submission
//                                                 {showNotification && <span className="ml-2 animate-bounce">🔔</span>}
//                                             </button>

//                                             <button
//                                                 className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
//                                                 onClick={() => setFeedbackModal(assignment)}
//                                                 disabled={!!feedbackGiven}
//                                             >
//                                                 {feedbackGiven ? "Feedback Given" : "Give Feedback"}
//                                             </button>
//                                         </>
//                                     ) : (
//                                         <button
//                                             className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
//                                             onClick={() => setSelectedAssignment(assignment)}
//                                         >
//                                             Submit Assignment
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             )}

//             {/* Submit Modal */}
//             {selectedAssignment && (
//                 <dialog className="modal modal-open">
//                     <div className="modal-box max-w-lg">
//                         <h3 className="font-bold text-xl mb-3">Submit: {selectedAssignment.title}</h3>
//                         <form onSubmit={handleSubmit} className="space-y-3">
//                             <textarea
//                                 className="textarea textarea-bordered w-full"
//                                 rows="4"
//                                 placeholder="Write your answer..."
//                                 value={submissionText}
//                                 onChange={(e) => setSubmissionText(e.target.value)}
//                                 required
//                             />
//                             <input
//                                 type="url"
//                                 className="input input-bordered w-full"
//                                 placeholder="Attachment link"
//                                 value={attachmentUrl}
//                                 onChange={(e) => setAttachmentUrl(e.target.value)}
//                             />
//                             <div className="modal-action">
//                                 <button
//                                     type="submit"
//                                     className="btn bg-green-600 text-white hover:bg-green-700"
//                                 >
//                                     Submit
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-outline"
//                                     onClick={() => setSelectedAssignment(null)}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </dialog>
//             )}

//             {/* View Submission Modal */}
//             {viewSubmission && (
//                 <dialog className="modal modal-open">
//                     <div className="modal-box max-w-lg">
//                         <h3 className="font-bold text-xl mb-4">📄 Your Submission</h3>
//                         <div className='space-y-2'>
//                             <p><strong>Submitted:</strong> {new Date(viewSubmission.submittedAt).toLocaleString()}</p>
//                             <p>{viewSubmission.submissionText}</p>
//                             {viewSubmission.attachmentUrl && (
//                                 <p><strong>Attachment:</strong> <a href={viewSubmission.attachmentUrl} target="_blank" className="text-blue-600 underline">View File</a></p>
//                             )}
//                             {(viewSubmission.marks !== undefined || viewSubmission.review) && (
//                                 <div className="bg-blue-50 p-3 rounded border mt-2 space-y-1">
//                                     <p><strong>Mark:</strong> {viewSubmission.marks} / 100</p>
//                                     <p><strong>Review:</strong> {viewSubmission.review || 'No review yet'}</p>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="modal-action">
//                             <button className="btn" onClick={() => setViewSubmission(null)}>Close</button>
//                         </div>
//                     </div>
//                 </dialog>
//             )}

//             {/* Feedback Modal */}
//             {feedbackModal && (
//                 <dialog className="modal modal-open">
//                     <div className="modal-box max-w-md">
//                         <h3 className="text-xl font-bold mb-4">Give Feedback: {feedbackModal.title}</h3>
//                         <form onSubmit={handleFeedbackSubmit} className="space-y-3">
//                             <label className="block font-medium">Rating:</label>
//                             <StarRatings
//                                 rating={feedbackRating}
//                                 starRatedColor="#facc15"
//                                 starHoverColor="#fbbf24"
//                                 changeRating={(rate) => setFeedbackRating(rate)}
//                                 numberOfStars={5}
//                                 name="rating"
//                                 starDimension="28px"
//                                 starSpacing="4px"
//                             />
//                             <textarea
//                                 name="feedback"
//                                 className="textarea textarea-bordered w-full"
//                                 placeholder="Write your feedback..."
//                                 rows={4}
//                                 required
//                             ></textarea>

//                             <div className="modal-action">
//                                 <button type="submit" className="btn bg-green-600 text-white">
//                                     Submit
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-outline"
//                                     onClick={() => setFeedbackModal(null)}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </dialog>
//             )}
//         </div>
//     );
// };

// export default StudentAssignments;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';
import { FaBell } from "react-icons/fa";


const MyClassDetails = () => {
    const { id: classId } = useParams();
    const axiosSecure = useAxiosSecure();
    const qc = useQueryClient();

    const [modalOpen, setModalOpen] = useState(false);
    const [viewSubmissionModal, setViewSubmissionModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [prevSubmissionCounts, setPrevSubmissionCounts] = useState({});
    const [readSubmissionIds, setReadSubmissionIds] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    // ✅ Get class info (to use class name)
    const { data: classData = {}, isLoading: classLoading } = useQuery({
        queryKey: ['class-info', classId],
        queryFn: () => axiosSecure.get(`/class/${classId}`).then(res => res.data),
        enabled: !!classId,
    });
    // console.log(classData);
    const { data: summary = {}, isLoading: sumLoading } = useQuery({
        queryKey: ['class-summary', classId],
        queryFn: () => axiosSecure.get(`/classes/${classId}/summary`).then(res => res.data),
        enabled: !!classId,
    });

    const { data: assignments = [], isLoading: asgLoading } = useQuery({
        queryKey: ['class-assignments', classId],
        queryFn: () => axiosSecure.get(`/assignments/${classId}`).then(res => res.data),
        enabled: !!classId,
    });

    const { data: submissions = [], isLoading: subLoading } = useQuery({
        queryKey: ['all-submissions', viewSubmissionModal],
        queryFn: () => axiosSecure.get(`/submissions/by-assignment/${viewSubmissionModal}`).then(res => res.data),
        enabled: !!viewSubmissionModal,
    });
    console.log(submissions);

    const markReviewMutation = useMutation({
        mutationFn: ({ id, marks, review }) =>
            axiosSecure.patch(`/submissions/${id}`, { marks, review }),
        onSuccess: () => {
            qc.invalidateQueries(['all-submissions', viewSubmissionModal]);
            Swal.fire('Success', 'Marked successfully', 'success');
        },
        onError: () => Swal.fire('Error', 'Failed to save marks', 'error'),
    });


    const handleReviewSubmit = (e, id) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const marks = formData.get('marks');
        const review = formData.get('review');
        markReviewMutation.mutate({ id, marks, review });
    };

    const createAsg = useMutation({
        mutationFn: (newAsg) => axiosSecure.post('/assignments', newAsg),
        onSuccess: () => {
            Swal.fire('Success', 'Assignment created!', 'success');
            qc.invalidateQueries(['class-summary', classId]);
            qc.invalidateQueries(['class-assignments', classId]);
            setModalOpen(false);
            reset();
        },
        onError: () => Swal.fire('Error', 'Could not create assignment', 'error'),
    });

    const onSubmit = (data) => {
        createAsg.mutate({
            ...data,
            classId,
            className: classData?.name || '', // ✅ Add className here
        });
    };


    useEffect(() => {
        setPrevSubmissionCounts(prevCounts => {
            const updatedCounts = { ...prevCounts };
            assignments.forEach(asg => {
                if (!(asg._id in updatedCounts)) {
                    updatedCounts[asg._id] = asg.totalSubmissions || 0;
                }
            });
            return updatedCounts;
        });
    }, [assignments]);

    const handleViewSubmission = (id) => {
        setViewSubmissionModal(id);
        setReadSubmissionIds(prev => [...new Set([...prev, id])]); // unique করে রাখা
    };




    if (sumLoading || asgLoading || classLoading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto p-3 py-8 space-y-6">
            <h2 className="text-3xl font-bold text-center">{classData.name} Class Details</h2>

            {/* Progress count*/}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white shadow rounded p-6 text-center">
                    <p className="text-sm text-gray-500">Total Enrollments</p>
                    <p className="text-3xl font-semibold">{summary.enrollments || 0}</p>
                </div>
                <div className="bg-white shadow rounded p-6 text-center">
                    <p className="text-sm text-gray-500">Total Assignments</p>
                    <p className="text-3xl font-semibold">{summary.totalAssignments || 0}</p>
                </div>
                <div className="bg-white shadow rounded p-6 text-center">
                    <p className="text-sm text-gray-500">Total Submissions</p>
                    <p className="text-3xl font-semibold">{summary.totalSubmissions || 0}</p>
                </div>
            </div>

            {/* Assignments */}
            <div className="bg-white shadow rounded p-5 space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Assignments</h3>
                    <button className="btn bg-green-600 text-white" onClick={() => setModalOpen(true)}>+ Create</button>
                </div>

                {assignments.length === 0 ? (
                    <p className="text-center text-gray-500">No assignments yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {assignments.map((item) => {

                            const currentSubmissionCount = item.totalSubmissions || 0;
                            const previousCount = prevSubmissionCounts[item._id] || 0;
                            const newCount = currentSubmissionCount - previousCount;
                            const isUnread = !readSubmissionIds.includes(item._id) && newCount > 0;

                            return (
                                <li key={item._id} className="border border-gray-300 p-4 rounded hover:bg-gray-50">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <p className="text-xs mt-1">
                                        Deadline: {new Date(item.deadline).toLocaleDateString()}
                                    </p>

                                    <div className='flex items-center justify-between'>
                                        <button
                                            className={`btn btn-sm mt-2 relative overflow-hidden flex items-center gap-2 ${isUnread ? 'animate-pulse ring-2 ring-yellow-300 ring-offset-2' : ''
                                                } bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-transform duration-300`}
                                            onClick={() => handleViewSubmission(item._id)}
                                        >
                                            {/* 🔔 Bell icon শুধুমাত্র unread থাকলে */}
                                            {isUnread && (
                                                <FaBell className="text-yellow-300 animate-bounce" />
                                            )}

                                            View Submissions

                                            {/* 🔴 Unread count badge */}
                                            {isUnread && (
                                                <span className="ml-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                                    +{newCount}
                                                </span>
                                            )}
                                        </button>

                                        <div className="ml-1 bg-green-100 text-black text-xs font-semibold p-2 border border-gray-300 rounded">
                                            Total Submission : {currentSubmissionCount ? currentSubmissionCount : 0}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}

                    </ul>
                )}
            </div>

            {/* View Submissions Modal */}
            {viewSubmissionModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">Submitted Assignments</h3>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            className="input input-bordered w-full mb-3 focus:outline-none focus:border-blue-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        />
                        {subLoading ? (
                            <Loading />
                        ) : submissions.length === 0 ? (
                            <p className="text-center text-gray-500">No submissions yet.</p>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {submissions
                                    .filter(sub =>
                                        sub.studentName.toLowerCase().includes(searchTerm) ||
                                        sub.studentEmail.toLowerCase().includes(searchTerm)
                                    )
                                    .map(sub => (
                                        <div key={sub._id} className="border-2 border-gray-300 rounded p-2 bg-gray-50 shadow">
                                            <div className="flex items-center gap-3 mb-2 bg-[#000080] p-2 rounded">
                                                <img src={sub.studentImage} alt="student" className=" w-10 h-10 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-gray-300">{sub.studentName}</p>
                                                    <p className="text-gray-400">{sub.studentEmail}</p>
                                                </div>
                                            </div>
                                            <div className='border border-gray-300 rounded p-2'>
                                                <p className="mb-2 text-gray-700 whitespace-pre-wrap">{sub.submissionText}</p>
                                                {sub.attachmentUrl && (
                                                    <div>
                                                        <a>Link :</a>
                                                        <a href={sub.attachmentUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline ml-1">View Attachment</a>
                                                    </div>
                                                )}
                                            </div>
                                            <form onSubmit={(e) => handleReviewSubmit(e, sub._id)} className="mt-3 space-y-2">
                                                <input
                                                    type="number"
                                                    name="marks"
                                                    required
                                                    defaultValue={sub.marks || ''}
                                                    placeholder="Take Marks"
                                                    className="input input-bordered w-full focus:outline-none focus:border-blue-300"
                                                />
                                                <textarea
                                                    name="review"
                                                    required
                                                    defaultValue={sub.review || ''}
                                                    placeholder="Write feedback..."
                                                    className="textarea textarea-bordered w-full focus:outline-none focus:border-blue-300"
                                                />
                                                <div className='flex justify-end'>
                                                    <button type="submit" className="btn btn-sm  bg-green-600 text-white">Save Review</button>
                                                </div>
                                            </form>
                                        </div>
                                    ))}
                            </div>
                        )}
                        <div className="modal-action">
                            <button className="btn" onClick={() => { setViewSubmissionModal(null); setSearchTerm(''); }}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* Create Assignment Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg mx-3">
                        <h3 className="text-xl font-semibold mb-4">Create Assignment</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input type="text" {...register('title', { required: true })} placeholder="Title" className="input input-bordered w-full" />
                            <input type="date" {...register('deadline', { required: true })} className="input input-bordered w-full" />
                            <textarea {...register('description', { required: true })} rows={3} placeholder="Description" className="textarea textarea-bordered w-full" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="btn btn-sm">Cancel</button>
                                <button type="submit" className="btn btn-sm bg-green-600 text-white">
                                    {createAsg.isPending ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClassDetails;

