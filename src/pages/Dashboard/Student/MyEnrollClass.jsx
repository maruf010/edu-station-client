import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';
import { Link } from 'react-router';

const MyEnrollClass = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 3;

    const { data: enrolled = [], isLoading } = useQuery({
        queryKey: ['enrollments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/enrollments?email=${user.email}`);
            return res.data;
        }
    });
    console.log(enrolled);
    // Pagination logic
    const indexOfLast = currentPage * classesPerPage;
    const currentClasses = enrolled.slice(indexOfLast - classesPerPage, indexOfLast);
    const totalPages = Math.ceil(enrolled.length / classesPerPage);

    if (isLoading) return <Loading />;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">My Enrolled Classes</h2>

            {enrolled.length === 0 ? (
                <p className="text-center">You haven’t enrolled in any classes yet.</p>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentClasses.map((enroll) => (
                            <div key={enroll._id} className="p-4 border border-gray-300 rounded-lg bg-white shadow">
                                <img src={enroll.classImage} alt={enroll.className} className="w-full h-40 object-cover rounded mb-3" />
                                <h3 className="text-xl font-semibold mb-1">{enroll.className}</h3>
                                <p><strong>Teacher:</strong> {enroll.teacherName}</p>
                                <p><strong>Email:</strong> {enroll.teacherEmail}</p>

                                <div className='text-end mt-3'>
                                    <Link to={`/dashboard/assignments/${enroll.classId}`}>
                                        <button className="btn bg-green-600 text-white hover:bg-green-700">
                                            Continue                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-4 items-center">
                            <button
                                className="btn btn-sm bg-gray-200 hover:bg-gray-300"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn btn-sm bg-gray-200 hover:bg-gray-300"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyEnrollClass;
