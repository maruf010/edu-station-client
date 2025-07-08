import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';

const ClassDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();

    const { data: classData, isLoading, error } = useQuery({
        queryKey: ['class-details', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/classes/approved/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading></Loading>;
    if (error || !classData) return <p className="text-center text-red-500 py-8">Failed to load class details.</p>;

    return (
        <div className="max-w-7xl min-h-screen flex justify-center items-center  mx-auto p-6">
            <div className=" lg:flex  bg-white shadow-xl">
                <div>
                    <img src={classData.image} alt={classData.name} className="w-full h-[350px] object-cover" />
                </div>
                <div className="lg:ml-16 p-8 lg:p-0">
                    <h2 className="text-3xl font-bold mb-2">{classData.name}</h2>
                    <div className="flex gap-4 items-center mt-4 sm:mt-0">
                        <img src={classData.teacherImage} alt="Teacher" className="w-16 h-16 rounded-full" />
                        <div>
                            <p><strong>{classData.teacherName}</strong></p>
                            <p className="text-sm text-gray-600">{classData.teacherEmail}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-4">{classData.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p><strong>Category:</strong> {classData.category}</p>
                            <p><strong>Price:</strong> ${classData.price}</p>
                            <p><strong>Available Seats:</strong> {classData.seats}</p>
                            <p><strong>Enrolled:</strong> {classData.enrolled || 0}</p>
                        </div>
                    </div>

                    {/* Action buttons (future use) */}
                    <div className="flex gap-4">
                        <button className="btn bg-blue-600 text-white hover:bg-blue-700">Pay Now</button>
                        <button className="btn bg-gray-300 text-black hover:bg-gray-400">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetails;
