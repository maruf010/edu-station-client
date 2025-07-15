import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const AllPayments = () => {
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchEmail, setSearchEmail] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all');
    const itemsPerPage = 5;

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

    const renderPagination = () => {
        let startPage = Math.max(currentPage - 1, 1);
        let endPage = Math.min(startPage + 2, totalPages);

        if (endPage - startPage < 2 && startPage > 1) {
            startPage = Math.max(endPage - 2, 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                    className="h-9 w-9 text-2xl flex items-center justify-center text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50">
                    ‹
                </button>
                {pages.map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition ${currentPage === page ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                        {page}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                    className="h-9 w-9 text-2xl flex items-center justify-center text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-50">
                    ›
                </button>
            </>
        );
    };

    // ✅ Download filtered data as PDF
    const downloadPDF = (data, fileName) => {
        const doc = new jsPDF();
        doc.text(fileName, 14, 16);

        autoTable(doc, {
            startY: 22,
            head: [['#', 'User', 'Date', 'Class', 'Teacher', 'Price ($)', 'Txn ID', 'Status']],
            body: data.map((p, index) => [
                index + 1,
                p.userEmail,
                new Date(p.date).toLocaleDateString(),
                p.className,
                p.teacherName,
                p.price.toFixed(2),
                p.transactionId,
                p.status,
            ]),
            styles: { fontSize: 8 },
        });

        doc.save(`${fileName}.pdf`);
    };

    const downloadFiltered = () => {
        downloadPDF(filteredPayments, 'Filtered_Payments');
    };

    const downloadByUser = () => {
        const userEmail = searchEmail || 'user';
        const userPayments = payments.filter(p => p.userEmail.toLowerCase().includes(userEmail.toLowerCase()));
        if (userPayments.length === 0) return toast.error("No payments found for this email");
        downloadPDF(userPayments, `Payments_by_${userEmail}`);
    };

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center text-red-500 py-8">Failed to load all payments.</p>;
    if (payments.length === 0) return <p className="text-center py-8 text-gray-500">No payments found.</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6 text-center">All Payment Records</h2>

            {/* Filters & Buttons */}
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
                <select className="select select-bordered" value={yearFilter} onChange={(e) => {
                    setYearFilter(e.target.value); setCurrentPage(1);
                }}>
                    <option value="all">All Years</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <select className="select select-bordered" value={monthFilter} onChange={(e) => {
                    setMonthFilter(e.target.value); setCurrentPage(1);
                }}>
                    <option value="all">All Months</option>
                    {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                </select>

                {/* 📄 PDF Buttons */}
                <div className="flex gap-2">
                    <button className="btn btn-sm bg-blue-600 text-white" onClick={downloadFiltered}>
                        Download Filtered
                    </button>
                    <button className="btn btn-sm bg-green-600 text-white" onClick={downloadByUser}>
                        Download By Email
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 border-b border-gray-400">
                        <tr>
                            <th className="px-4 py-3 font-bold text-gray-700">#</th>
                            <th className="px-4 py-3 font-bold text-gray-700">User</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Date</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Class</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Teacher</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Price</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Txn ID</th>
                            <th className="px-4 py-3 font-bold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPayments.map((p, index) => (
                            <tr key={p._id} className="border-b border-gray-400 hover:bg-gray-100">
                                <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-3">{p.userEmail}</td>
                                <td className="px-4 py-3">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{p.className}</td>
                                <td className="px-4 py-3">{p.teacherName}</td>
                                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-xs break-all text-gray-600">{p.transactionId}</td>
                                <td className="px-4 py-3 text-green-600 capitalize">{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="cursor-pointer mt-8 flex justify-center items-center gap-2 flex-wrap">
                    {renderPagination()}
                </div>
            )}
        </div>
    );
};

export default AllPayments;
