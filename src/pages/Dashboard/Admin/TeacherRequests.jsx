import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';

const TeacherRequests = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const [filteredRequests, setFilteredRequests] = useState([]);

    const { data: requests = [], isLoading, refetch } = useQuery({
        queryKey: ['teacherRequests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/teacherRequests');
            return res.data;
        }
    });

    useEffect(() => {
        const filtered = requests.filter(req =>
            req.name.toLowerCase().includes(search.toLowerCase()) ||
            req.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredRequests(filtered);
        setCurrentPage(1);
    }, [search, requests]);

    const handleApprove = async (request) => {
        const res = await axiosSecure.patch(`/teacherRequests/approve/${request._id}`);
        if (res.data.modifiedCount > 0 || res.data.success) {
            toast.success('Teacher approved');
            refetch();
        }
    };

    const handleReject = async (request) => {
        const res = await axiosSecure.patch(`/teacherRequests/reject/${request._id}`);
        if (res.data.modifiedCount > 0) {
            toast.error('Teacher request rejected');
            refetch();
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const renderPageNumbers = () => {
        const pages = [];

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        return pages.map((page, idx) => (
            <button
                key={idx}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                className={`h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition ${page === currentPage
                        ? 'bg-blue-500 text-white'
                        : typeof page === 'number'
                            ? 'bg-white text-gray-700 hover:bg-gray-100'
                            : 'bg-white text-gray-500 cursor-default'
                    }`}
                disabled={typeof page !== 'number'}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="p-3 min-h-screen">
            <div className="max-w-7xl mx-auto shadow-xl rounded-lg p-3 min-h-[calc(100vh-24px)]">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">📋 Teacher Requests</h2>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="🔍 Search by name or email"
                        className="input input-bordered w-full md:max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Show:</span>
                        <select className="select select-bordered">
                            <option>{itemsPerPage}</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {isLoading ? (
                    <Loading />
                ) : currentItems.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">No teacher requests found.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="table w-full text-sm">
                            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[15px]">
                                <tr>
                                    <th className="p-3">Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Experience</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500">
                                {currentItems.map((req) => (
                                    <tr key={req._id} className="hover:bg-blue-50">
                                        <td className="py-3 px-2">
                                            <img
                                                src={req.image}
                                                alt="profile"
                                                className="w-10 h-10 rounded-full object-cover border border-blue-300"
                                            />
                                        </td>
                                        <td>{req.name}</td>
                                        <td>{req.email}</td>
                                        <td className='capitalize'>{req.experience}</td>
                                        <td>{req.title}</td>
                                        <td>{req.category}</td>
                                        <td>
                                            <span className={`badge px-3 py-1 rounded-full text-white 
                                                ${req.status === 'accepted'
                                                    ? 'bg-green-500'
                                                    : req.status === 'rejected'
                                                        ? 'bg-red-500'
                                                        : 'bg-yellow-400'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    className="btn btn-xs p-3 bg-green-600 text-white hover:bg-green-700"
                                                    disabled={req.status !== 'pending'}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req)}
                                                    className="btn btn-xs p-3 bg-red-600 text-white hover:bg-red-700"
                                                    disabled={req.status !== 'pending'}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Fancy Pagination */}
                {filteredRequests.length > itemsPerPage && (
                    <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                        <button
                            className="h-9 w-9 flex items-center justify-center text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ‹
                        </button>
                        {renderPageNumbers()}
                        <button
                            className="h-9 w-9 flex items-center justify-center text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherRequests;
