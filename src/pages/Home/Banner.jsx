import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import animation1 from '../../assets/Animation1.json';
import animation2 from '../../assets/Animation2.json';
import animation3 from '../../assets/Animation3.json';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import Button from '../../components/Shared/Button';


const Banner = () => {
    return (
        <div className="py-4 md:py-0 px-4 md:px-8 lg:px-0">
            <div className="min-h-[calc(100vh-64px)] md:flex items-center justify-around gap-10 max-w-7xl mx-auto rounded-2xl">
                {/* Carousel Section */}
                <div className="md:w-[500px] w-full md:hidden">
                    <Carousel
                        autoPlay
                        infiniteLoop
                        interval={2500}
                        showThumbs={false}
                        showArrows={false}     // ✅ hides next/prev arrows
                        showStatus={false}     // ✅ hides index like "1/3"
                        emulateTouch
                        stopOnHover
                        showIndicators={true} // ✅ shows the dots
                    >
                        <div>
                            <Lottie animationData={animation1} loop style={{ height: '400px' }} />
                        </div>
                        <div>
                            <Lottie animationData={animation2} loop style={{ height: '400px' }} />
                        </div>
                        <div>
                            <Lottie animationData={animation3} loop style={{ height: '400px' }} />
                        </div>
                    </Carousel>
                </div>
                {/* Text Section */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                        Welcome to Our Learning Platform
                    </h1>
                    <p className="text-lg mb-8 text-gray-700">
                        Empowering your learning journey with innovative tools and resources.
                    </p>
                    <div data-aos="fade-up" data-aos-duration="1000" className="flex items-center justify-center md:justify-start space-x-4">
                        <Link to="/allClasses">
                            <Button label="Get Started" />
                        </Link>
                        <Link to="/allClasses">
                            <Button label="Our Courses" />
                        </Link>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="md:w-[400px] w-full hidden md:block">
                    <Carousel
                        autoPlay
                        infiniteLoop
                        interval={2500}
                        showThumbs={false}
                        showArrows={false}     // ✅ hides next/prev arrows
                        showStatus={false}     // ✅ hides index like "1/3"
                        emulateTouch
                        stopOnHover
                        showIndicators={true} // ✅ shows the dots
                    >
                        <div>
                            <Lottie animationData={animation1} loop style={{ height: '400px' }} />
                        </div>
                        <div>
                            <Lottie animationData={animation2} loop style={{ height: '400px' }} />
                        </div>
                        <div>
                            <Lottie animationData={animation3} loop style={{ height: '400px' }} />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Banner;
