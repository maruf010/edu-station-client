import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const MyClasses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: myClasses = [], isLoading, error, refetch } = useQuery({
        queryKey: ['my-classes', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-classes?email=${user.email}`);
            return res.data;
        }
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            const res = await axiosSecure.delete(`/my-classes/${id}`);
            if (res.data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Your class has been deleted.', 'success');
                refetch();
            }
        }
    };

    const handleUpdate = (cls) => {
        setSelectedClass(cls);
        setIsModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedData = {
            name: form.name.value,
            price: parseFloat(form.price.value),
            seats: parseInt(form.seats.value),
        };

        const res = await axiosSecure.patch(`/my-classes/${selectedClass._id}`, updatedData);
        if (res.data.modifiedCount > 0) {
            Swal.fire('Success', 'Class updated successfully!', 'success');
            refetch();
            setIsModalOpen(false);
        }
    };

    if (isLoading) return <p className="text-center py-6">Loading your classes...</p>;
    if (error) return <p className="text-center text-red-500 py-6">Failed to fetch your classes.</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6 text-center">My Classes</h2>

            {myClasses.length === 0 ? (
                <p className="text-center">No classes found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myClasses.map((cls) => (
                        <div
                            key={cls._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg border"
                        >
                            <img
                                src={cls.image}
                                alt={cls.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4 space-y-2">
                                <h3 className="text-xl font-semibold text-gray-800">{cls.name}</h3>
                                <p><span className="font-medium">Price:</span> ${cls.price}</p>
                                <p><span className="font-medium">Seats:</span> {cls.seats}</p>
                                <p><span className="font-medium">Enrolled:</span> {cls.enrolled || 0}</p>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    <span className="capitalize text-sm bg-gray-100 px-2 py-1 rounded">
                                        {cls.status}
                                    </span>
                                </p>
                                <div className="pt-2 flex gap-3">
                                    <button
                                        onClick={() => handleUpdate(cls)}
                                        className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cls._id)}
                                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Update Modal */}
            {isModalOpen && selectedClass && (
                <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-center">Update Class</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Class Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedClass.name}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={selectedClass.price}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Seats</label>
                                <input
                                    type="number"
                                    name="seats"
                                    defaultValue={selectedClass.seats}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClasses;
