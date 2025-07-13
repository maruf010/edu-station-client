import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';
import { IoPersonAdd } from "react-icons/io5";
import { MdEventAvailable, MdDescription } from "react-icons/md";
import { IoIosPricetags } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";



const AllClasses = () => {
    const axiosInstance = useAxios();
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [search, setSearch] = useState('');
    const [priceRange, setPriceRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 3;

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);


    const { data: approvedClasses = [], isLoading, error } = useQuery({
        queryKey: ['approvedClasses'],
        queryFn: async () => {
            const res = await axiosInstance.get('/classes/approved');
            return res.data;
        }
    });

    // Filtering logic
    useEffect(() => {
        let filtered = approvedClasses;

        // Search by name
        if (search) {
            filtered = filtered.filter(cls =>
                cls.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by price range
        if (priceRange !== 'all') {
            filtered = filtered.filter(cls => {
                const price = parseFloat(cls.price);
                if (priceRange === 'low') return price <= 50;
                if (priceRange === 'medium') return price > 50 && price <= 100;
                if (priceRange === 'high') return price > 100;
                return true;
            });
        }

        setFilteredClasses(filtered);
        setCurrentPage(1); // reset to first page on filter change
    }, [approvedClasses, search, priceRange]);

    // Pagination logic
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);
    const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

    console.log(currentClasses);


    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center py-6">Failed to load classes.</p>;

    return (
        <div className='bg-gray-300 overflow-hidden'>
            <div className=" max-w-7xl min-h-screen mx-auto p-6 ">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-500">Explore Our Classes</h2>

                {/* Filter Controls */}
                <div className="flex gap-4 mb-6 justify-between items-center">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search class by Course Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input input-bordered w-full max-w-xs focus:outline-none focus:border-pink-400"
                    />

                    {/* Price Filter */}
                    <div>
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="select w-full max-w-xs focus:outline-none focus:border-pink-400">
                            <option value="all">All Prices</option>
                            <option value="low">Low (≤ $50)</option>
                            <option value="medium">Medium ($51 - $100)</option>
                            <option value="high">High ($100+)</option>
                        </select>
                    </div>
                </div>

                {/* Classes */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {currentClasses.map(cls => (

                        <div key={cls._id} className="card bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">

                            <figure>
                                <img src={cls.image} alt={cls.name} className="h-52 w-full object-cover" />
                            </figure>

                            <div className="card-body">

                                <h2 className="text-xl font-semibold">{cls.name}</h2>

                                <div className="text-gray-600 flex items-center gap-2">
                                    <MdDescription />
                                    <strong>Description:</strong>
                                    <span>{cls.description}</span>
                                </div>

                                <div className="text-gray-600 flex items-center gap-2">
                                    <FaChalkboardTeacher />
                                    <strong>Instructor:</strong>
                                    <span>{cls.teacherName}</span>
                                </div>

                                <div className="text-gray-600 flex items-center gap-2">
                                    <MdEventAvailable />
                                    <strong>Available Seat:</strong>
                                    <span>${cls.seats}</span>
                                </div>

                                <div className='mb-3 flex justify-between'>
                                    <div className="text-gray-600 flex items-center gap-2">
                                        <IoPersonAdd />
                                        <strong>Enrolled:</strong>
                                        <span className=''>{cls.enrolled || 0}</span>
                                    </div>
                                    <div className="text-gray-600 flex items-center gap-2">
                                        <IoIosPricetags />
                                        <strong>Price:</strong>
                                        <span>{cls.price}</span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        to={`/classes/approved/${cls._id}`}
                                        className="btn btn-sm bg-blue-800 text-white hover:bg-blue-700"
                                    >
                                        Enroll Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-4 items-center">
                        <button
                            className="btn btn-sm bg-gray-200 hover:bg-gray-300"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button
                            className="btn btn-sm bg-gray-200 hover:bg-gray-300"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllClasses;
