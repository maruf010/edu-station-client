import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UpdateProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setPhoto(user.photoURL || '');

            // fetch phone/address from DB
            const fetchUserData = async () => {
                try {
                    const res = await axiosSecure.get(`/users/${user.email}`);
                    setPhone(res.data.phone || '');
                    setAddress(res.data.address || '');
                } catch (error) {
                    console.log(error);
                }
            };
            fetchUserData();
        }
    }, [user, axiosSecure]);

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;

        try {
            setLoading(true);
            const res = await axios.post(imageUploadUrl, formData);
            const imageUrl = res.data.data.url;
            setPhoto(imageUrl);
            toast.success("Image uploaded!");
        } catch (error) {
            console.log(error);
            toast.error("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1️⃣ Update Firebase profile (name & photo)
            await updateUserProfile({ displayName: name, photoURL: photo });

            // 2️⃣ Update MongoDB user (phone & address & also sync name/photo)
            await axiosSecure.put(`/users/${user.email}`, {
                displayName: name,
                photoURL: photo,
                phone,
                address,
            });

            toast.success("Profile updated successfully!");
            navigate('/dashboard/profile');
        } catch (err) {
            console.log(err);
            toast.error("Update failed!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 flex justify-center items-center px-4 font-des">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md rounded-3xl p-8 shadow-lg space-y-6"
            >
                <h2 className="text-3xl text-center font-bold text-gray-600">Update Profile</h2>

                {/* Name */}
                <div>
                    <label className="block mb-1 text-sm text-gray-600 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block mb-1 text-sm text-gray-600 font-medium">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter your phone number"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block mb-1 text-sm text-gray-600 font-medium">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter your address"
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block mb-2 text-sm text-gray-600 font-medium">Change Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className=" w-full text-sm file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-gray-500 file:text-white hover:file:bg-gray-600"
                    />
                </div>

                {photo && (
                    <div className="flex justify-center mt-2">
                        <img src={photo} alt="Profile Preview" className="w-20 h-20 rounded-full border-4 border-gray-300 shadow" />
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full py-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-medium transition duration-200"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
