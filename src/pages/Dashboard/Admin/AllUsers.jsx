import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { user: currentUser } = useAuth();
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const { data: users = [], isLoading, error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    useEffect(() => {
        const filtered = users.filter(user =>
            user.displayName?.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [search, users]);

    const handleMakeAdmin = async (user) => {
        const result = await Swal.fire({
            title: `Make ${user.displayName || user.email} an Admin?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/make-admin/${user._id}`);
                if (res.data.modifiedCount > 0) {
                    Swal.fire('Success', 'User promoted to Admin.', 'success');
                    refetch();
                } else {
                    Swal.fire('Error', 'Update failed.', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        }
    };

    const handleRemoveAdmin = async (user) => {
        if (user.email === currentUser?.email) {
            return Swal.fire('Blocked', 'You cannot remove yourself as admin.', 'info');
        }

        const result = await Swal.fire({
            title: `Remove Admin Access from ${user.displayName || user.email}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/remove-admin/${user._id}`);
                if (res.data.modifiedCount > 0) {
                    Swal.fire('Updated!', 'Admin role removed.', 'success');
                    refetch();
                } else {
                    Swal.fire('Error', 'Could not remove admin role.', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        }
    };

    const handleDelete = async (user) => {
        if (user.email === currentUser?.email) {
            return Swal.fire('Blocked', 'You cannot delete yourself.', 'info');
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to remove this user permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/users/${user._id}?email=${user.email}`);
                if (res.data.deletedCount > 0) {
                    toast.success('User has been deleted!');
                    refetch();
                } else {
                    Swal.fire('Error', 'Could not delete user.', 'error');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Something went wrong.', 'error');
            }
        }
    };


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center text-red-500 mt-10">Error loading users.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>

            <div className="flex justify-center md:justify-end mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="input input-bordered w-[50%] md:max-w-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentUsers.map((user, idx) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{indexOfFirstUser + idx + 1}</td>
                                <td className="px-4 py-2">{user.displayName || 'N/A'}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2 capitalize">{user.role || 'user'}</td>
                                <td className="px-4 py-2 flex flex-wrap gap-2">
                                    {/* Make/Remove Admin Buttons */}
                                    {user.role === 'admin' ? (
                                        user.email === currentUser?.email ? (
                                            <button
                                                className="btn btn-sm bg-gray-300 text-gray-600 cursor-not-allowed"
                                                disabled
                                            >
                                                Admin (You)
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRemoveAdmin(user)}
                                                className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                                            >
                                                Remove Admin
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            Make Admin
                                        </button>
                                    )}

                                    {/* Delete Button */}
                                    {user.email === currentUser?.email ? (
                                        <button
                                            className="btn btn-sm bg-gray-300 text-gray-600 cursor-not-allowed"
                                            disabled
                                        >
                                            Cannot Delete
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(user)}
                                            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
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
    );
};

export default AllUsers;
