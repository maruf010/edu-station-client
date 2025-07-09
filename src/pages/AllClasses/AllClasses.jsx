import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';


const AllClasses = () => {
    const axiosInstance = useAxios();

    const { data: approvedClasses = [], isLoading, error } = useQuery({
        queryKey: ['approved-classes'],
        queryFn: async () => {
            const res = await axiosInstance.get('/classes/approved');
            return res.data;
        }
    });

    if (isLoading) return <Loading></Loading>;
    if (error) return <p className="text-red-500 text-center py-6">Failed to load classes.</p>;

    return (
        <div className="max-w-7xl min-h-screen mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Explore Our Classes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedClasses.map(cls => (
                    <div key={cls._id} className="card bg-white rounded-xl shadow-md overflow-hidden border">
                        <figure>
                            <img src={cls.image} alt={cls.name} className="h-56 w-full object-cover" />
                        </figure>
                        <div className="card-body">
                            <h2 className="text-xl font-semibold">{cls.name}</h2>
                            <p className="text-gray-600 mb-1"><strong>Instructor:</strong> {cls.teacherName}</p>
                            <p className="text-gray-600 mb-1"><strong>Seats:</strong> {cls.seats}</p>
                            <p className="text-gray-600 mb-1"><strong>Price:</strong> ${cls.price}</p>
                            <p className="text-gray-600 mb-2"><strong>Enrolled:</strong> {cls.enrolled || 0}</p>

                            <div className="mt-auto">
                                <Link
                                    to={`/classes/approved/${cls._id}`}
                                    className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Enroll Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllClasses;
