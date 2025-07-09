import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';


const AllPayments = () => {
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ['all-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        },
    });

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center text-red-500 py-8">Failed to load all payments.</p>;
    if (payments.length === 0) return <p className="text-center py-8 text-gray-500">No payments found.</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6 text-center">All Payment Records</h2>

            <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-700">#</th>
                            <th className="px-4 py-3 font-medium text-gray-700">User</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Date</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Class</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Teacher</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Price</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Txn ID</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p, index) => (
                            <tr key={p._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{p.userEmail}</td>
                                <td className="px-4 py-3">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{p.className}</td>
                                <td className="px-4 py-3">{p.teacherName}</td>
                                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-xs break-all text-gray-600">{p.transactionId}</td>
                                <td className="px-4 py-3 capitalize">{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllPayments;
