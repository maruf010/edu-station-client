import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading, error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to remove this user permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/users/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire('Deleted!', 'User has been removed.', 'success');
                        refetch(); // Refresh user list
                    } else {
                        Swal.fire('Error', 'Could not delete user.', 'error');
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error', 'Something went wrong.', 'error');
                }
            }
        });
    };

    if (isLoading) return <p className="text-center mt-10">Loading users...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error loading users.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">#</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Role</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user, idx) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">{user.displayName || 'N/A'}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2 capitalize">{user.role || 'user'}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;
