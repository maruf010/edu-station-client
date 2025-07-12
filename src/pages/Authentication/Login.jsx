import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import SocialLogin from './SocialLogin';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { IoArrowBackSharp } from "react-icons/io5";


const Login = () => {
    const { signIn } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false); // Toggle state
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const onSubmit = data => {
        signIn(data.email, data.password)
            .then(res => {
                console.log(res);
                navigate(from);
                toast.success("Login successful!");
            })
            .catch(error => {
                console.log(error);
                toast.error("Login failed!");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0072ff] to-[#06c9ff] px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left Side - Welcome */}
                <div className="relative bg-gradient-to-b from-[#0072ff] to-[#00c6ff] text-white p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-2">WELCOME</h2>
                    <p className="text-xl">EduStation</p>
                    <p className="mt-4 text-xs text-white/80">
                        Sign your account to access all features. Connect with others, share knowledge, and grow together.
                    </p>
                    <Link to='/'>
                        <div className='mt-5 gap-3 flex items-center'>
                            <IoArrowBackSharp />
                            <h2 className=''>Back to Homepage</h2>
                        </div>
                    </Link>

                    {/* Floating Circles */}
                    <div className="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-blue-800 rounded-full opacity-30"></div>
                    <div className="absolute top-10 right-[-40px] w-32 h-32 bg-blue-600 rounded-full opacity-20"></div>
                    <div className="absolute bottom-20 left-20 w-20 h-20 bg-white rounded-full opacity-10"></div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign in</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                placeholder="Your Email"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">Email is required</p>}
                        </div>

                        {/* Password with Toggle */}
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register("password", { required: true })}
                                    placeholder="Your Password"
                                    className="w-full mt-1 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                            {errors.password && <p className="text-sm text-red-500 mt-1">Password is required</p>}
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end items-center text-sm">
                            <Link to="/forget-password" className="text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-800 transition duration-300">
                            Sign in
                        </button>
                    </form>

                    <div className="mt-4 text-center text-gray-500">or</div>

                    <SocialLogin />

                    <p className="text-sm text-center text-gray-600 mt-4">
                        Don’t have an account?{' '}
                        <Link state={{ from }} to="/register" className="text-blue-500 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
