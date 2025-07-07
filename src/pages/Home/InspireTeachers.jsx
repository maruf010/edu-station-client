import { Link } from 'react-router';
import { FaChalkboardTeacher } from 'react-icons/fa';
import teacherLottie from '../../assets/teachers.json'
import Lottie from 'lottie-react';

const InspireTeachers = () => {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-bold text-blue-700 mb-4">
                        Inspire, Educate, and Earn on <span className="text-pink-500">EduStation</span>
                    </h2>
                    <p className="text-gray-700 mb-6 text-lg">
                        Share your expertise with learners worldwide. Whether you're a coding expert, design guru, or marketing wizard, EduStation gives you the tools to teach and inspire.
                    </p>
                    <Link to="/teach" className="flex">
                        <div className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50">
                            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="relative">
                                <span className='flex items-center justify-center'>
                                    <FaChalkboardTeacher className="mr-2" size={25}/>
                                    <h2>Apply to Teach</h2></span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Image */}
                <div className="flex-1">
                    <Lottie animationData={teacherLottie} loop style={{ height: '400px' }} />
                </div>

            </div>
        </section>
    );
};

export default InspireTeachers;
