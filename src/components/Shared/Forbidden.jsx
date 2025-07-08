import React from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 text-center">
            <div className="text-6xl text-red-600 animate-pulse mb-4">
                <FaLock />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-800 mb-2">403 - Forbidden</h1>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
                You do not have permission to access this page. Please contact an admin or go back.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition duration-300"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default Forbidden;
