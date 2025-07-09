import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';

const AllPayments = () => {
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchEmail, setSearchEmail] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all');
    const itemsPerPage = 3;

    const { data: payments = [], isLoading, error } = useQuery({
        queryKey: ['all-payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        },
    });

    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchEmail = searchEmail === '' || payment.userEmail.toLowerCase().includes(searchEmail.toLowerCase());

            const paymentDate = new Date(payment.date);
            const matchYear = yearFilter === 'all' || paymentDate.getFullYear().toString() === yearFilter;
            const matchMonth = monthFilter === 'all' || (paymentDate.getMonth() + 1).toString().padStart(2, '0') === monthFilter;

            return matchEmail && matchYear && matchMonth;
        });
    }, [payments, searchEmail, yearFilter, monthFilter]);

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center text-red-500 py-8">Failed to load all payments.</p>;
    if (payments.length === 0) return <p className="text-center py-8 text-gray-500">No payments found.</p>;

    const years = Array.from(new Set(payments.map(p => new Date(p.date).getFullYear().toString())));
    const months = [
        { value: '01', name: 'January' },
        { value: '02', name: 'February' },
        { value: '03', name: 'March' },
        { value: '04', name: 'April' },
        { value: '05', name: 'May' },
        { value: '06', name: 'June' },
        { value: '07', name: 'July' },
        { value: '08', name: 'August' },
        { value: '09', name: 'September' },
        { value: '10', name: 'October' },
        { value: '11', name: 'November' },
        { value: '12', name: 'December' },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6 text-center">All Payment Records</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                <input
                    type="text"
                    placeholder="Search by user email"
                    value={searchEmail}
                    onChange={(e) => {
                        setSearchEmail(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="input input-bordered w-full max-w-xs"
                />

                <select
                    className="select select-bordered"
                    value={yearFilter}
                    onChange={(e) => {
                        setYearFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All Years</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select
                    className="select select-bordered"
                    value={monthFilter}
                    onChange={(e) => {
                        setMonthFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All Months</option>
                    {months.map(month => (
                        <option key={month.value} value={month.value}>{month.name}</option>
                    ))}
                </select>
            </div>

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
                        {paginatedPayments.map((p, index) => (
                            <tr key={p._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
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

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllPayments;
