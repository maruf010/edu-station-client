import React from 'react';
import { Link } from 'react-router';
import { FaRegEdit } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 md:px-6 font-des">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-600 text-center mb-10">User Profile</h2>

            <div className=" mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">

                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    <img
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-gray-400 shadow-md"
                        src={user?.photoURL}
                        alt="Profile"
                    />
                </div>

                {/* Info & Actions */}
                <div className="flex-1 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Name</p>
                            <h3 className="text-xl font-semibold text-gray-600">{user?.displayName}</h3>
                        </div>
                        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg font-medium text-gray-600">{user?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center md:justify-start">
                        <Link to="/dashboard/updateProfile" className="inline-flex items-center gap-2 bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600 transition">
                            <FaRegEdit className="text-lg" />
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
