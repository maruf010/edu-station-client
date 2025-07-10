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
    { name: "programming Hero", logo: programmingHero },
    { name: "Robi 10 minutes", logo: minutes },
    { name: "bdJobs", logo: bdJobs },
];

const Partners = () => {
    return (
        <section className="py-10 lg:py-20 ">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-10">
                    Trusted by <span className="text-pink-500">Global Learning Partners</span> 
                </h2>

                <Marquee
                    gradient={false}
                    speed={50}
                    pauseOnHover={true}
                    className="flex gap-12"
                >
                    {partners.map((partner, i) => (
                        <div key={i} className="mx-10 flex flex-col items-center">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="mb-2 h-16 w-auto object-contain"
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
