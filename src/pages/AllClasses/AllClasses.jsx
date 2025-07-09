import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';

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
        queryKey: ['approved-classes'],
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

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center py-6">Failed to load classes.</p>;

    return (
        <div className="max-w-7xl min-h-screen mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">Explore Our Classes</h2>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search class by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                />

                {/* Price Filter */}
                <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                >
                    <option value="all">All Prices</option>
                    <option value="low">Low (≤ $50)</option>
                    <option value="medium">Medium ($51 - $100)</option>
                    <option value="high">High ($100+)</option>
                </select>
            </div>

            {/* Classes */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentClasses.map(cls => (
                    <div key={cls._id} className="card bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition">
                        <figure>
                            <img src={cls.image} alt={cls.name} className="h-56 w-full object-cover" />
                        </figure>
                        <div className="card-body">
                            <h2 className="text-xl font-semibold">{cls.name}</h2>
                            <p className="text-gray-600 mb-1"><strong>Instructor:</strong> {cls.teacherName}</p>
                            <p className="text-gray-600 mb-1"><strong>Seats:</strong> {cls.seats}</p>
                            <p className="text-gray-600 mb-1"><strong>Price:</strong> ${cls.price}</p>
                            <p className="text-gray-600 mb-2"><strong>Enrolled:</strong> {cls.enrolled || 0}</p>

                            <div className="mt-auto">
                                <Link
                                    to={`/classes/approved/${cls._id}`}
                                    className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600"
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
    );
};

export default AllClasses;
