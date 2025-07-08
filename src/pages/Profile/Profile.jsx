import React, { useContext } from 'react';
import { Link } from 'react-router';
import { FaRegEdit } from "react-icons/fa";
import { AuthContext } from '../../contexts/AuthContext';

// import { Helmet } from 'react-helmet-async';


const Profile = () => {
    const { user } = useContext(AuthContext);
    // console.log(user);


    return (
        <>
            {/* <Helmet>
                <title>Profile</title>
            </Helmet> */}
            <div className='font-des min-h-screen  bg-orange-100 py-10 px-3 md:px-0'>
                <h2 className='text-3xl font-bold text-orange-500 text-center mb-5 md:mb-16 mt-10'>User Profile</h2>
                <div className='flex justify-center'>
                    <div className='md:flex justify-evenly items-center  '>
                        <div className='flex justify-center md:mr-5'>
                            <img className='md:w-52 rounded-3xl ' src={user?.photoURL} alt="" />
                        </div>
                        <div className='mt-10 md:mt-0 text-orange-400'>
                            <h2 className='text-lg border border-orange-500 bg-white p-4 rounded-3xl mb-5'>
                                Profile Name :
                                <p className='text-xl font-medium text-orange-600 '>{user?.displayName}</p>
                            </h2>
                            <h4 className='text-lg border border-orange-500 bg-white p-4 rounded-3xl'>
                                E-mail :
                                <p className='text-orange-600 font-medium'>{user?.email}</p>
                            </h4>
                        </div>
                        <Link to="/updateProfile">
                            <div className='mt-3 md:mt-0 flex justify-center items-center gap-2 border border-orange-500 px-3 py-2 rounded-xl lg:ml-10 bg-white'>
                                <span className='text-orange-600 '>Edit Profile</span>
                                <span className='text-orange-500'><FaRegEdit /></span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;