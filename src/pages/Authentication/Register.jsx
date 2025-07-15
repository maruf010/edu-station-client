import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin';
import useAxios from '../../hooks/useAxios';
import { motion } from 'framer-motion';
import { IoArrowBackSharp } from "react-icons/io5";



const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [profilePic, setProfilePic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result);
                toast.success("Registration successful!");
                const userInfo = {
                    email: data.email,
                    role: 'student',
                    displayName: data.displayName || data.name,
                    photoURL: data.photoURL || profilePic,
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                };
                await axiosInstance.post('/users', userInfo);

                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                };
                updateUserProfile(userProfile)
                    .then(() => navigate(from))
                    .catch(error => toast.error(error.message));
            })
            .catch(error => toast.error(error.message));
    };

    const handleImage = async (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;
        const res = await axios.post(imageUploadUrl, formData);
        setProfilePic(res.data.data.url);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0072ff] to-[#00c6ff] px-4">
            <div className="w-full max-w-5xl  bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left Panel */}
                <div className="relative bg-gradient-to-b from-[#0072ff] to-[#00c6ff] text-white p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">WELCOME to EduStation</h2>
                    <p className="text-sm">JOIN OUR COMMUNITY</p>
                    <p className="mt-4 text-xs text-white/80">
                        Create your account to access all features. Connect with others, share knowledge, and grow together.
                    </p>
                    <Link to='/'>
                        <div className='mt-3 gap-3 flex items-center'>
                            <IoArrowBackSharp />
                            <h2 className=''>Back to Homepage</h2>
                        </div>
                    </Link>
                    {/* Circles */}
                    <div className="absolute bottom-[10px] md:bottom-[-30px] left-[-30px] w-28 h-28 bg-blue-500 rounded-full opacity-30"></div>
                    <div className="absolute top-10 lg:top-[-20px] right-[-40px] lg:right-[20px] w-32 h-32 bg-blue-600 rounded-full opacity-20"></div>
                    <div className="absolute bottom-20 left-20 w-20 h-20 bg-white rounded-full opacity-10"></div>
                </div>

                {/* Right Panel - Form */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Create Account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input type="text" {...register('name', { required: true })} className="focus:outline-none w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400" placeholder="Your Name" />
                            {errors.name && <p className="text-sm text-red-500 mt-1 ">Name is required</p>}
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-gray-700">Photo</label>
                            <input type="file" onChange={handleImage} className="w-full mt-1 text-sm border border-gray-300 rounded-md p-2" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input type="email" {...register('email', { required: true })} className="focus:outline-none w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400" placeholder="Your Email" />
                            {errors.email && <p className="text-sm text-red-500 mt-1">Email is required</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700 ">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: true,
                                        minLength: 6,
                                        pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/
                                    })}
                                    className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-1 focus:outline-none focus:ring-blue-400"
                                    placeholder="Your Password"
                                />
                                <motion.span
                                    className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                    whileTap={{ scale: 1.2, rotate: 20 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </motion.span>

                            </div>
                            {errors.password?.type === 'required' && <p className="text-sm text-red-500 mt-1">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-sm text-red-500 mt-1">Password must be 6+ characters</p>}
                            {errors.password?.type === 'pattern' && (
                                <p className="text-sm text-red-500 mt-1">Must include 1 uppercase, 1 number & 1 special character</p>
                            )}
                        </div>

                        <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
                            Register
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline font-medium">Login</Link>
                    </p>

                    <div className="my-2 text-center text-gray-500">or</div>

                    <SocialLogin />
                </div>
            </div>
        </div>
    );
};

export default Register;
