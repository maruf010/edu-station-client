import React from 'react';
import Slider from 'react-slick';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router'; // ✅ corrected: react-router-dom instead of react-router
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';

const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
};

const PopularClasses = () => {
    const axiosInstance = useAxios();

    const { data: approvedClasses = [], isLoading, error } = useQuery({
        queryKey: ['approvedClasses'],
        queryFn: async () => {
            const res = await axiosInstance.get('/classes/approved');
            return res.data;
        }
    });
    console.log(approvedClasses);

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center py-6">Failed to load popular classes.</p>;

    // Top 3 by enrolled
    const popularClasses = [...approvedClasses]
        .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
        .slice(0, 4);

    const showSlider = popularClasses.length > 2;

    return (
        <section className="py-8 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    className="text-blue-500 uppercase text-3xl font-bold mb-8 lg:mb-14 text-center">
                    Popular <span className='text-pink-500'>Classes</span>
                </h2>

                {showSlider ? (
                    <Slider {...sliderSettings}>
                        {popularClasses.map((cls) => (
                            <div key={cls._id} className="px-4">
                                <ClassCard cls={cls} />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className={` grid grid-cols-1 sm:grid-cols-${popularClasses.length} gap-6`}>
                        {popularClasses.map((cls) => (
                            <ClassCard key={cls._id} cls={cls} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const ClassCard = ({ cls }) => (
    <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="bg-white rounded shadow hover:shadow-lg transition duration-300">
        <img src={cls.image} alt={cls.name} className="w-full h-48 object-cover rounded-t" />
        <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{cls.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Instructor: {cls.teacherName}</p>
            <p className="text-sm text-gray-600 mb-1">Price: <span className="text-primary font-medium">${cls.price}</span></p>
            <p className="text-sm text-gray-600 mb-1">Seats: <span className="font-semibold">{cls.seats || 0}</span></p>
            <p className="text-sm text-gray-600 mb-4">Enrollment: <span className="font-semibold">{cls.enrolled || 0}</span></p>

            <Link to={`/classes/approved/${cls._id}`} className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 w-full">
                Enroll
            </Link>
        </div>
    </div>
);

export default PopularClasses;
