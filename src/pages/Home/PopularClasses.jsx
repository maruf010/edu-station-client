// src/components/Home/PopularClasses.jsx
import React from 'react';
import Slider from 'react-slick';

const popularClasses = [
    {
        id: 1,
        title: "React Bootcamp",
        teacher: "Rafiul Islam",
        image: "https://i.ibb.co/nP10MCH/course1.jpg",
        price: "$59",
        enrolled: 102,
    },
    {
        id: 2,
        title: "UI/UX Design Masterclass",
        teacher: "Tania Rahman",
        image: "https://i.ibb.co/yphD2S7/course2.jpg",
        price: "$45",
        enrolled: 87,
    },
    {
        id: 3,
        title: "Python for Beginners",
        teacher: "Sadia Ahmed",
        image: "https://i.ibb.co/YcbpdYR/course3.jpg",
        price: "$39",
        enrolled: 120,
    },
    {
        id: 4,
        title: "Advanced JavaScript",
        teacher: "Tanvir Hossain",
        image: "https://i.ibb.co/7gzYdh6/course4.jpg",
        price: "$49",
        enrolled: 95,
    },
];

const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
};

const PopularClasses = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Popular Classes
                </h2>
                <Slider {...settings}>
                    {popularClasses.map((cls) => (
                        <div key={cls.id} className="px-4">
                            <div className="bg-white rounded shadow hover:shadow-lg transition duration-300">
                                <img
                                    src={cls.image}
                                    alt={cls.title}
                                    className="w-full h-48 object-cover rounded-t"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{cls.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">Instructor: {cls.teacher}</p>
                                    <p className="text-sm text-gray-600 mb-2">Price: <span className="text-primary font-medium">{cls.price}</span></p>
                                    <p className="text-sm text-gray-600">Enrollment: <span className="font-semibold">{cls.enrolled}</span> students</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default PopularClasses;
