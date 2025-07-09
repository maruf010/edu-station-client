import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Shared/Loading';


const PaymentsHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center py-8">Failed to load payment history.</p>;
    if (payments.length === 0) return <p className="text-gray-500 text-center py-8">No payment records found.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-semibold text-center mb-6">My Payment History</h2>

            <div className="overflow-x-auto shadow border rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Class</th>
                            <th className="px-4 py-3">Teacher</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Transaction ID</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{payment.className}</td>
                                <td className="px-4 py-3">{payment.teacherName}</td>
                                <td className="px-4 py-3">${payment.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-xs text-gray-500 break-all">{payment.transactionId}</td>
                                <td className="px-4 py-3 capitalize">{payment.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsHistory;
