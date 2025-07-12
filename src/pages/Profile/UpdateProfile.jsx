import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const UpdateProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setPhoto(user.photoURL || '');
        }
    }, [user]);

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
            await updateUserProfile({ displayName: name, photoURL: photo });
            toast.success("Profile updated successfully!");
            navigate('/dashboard/profile');
        } catch (err) {
            console.log(err);
            toast.error("Update failed!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-100 flex justify-center items-center px-4 font-des">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md rounded-3xl p-8 shadow-lg space-y-6"
            >
                <h2 className="text-3xl text-center font-bold text-pink-600">Update Profile</h2>

                <div>
                    <label className="block mb-1 text-sm text-pink-600 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm text-pink-600 font-medium">Change Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                    />
                </div>

                {photo && (
                    <div className="flex justify-center mt-2">
                        <img src={photo} alt="Profile Preview" className="w-20 h-20 rounded-full border-4 border-pink-300 shadow" />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-medium transition duration-200"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
