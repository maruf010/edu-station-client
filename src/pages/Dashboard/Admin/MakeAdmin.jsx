import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv';
import Loading from '../../../components/Shared/Loading';

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: users = [], isLoading, error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const filteredUsers = useMemo(() => {
        let filtered = users;

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => (user.role || 'student') === roleFilter);
        }

        if (search.trim()) {
            const term = search.toLowerCase();
            filtered = filtered.filter(
                (u) =>
                    u.displayName?.toLowerCase().includes(term) ||
                    u.email.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [users, search, roleFilter]);

    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleMakeAdmin = async (user) => {
        if (user.role === 'admin') {
            Swal.fire('Info', `${user.displayName || user.email} is already an admin`, 'info');
            return;
        }

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

    const csvHeaders = [
        { label: 'Name', key: 'displayName' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
    ];

    const renderCompactPagination = () => {
        let startPage = Math.max(currentPage - 1, 1);
        let endPage = Math.min(startPage + 2, pageCount);

        if (endPage - startPage < 2 && startPage > 1) {
            startPage = Math.max(endPage - 2, 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="h-9 w-9 text-2xl flex items-center justify-center text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    ‹
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition ${currentPage === page
                            ? 'bg-blue-800 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    className="h-9 w-9 cursor-pointer text-2xl flex items-center justify-center text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={currentPage === pageCount}
                >
                    ›
                </button>
            </>
        );
    };

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center py-6 text-red-600">Failed to load users.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">Make Admin</h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search by name or email"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="input input-bordered w-full sm:w-1/2"
                />

                <select
                    className="select select-bordered w-full sm:w-48"
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>

                <CSVLink
                    data={filteredUsers}
                    headers={csvHeaders}
                    filename="users.csv"
                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                >
                    📤 Export CSV
                </CSVLink>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full text-sm md:text-base">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedUsers.map((user, idx) => (
                            <tr key={user._id}>
                                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                <td className="px-4 py-2">{user.displayName || 'N/A'}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2 capitalize">{user.role || 'student'}</td>
                                <td className="px-4 py-2">
                                    {user.role !== 'admin' ? (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            Make Admin
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRemoveAdmin(user)}
                                            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Remove Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Compact Pagination */}
            {pageCount > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                    {renderCompactPagination()}
                </div>
            )}
        </div>
    );
};

export default MakeAdmin;
