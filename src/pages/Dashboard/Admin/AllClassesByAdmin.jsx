import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';

const AllClassesByAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [progressData, setProgressData] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isProgressOpen, setIsProgressOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const classesPerPage = 5;

    const { data: allClasses = [], isLoading, refetch } = useQuery({
        queryKey: ['all-classes-admin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/classes');
            return res.data;
        }
    });

    const filteredClasses = allClasses.filter((cls) =>
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacherEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);
    const totalPages = Math.ceil(filteredClasses.length / classesPerPage);


    const approveMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/admin/approve-class/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.modifiedCount > 0) {
                Swal.fire('Success', 'Class approved!', 'success');
                refetch();
            }
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/admin/reject-class/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.modifiedCount > 0) {
                Swal.fire('Rejected', 'Class rejected successfully!', 'info');
                refetch();
            }
        }
    });

    const handleApprove = (id) => {
        Swal.fire({
            title: 'Approve this class?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve',
            cancelButtonText: 'Cancel'
        }).then(result => {
            if (result.isConfirmed) {
                approveMutation.mutate(id);
            }
        });
    };

    const handleReject = (id) => {
        Swal.fire({
            title: 'Reject this class?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reject',
            cancelButtonText: 'Cancel'
        }).then(result => {
            if (result.isConfirmed) {
                rejectMutation.mutate(id);
            }
        });
    };

    const handleViewProgress = async (cls) => {
        try {
            const res = await axiosSecure.get(`/classes/${cls._id}/summary`);
            setProgressData(res.data);
            setSelectedClass(cls);
            setIsProgressOpen(true);
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'Failed to load progress', 'error');
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">All Submitted Classes</h2>

            {/* Search Input */}
            <div className="flex  justify-center md:justify-end mb-4">
                <input
                    type="text"
                    placeholder="🔍 Search by title or teacher"
                    className="w-full input input-bordered md:max-w-xs focus:outline-none focus:border-blue-300"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg border-2 border-gray-300">
                <table className="table table-zebra w-full">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Teacher Email</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClasses.map((cls, index) => (
                            <tr key={cls._id}>
                                <td>{indexOfFirstClass + index + 1}</td>
                                <td>
                                    <img src={cls.image} alt={cls.name} className="w-16 h-12 rounded object-cover" />
                                </td>
                                <td>{cls.name}</td>
                                <td>{cls.teacherEmail}</td>
                                <td className='flex flex-grow'>{cls.description?.slice(0, 30)}...</td>
                                <td className={`capitalize font-semibold ${cls.status === 'approved' ? 'text-green-600' : cls.status === 'rejected' ? 'text-red-500' : 'text-yellow-600'}`}>
                                    {cls.status}
                                </td>
                                <td className="flex gap-2 items-center">
                                    <button
                                        onClick={() => handleApprove(cls._id)}
                                        className="btn btn-xs bg-green-500 text-white hover:bg-green-600"
                                        disabled={cls.status !== 'pending'}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(cls._id)}
                                        className="btn btn-xs bg-red-500 text-white hover:bg-red-600"
                                        disabled={cls.status !== 'pending'}
                                    >
                                        Reject
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleViewProgress(cls)}
                                        className={`btn btn-sm w-28 ${cls.status === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
                                        disabled={cls.status !== 'approved'}
                                    >
                                        View Progress
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6 mb-4">
                        <button
                            className="btn btn-sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                        <button
                            className="btn btn-sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Progress Modal */}
            {isProgressOpen && selectedClass && progressData && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-xl mb-3">📊 Class Progress</h3>
                        <p><strong>Class:</strong> {selectedClass.name}</p>
                        <p><strong>Teacher:</strong> {selectedClass.teacherName}</p>

                        <div className="mt-4 space-y-2 text-gray-700 border border-gray-300 p-2 rounded">
                            <p>🧑‍🎓 Enrollments: <strong>{progressData.enrollments}</strong></p>
                            <p>📄 Assignments Created: <strong>{progressData.totalAssignments}</strong></p>
                            <p>📬 Total Submissions: <strong>{progressData.totalSubmissions}</strong></p>
                        </div>

                        <div className="modal-action">
                            <button onClick={() => setIsProgressOpen(false)} className="btn text-white btn-sm bg-red-500">
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AllClassesByAdmin;
