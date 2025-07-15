import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Loading from '../../../components/Shared/Loading';

const MyClasses = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const {
        data: myClasses = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['my-classes', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-classes?email=${user.email}`);
            return res.data;
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
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
        reset(); // Clear form
        setIsModalOpen(true);
    };

    const onUpdateSubmit = async (data) => {
        try {
            setUploading(true);
            let imageUrl = selectedClass.image;

            // If new image selected, upload
            if (data.image?.[0]) {
                const formData = new FormData();
                formData.append('image', data.image[0]);

                const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;
                const imgRes = await axios.post(uploadUrl, formData);

                if (imgRes.data.success) {
                    imageUrl = imgRes.data.data.url;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            const updatedData = {
                name: data.name,
                image: imageUrl,
                description: data.description,
                price: parseFloat(data.price),
                seats: parseInt(data.seats),
            };

            const res = await axiosSecure.patch(`/my-classes/${selectedClass._id}`, updatedData);
            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', 'Class updated successfully!', 'success');
                refetch();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update class', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSeeDetails = (id) => {
        navigate(`/dashboard/my-class/${id}`);
    };

    if (isLoading) return <Loading />;
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
                            className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg border border-gray-300"
                        >
                            <img
                                src={cls.image}
                                alt={cls.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4 space-y-2">
                                <h3 className="text-xl font-semibold text-gray-800">{cls.name}</h3>
                                <p><span className="font-medium">Description:</span> {cls.description}</p>
                                <p><span className="font-medium">Teacher:</span> {cls.teacherName}</p>
                                <p><span className="font-medium">Email:</span> {cls.teacherEmail}</p>
                                <div className='flex justify-between items-center'>
                                    <p><span className="font-medium">Price:</span> ${cls.price}</p>
                                    <p><span className="font-medium">Seats:</span> {cls.seats}</p>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <p><span className="font-medium">Enrolled:</span> {cls.enrolled || 0}</p>
                                    <p>
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className="capitalize text-sm bg-green-100 px-2 py-1 rounded">
                                            {cls.status}
                                        </span>
                                    </p>
                                </div>
                                <div className="pt-2 flex justify-between gap-3">
                                    <div>
                                        <button
                                            onClick={() => handleUpdate(cls)}
                                            className="btn mr-2 btn-sm bg-blue-500 text-white hover:bg-blue-600"
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
                                    <button
                                        onClick={() => handleSeeDetails(cls._id)}
                                        className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                                        disabled={cls.status !== 'approved'}
                                    >
                                        See Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Update Modal */}
            {isModalOpen && selectedClass && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white mx-2 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h2 className="text-xl font-semibold mb-4 text-center">Update Class</h2>

                        <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
                            <div>
                                <label className="label">Class Name</label>
                                <input
                                    type="text"
                                    {...register('name', { required: true })}
                                    defaultValue={selectedClass.name}
                                    className="input input-bordered w-full focus:outline-none focus:border-green-400"
                                />
                                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                            </div>
                            <div>
                                <label className="label">Class Image (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('image')}
                                    className="file-input file-input-bordered w-full focus:outline-none focus:border-green-400"
                                />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <input
                                    type="text"
                                    {...register('description', { required: true })}
                                    defaultValue={selectedClass.description}
                                    className="input input-bordered w-full focus:outline-none focus:border-green-400"
                                />
                                {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
                            </div>
                            <div>
                                <label className="label">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { required: true })}
                                    defaultValue={selectedClass.price}
                                    className="input input-bordered w-full focus:outline-none focus:border-green-400"
                                />
                                {errors.price && <p className="text-red-500 text-sm">Price is required</p>}
                            </div>
                            <div>
                                <label className="label">Seats</label>
                                <input
                                    type="number"
                                    {...register('seats', { required: true })}
                                    defaultValue={selectedClass.seats}
                                    className="input input-bordered w-full focus:outline-none focus:border-green-400"
                                />
                                {errors.seats && <p className="text-red-500 text-sm">Seats are required</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="btn btn-sm bg-green-500 text-white hover:bg-green-600"
                                >
                                    {uploading ? 'Updating...' : 'Save'}
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
