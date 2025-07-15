// src/components/Home/Partners.jsx
import React from 'react';
import Marquee from 'react-fast-marquee';

import courseraLogo from '../../assets/Coursera-Logo.jpg';
import googleLogo from '../../assets/images.png';
import eduReka from '../../assets/edureka.jpeg';
import programmingHero from '../../assets/programminghero_logo.jpeg';
import minutes from '../../assets/10minutes.jpg';
import bdJobs from '../../assets/bdJobs.jpeg';

const partners = [
    { name: "Coursera", logo: courseraLogo },
    { name: "Google", logo: googleLogo },
    { name: "edureka", logo: eduReka },
    { name: "bdJobs", logo: bdJobs },
    { name: "programming Hero", logo: programmingHero },
    { name: "Robi 10 minutes", logo: minutes },
];

const Partners = () => {
    return (
        <section className="py-12 lg:py-24 ">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    className="text-2xl md:text-3xl font-bold text-blue-600 mb-8 lg:mb-12 uppercase">
                    Trusted by <span className="text-pink-500" >Global Learning Partners</span>
                </h2>

                <Marquee
                    gradient={false}
                    speed={80}
                    pauseOnHover={true}
                    className="flex gap-5 lg:gap-12"
                >
                    {partners.map((partner, i) => (
                        <div key={i} className="mx-10 flex flex-col items-center p-5 hover:shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className=" h-16 w-auto object-contain"
                            />
                            <p className="text-sm text-gray-600">{partner.name}</p>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default Partners;
