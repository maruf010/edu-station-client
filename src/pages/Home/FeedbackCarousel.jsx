import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { FaQuoteLeft } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";


// const settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//         {
//             breakpoint: 1024,
//             settings: { slidesToShow: 2 },
//         },
//         {
//             breakpoint: 640,
//             settings: { slidesToShow: 1 },
//         },
//     ],
// };

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
    // Inside FeedbackCarousel component after fetching feedbacks
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
                                <p className="text-gray-700 text-base italic mb-6 mt-4">"{fb.feedback}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <img
                                        src={fb.studentImage}
                                        alt={fb.studentName}
                                        className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
                                    />
                                    <div className="text-left">
                                        <h4 className="text-md font-bold text-blue-600">{fb.studentName}</h4>
                                        <p className="text-sm text-gray-500">{fb.className}</p>
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
