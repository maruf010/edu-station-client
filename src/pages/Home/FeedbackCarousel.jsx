// src/components/Home/FeedbackCarousel.jsx
import Slider from 'react-slick';
import { FaQuoteLeft } from 'react-icons/fa';

const feedbacks = [
    {
        text: "This platform helped me land my first tech job! The teacher was very helpful.",
        name: "Sadia Ahmed",
        image: "https://i.ibb.co/4YBKVHZ/avatar1.jpg",
        classTitle: "React Frontend Bootcamp",
    },
    {
        text: "The best class I’ve ever taken online! Really changed how I learn.",
        name: "Tanvir Hossain",
        image: "https://i.ibb.co/g7dCZp1/avatar2.jpg",
        classTitle: "Mastering JavaScript",
    },
    {
        text: "I liked the personalized attention and useful assignments from our instructor.",
        name: "Rafiul Islam",
        image: "https://i.ibb.co/ZdF7nQ2/avatar3.jpg",
        classTitle: "UI/UX Design Masterclass",
    },
    {
        text: "Great course content and the teacher helped me understand the basics very clearly.",
        name: "Tania Rahman",
        image: "https://i.ibb.co/4YBKVHZ/avatar1.jpg",
        classTitle: "Fullstack Development",
    },
    {
        text: "I love how interactive and fun the class was. Amazing experience!",
        name: "Arif Khan",
        image: "https://i.ibb.co/g7dCZp1/avatar2.jpg",
        classTitle: "Digital Marketing 101",
    },
];

const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024, // below lg
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 640, // below md
            settings: {
                slidesToShow: 1,
            },
        },
    ],
};

const FeedbackCarousel = () => {
    return (
        <section className="bg-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-10">
                    What Our Students Say
                </h2>

                <Slider {...settings}>
                    {feedbacks.map((fb, index) => (
                        <div key={index} className="px-4 h-full">
                            <div className="bg-white p-6 rounded-lg shadow-md relative h-full flex flex-col justify-between">
                                <FaQuoteLeft className="absolute top-4 left-4 text-3xl text-blue-300 opacity-40" />
                                <p className="text-gray-700 text-base italic mb-6 mt-4">"{fb.text}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <img
                                        src={fb.image}
                                        alt={fb.name}
                                        className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
                                    />
                                    <div className="text-left">
                                        <h4 className="text-md font-bold text-blue-600">{fb.name}</h4>
                                        <p className="text-sm text-gray-500">{fb.classTitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default FeedbackCarousel;
