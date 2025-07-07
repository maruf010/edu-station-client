import Lottie from 'lottie-react';
import React from 'react';
import animation1 from '../../assets/Animation1.json'; // Adjust the path as necessary
import { Link } from 'react-router';


const Banner1 = () => {
    return (
        <div className="md:flex items-center justify-between bg-gray-100 py-16 px-3 lg:max-w-11/12 lg:mx-auto rounded-2xl">
            <div>
                <h1 className="text-4xl font-bold text-center mb-6">
                    Welcome to Our Learning Platform
                </h1>
                <p className="text-lg text-center mb-8">
                    Empowering your learning journey with innovative tools and resources.
                </p>
                <Link to='/allClasses'>
                    <div class="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group">
                        <span class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-500 group-hover:translate-x-0 ease">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <span class="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease">Our Courses</span>
                        <span class="relative invisible">Our Courses</span>
                    </div>
                </Link>
            </div>
            <div>
                <Lottie
                    animationData={animation1}
                    loop={true}
                    style={{ width: '100%', height: '400px' }}
                />
            </div>
        </div>
    );
};

export default Banner1;