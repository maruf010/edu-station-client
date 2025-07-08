import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');

    const { data: users = [], isLoading, error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    // Filter and prioritize search results
    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;

        const lowerSearch = search.toLowerCase();

        const matched = [];
        const others = [];

        users.forEach((user) => {
            const name = user.displayName?.toLowerCase() || '';
            const email = user.email.toLowerCase();

            if (name.includes(lowerSearch) || email.includes(lowerSearch)) {
                matched.push(user);
            } else {
                others.push(user);
            }
        });

        return [...matched, ...others];
    }, [users, search]);

    const handleMakeAdmin = async (user) => {
        if (user.role === 'admin') {
            Swal.fire('Info', `${user.displayName || user.email} is already an admin`, 'info');
            return;
        }

        const result = await Swal.fire({
            title: `Make ${user.displayName || user.email} an Admin?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, make admin',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/users/make-admin/${user._id}`);
                if (res.data.modifiedCount > 0) {
                    Swal.fire('Success', 'User is now an admin', 'success');
                    refetch();
                } else {
                    Swal.fire('Error', 'Failed to update role', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Something went wrong', 'error');
            }
        }
    };

    if (isLoading) return <p className="text-center py-6">Loading users...</p>;
    if (error) return <p className="text-center py-6 text-red-600">Failed to load users.</p>;

    return (
        <div className="min-h-screen mx-auto p-4 sm:p-6 bg-white rounded shadow py-5">
            <h2 className="text-2xl font-bold mb-4 text-center">Make Admin</h2>

            <input
                type="text"
                placeholder="Search users by name or email"
                className="input input-bordered w-full mb-4 text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-x-auto">
                <table className="table-auto min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 sm:px-4 py-2 text-left">#</th>
                            <th className="border px-2 sm:px-4 py-2 text-left">Name</th>
                            <th className="border px-2 sm:px-4 py-2 text-left">Email</th>
                            <th className="border px-2 sm:px-4 py-2 text-left">Role</th>
                            <th className="border px-2 sm:px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, idx) => {
                            const isMatched =
                                search &&
                                (user.displayName?.toLowerCase().includes(search.toLowerCase()) ||
                                    user.email.toLowerCase().includes(search.toLowerCase()));

                            return (
                                <tr
                                    key={user._id}
                                    className={`text-center ${isMatched ? 'bg-yellow-100 font-semibold' : ''
                                        }`}
                                >
                                    <td className="border px-2 sm:px-4 py-2">{idx + 1}</td>
                                    <td className="border px-2 sm:px-4 py-2 text-left">{user.displayName || 'N/A'}</td>
                                    <td className="border px-2 sm:px-4 py-2 text-left">{user.email}</td>
                                    <td className="border px-2 sm:px-4 py-2 capitalize">{user.role || 'user'}</td>
                                    <td className="border px-2 sm:px-4 py-2">
                                        {user.role !== 'admin' ? (
                                            <button
                                                onClick={() => handleMakeAdmin(user)}
                                                className="btn btn-sm btn-primary w-full sm:w-auto"
                                            >
                                                Make Admin
                                            </button>
                                        ) : (
                                            <span className="text-green-600 font-semibold">Admin</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MakeAdmin;
