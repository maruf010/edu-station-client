import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; 
import toast from 'react-hot-toast';
import axios from 'axios';
import Loading from '../../components/Shared/Loading';
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
            toast.error("Failed to upload image");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile({ displayName: name, photoURL: photo });
            <Loading></Loading>
            toast.success('Profile updated!');
            navigate('/profile');
        } catch (err) {
            toast.error('Failed to update profile', err);
        }
    };

    
    return (
        <div className='min-h-screen flex justify-center items-center'>
            <form
                onSubmit={handleSubmit}
                className="shadow-[0px_0px_20px_0px_rgba(156,39,176,0.3),0px_0px_40px_0px_rgba(156,39,176,0.1)] p-6 rounded-xl w-80 space-y-4"
            >
                <label className="label">Edit Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Display Name"
                    className="border border-pink-500 p-2 rounded w-full"
                />

                {/* Image File Input */}
                <label className="label mt-1">Edit Profile Photo:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full"
                />
                {photo && (
                    <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover mt-2" />
                )}

                <button
                    type="submit"
                    className="cursor-pointer bg-pink-500 text-white w-full py-2 rounded hover:bg-pink-600 mt-1"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
