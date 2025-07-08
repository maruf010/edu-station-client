import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddClass = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [uploading, setUploading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setUploading(true);

            // Image Upload
            const image = data.image[0];
            const formData = new FormData();
            formData.append('image', image);

            const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;
            const imgRes = await axios.post(uploadUrl, formData);

            if (imgRes.data.success) {
                const imageUrl = imgRes.data.data.url;

                const classData = {
                    name: data.name,
                    image: imageUrl,
                    price: parseFloat(data.price),
                    seats: parseInt(data.seats),
                    description: data.description,
                    teacherEmail: user?.email,
                    teacherName: user?.displayName,
                    teacherImage: user?.photoURL,
                    status: 'pending',
                    enrolled: 0,
                    createdAt: new Date().toISOString()
                };

                const res = await axiosSecure.post('/classes', classData);
                if (res.data.insertedId) {
                    toast.success('Class added successfully!');
                    reset();
                }
            }

        } catch (error) {
            console.error(error);
            toast.error('Failed to add class');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Class</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Class Name */}
                <div>
                    <label className="label">Class Name</label>
                    <input
                        type="text"
                        {...register('name', { required: true })}
                        className="input input-bordered w-full"
                        placeholder="e.g. Advanced React"
                    />
                    {errors.name && <p className="text-red-500 text-sm">Class name is required</p>}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="label">Class Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image', { required: true })}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.image && <p className="text-red-500 text-sm">Image is required</p>}
                </div>

                {/* Seats */}
                <div>
                    <label className="label">Available Seats</label>
                    <input
                        type="number"
                        {...register('seats', { required: true, min: 1 })}
                        className="input input-bordered w-full"
                        placeholder="Number of seats"
                    />
                    {errors.seats && <p className="text-red-500 text-sm">Seats must be at least 1</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="label">Price (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price', { required: true })}
                        className="input input-bordered w-full"
                        placeholder="e.g. 49.99"
                    />
                    {errors.price && <p className="text-red-500 text-sm">Price is required</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="label">Description</label>
                    <textarea
                        {...register('description')}
                        className="textarea textarea-bordered w-full"
                        placeholder="Write a short description"
                    ></textarea>
                </div>

                <button type="submit" disabled={uploading} className="btn btn-block bg-pink-500 text-white">
                    {uploading ? 'Uploading...' : 'Add Class'}
                </button>
            </form>
        </div>
    );
};

export default AddClass;
