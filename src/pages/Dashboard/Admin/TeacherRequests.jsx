import React from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const TeacherRequests = () => {
    const axiosSecure = useAxiosSecure();

    const { data: requests = [], refetch } = useQuery({
        queryKey: ['teacherRequests'],
        queryFn: async () => {
            const res = await axiosSecure.get('/teacherRequests');
            return res.data;
        }
    });

    const handleApprove = async (request) => {
        const res = await axiosSecure.patch(`/teacherRequests/approve/${request._id}`);
        if (res.data.modifiedCount > 0) {
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

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Teacher Requests</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Experience</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req._id}>
                            <td><img src={req.image} alt="profile" className="w-10 h-10 rounded-full" /></td>
                            <td>{req.name}</td>
                            <td>{req.email}</td>
                            <td>{req.experience}</td>
                            <td>{req.title}</td>
                            <td>{req.category}</td>
                            <td className="capitalize">{req.status}</td>
                            <td className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(req)}
                                    className="btn btn-sm btn-success"
                                    disabled={req.status === 'accepted' || req.status === 'rejected'}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(req)}
                                    className="btn btn-sm btn-error"
                                    disabled={req.status === 'accepted' || req.status === 'rejected'}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherRequests;
