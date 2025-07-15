import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { FaQuoteLeft } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const FeedbackCarousel = () => {
    const axiosSecure = useAxiosSecure();

    const { data: feedbacks = [], isLoading } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: async () => {
            const res = await axiosSecure.get("/feedbacks");
            return res.data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-10 text-lg font-semibold">Loading feedback...</div>;
    }

    if (feedbacks.length === 0) {
        return <div className="text-center py-10 text-lg font-semibold">No feedback available yet.</div>;
    }

    const slidesToShow = feedbacks.length >= 3 ? 3 : feedbacks.length || 1;

    const settings = {
        dots: true,
        infinite: feedbacks.length > slidesToShow,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: feedbacks.length >= 2 ? 2 : 1,
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

    return (
        <section className="py-16">
            <h2
                data-aos="fade-up"
                data-aos-duration="1000"
                className="uppercase text-center text-2xl md:text-3xl font-bold text-blue-700 mb-10">
                What Our <span className="text-pink-500">Students Say</span>
            </h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <Slider {...settings}>
                    {feedbacks.map((fb, index) => (
                        <div key={index} className="px-4 py-5 h-64" data-aos="fade-up"
                            data-aos-duration="1000">
                            <div className="bg-white p-6 rounded-lg relative h-full shadow-md border border-gray-200">
                                <FaQuoteLeft className="absolute top-4 left-4 text-3xl text-blue-300 opacity-40" />
                                <div className="h-8 mb-2">
                                    <p className="text-gray-700 italic">"{fb.feedback}"</p>
                                </div>

                                <div className="my-3 flex gap-2">
                                    <StarRatings
                                        rating={fb.rating}
                                        starRatedColor="#facc15"
                                        numberOfStars={5}
                                        starDimension="20px"
                                        starSpacing="2px"
                                        name="rating"
                                    />
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <img
                                        src={fb.studentImage}
                                        alt={fb.studentName}
                                        className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
                                    />
                                    <div className="text-left">
                                        <h4 className="text-md font-bold text-blue-600">{fb.studentName}</h4>
                                        <p className="text-md font-medium text-gray-600">{fb.className}</p>
                                        <h2 className="text-sm text-gray-400">{fb.assignmentTitle || ''}</h2>
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
