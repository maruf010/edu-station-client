import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';


const ActiveTeacher = () => {
    const axiosSecure = useAxiosSecure();

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
                    // Call backend to update role & remove from teachers collection
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

    if (isLoading) return <p className="text-center py-6">Loading teachers...</p>;
    if (error) return <p className="text-center py-6 text-red-600">Failed to load teachers.</p>;

    if (teachers.length === 0) return <p className="text-center py-6">No active teachers found.</p>;

    return (
        <div className="overflow-x-auto max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Active Teachers</h2>
            <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-3 border-b border-gray-300">#</th>
                        <th className="text-left p-3 border-b border-gray-300">Name</th>
                        <th className="text-left p-3 border-b border-gray-300">Email</th>
                        <th className="text-left p-3 border-b border-gray-300">Title</th>
                        <th className="text-left p-3 border-b border-gray-300">Category</th>
                        <th className="text-left p-3 border-b border-gray-300">Experience</th>
                        <th className="text-left p-3 border-b border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher, idx) => (
                        <tr key={teacher._id} className="hover:bg-gray-50">
                            <td className="p-3 border-b border-gray-300">{idx + 1}</td>
                            <td className="p-3 border-b border-gray-300">{teacher.name || 'N/A'}</td>
                            <td className="p-3 border-b border-gray-300">{teacher.email}</td>
                            <td className="p-3 border-b border-gray-300">{teacher.title}</td>
                            <td className="p-3 border-b border-gray-300">{teacher.category}</td>
                            <td className="p-3 border-b border-gray-300 capitalize">{teacher.experience}</td>
                            <td className="p-3 border-b border-gray-300">
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
    );
};

export default ActiveTeacher;
