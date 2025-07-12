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

    return (
        <div className="p-3 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
            <div className="max-w-7xl min-h-screen mx-auto bg-white shadow-xl rounded-lg p-3">
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
                            <tbody className="text-gray-700">
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
                                        <td>{req.experience}</td>
                                        <td>{req.title}</td>
                                        <td>{req.category}</td>
                                        <td>
                                            <span className={`badge px-3 py-1 rounded-full text-white 
                          ${req.status === 'accepted'
                                                    ? 'bg-green-500'
                                                    : req.status === 'rejected'
                                                        ? 'bg-red-500'
                                                        : 'bg-yellow-500'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    className="btn btn-xs bg-green-500 text-white hover:bg-green-600"
                                                    disabled={req.status !== 'pending'}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req)}
                                                    className="btn btn-xs bg-red-500 text-white hover:bg-red-600"
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

                {/* Pagination */}
                {filteredRequests.length > itemsPerPage && (
                    <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`btn btn-sm rounded-md px-4 ${page === currentPage
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherRequests;
