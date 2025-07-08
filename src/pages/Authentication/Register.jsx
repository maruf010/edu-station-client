import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router'; // Make sure it's 'react-router-dom'
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin';
import useAxios from '../../hooks/useAxios';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [profilePic, setProfilePic] = useState();
    const [showPassword, setShowPassword] = useState(false); // Password toggle
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);
                toast.success("Registration successful!");

                const userInfo = {
                    email: data.email,
                    role: 'student',
                    displayName: data.displayName || data.name,
                    photoURL: data.photoURL || profilePic,
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                };
                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);


                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                };
                updateUserProfile(userProfile)
                    .then(() => {
                        navigate(from);
                        // toast.success('Profile Updated!');
                    }).catch(error => {
                        toast.error(error.message);
                    });

            })
            .catch(error => {
                toast.error(error.message);
            });
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
        <div className="card bg-base-100 w-full md:max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        {/* Name */}
                        <label className="label">Name</label>
                        <input type="text" {...register('name', { required: true })} className="input input-bordered w-full" placeholder="Name" />
                        {errors.name?.type === 'required' && <p className='text-red-500'>Name is required</p>}

                        {/* Profile Photo */}
                        <label className="label">Photo</label>
                        <input type="file" onChange={handleImage} className="file-input file-input-bordered w-full" />

                        {/* Email */}
                        <label className="label">Email</label>
                        <input type="email" {...register('email', { required: true })} className="input input-bordered w-full" placeholder="Email" />
                        {errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>}

                        {/* Password with Toggle */}
                        <label className="label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: true,
                                    minLength: 6,
                                    pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/
                                })}
                                className="input input-bordered w-full pr-10"
                                placeholder="Password"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-xl text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </span>
                        </div>

                        {/* Password Errors */}
                        {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>}
                        {errors.password?.type === 'pattern' && <p className='text-red-500'>Password must contain at least one uppercase letter, one special character, and one number</p>}

                        {/* Submit Button */}
                        <button className="btn text-white bg-pink-500 mt-4 w-full">Register</button>
                    </fieldset>
                </form>

                <p className="mt-3 text-sm text-center">
                    Already have an account? <Link to='/login' className='text-blue-500'>Login</Link>
                </p>

                <div className="divider">or</div>
                <SocialLogin />
            </div>
        </div>
    );
};

export default Register;
