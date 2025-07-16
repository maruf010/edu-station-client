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
        <div className="max-w-4xl mx-auto p-3 py-6 space-y-4">
            <h2 className="text-xl md:text-3xl font-bold text-center bg-blue-900 text-white p-2 uppercase">{classData.name} Class Details</h2>

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

                    <div className='h-[50vh] overflow-y-auto space-y-3'>
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
                                        <p className="text-xs mt-1 font-medium">
                                            Deadline: {new Date(item.deadline).toLocaleDateString()}
                                        </p>

                                        <div className='flex items-center justify-between mt-3'>
                                            <button
                                                className={`btn btn-sm relative overflow-hidden flex items-center gap-2 ${isUnread ? 'animate-pulse ring-2 ring-yellow-300 ring-offset-2' : ''
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
                    </div>
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
                            <input type="text" {...register('title', { required: true })} placeholder="Title" className="input input-bordered w-full focus:outline-none focus:border-green-400" />
                            <input type="date" {...register('deadline', { required: true })} className="input input-bordered w-full focus:outline-none focus:border-green-400" />
                            <textarea {...register('description', { required: true })} rows={3} placeholder="Description" className="textarea textarea-bordered w-full focus:outline-none focus:border-green-400" />
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

