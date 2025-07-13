import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Loading from '../../../components/Shared/Loading';

const ActiveTeacher = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const {
        data: teachers = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/teachers');
            return res.data;
        }
    });

    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher =>
            teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, teachers]);

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    const paginatedTeachers = filteredTeachers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handleDeactivate = async (teacher) => {
        Swal.fire({
            title: `Deactivate ${teacher.name}?`,
            text: "This will remove teacher privileges and revert to student.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, deactivate',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/teachers/deactivate/${teacher._id}`);
                    if (res.data.modifiedCount > 0) {
                        Swal.fire('Deactivated!', `${teacher.name} is now a student.`, 'success');
                        refetch();
                    } else {
                        Swal.fire('Error', 'Could not deactivate teacher.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'Something went wrong.', 'error');
                }
            }
        });
    };

    const renderPagination = () => {
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + 2);
        if (end - start < 2 && start > 1) {
            start = Math.max(1, end - 2);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return (
            <>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="h-9 w-9 text-2xl text-gray-600 hover:bg-gray-100 rounded-md"
                    disabled={currentPage === 1}
                >
                    ‹
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 rounded-md text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="h-9 w-9 text-2xl text-gray-600 hover:bg-gray-100 rounded-md"
                    disabled={currentPage === totalPages}
                >
                    ›
                </button>
            </>
        );
    };

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center py-6 text-red-600">Failed to load teachers.</p>;
    if (teachers.length === 0) return <p className="text-center py-6">No active teachers found.</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Active Teachers</h2>

            {/* Search Input */}
            <div className="mb-4 flex justify-center lg:justify-end">
                <input
                    type="text"
                    placeholder="🔍 Search by name or email"
                    className="input input-bordered w-full max-w-xs focus:outline-none"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="overflow-x-auto shadow  rounded-lg">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 border-b border-gray-400">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Experience</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTeachers.map((teacher, idx) => (
                            <tr key={teacher._id} className="border-b border-gray-300 hover:bg-gray-50">
                                <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                <td className="px-4 py-3">{teacher.name || 'N/A'}</td>
                                <td className="px-4 py-3">{teacher.email}</td>
                                <td className="px-4 py-3">{teacher.title}</td>
                                <td className="px-4 py-3">{teacher.category}</td>
                                <td className="px-4 py-3 capitalize">{teacher.experience}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleDeactivate(teacher)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
                    {renderPagination()}
                </div>
            )}
        </div>
    );
};

export default ActiveTeacher;
