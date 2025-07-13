

import { FaChalkboardTeacher, FaClock, FaCertificate, FaDollarSign } from 'react-icons/fa';

const reasons = [
    {
        icon: <FaChalkboardTeacher className="text-4xl text-blue-600" />,
        title: 'Expert Instructors',
        desc: 'Learn from industry professionals with real-world experience.',
    },
    {
        icon: <FaClock className="text-4xl text-green-600" />,
        title: 'Flexible Learning',
        desc: 'Access courses anytime, anywhere on your schedule.',
    },
    {
        icon: <FaCertificate className="text-4xl text-yellow-600" />,
        title: 'Certification',
        desc: 'Earn certificates that validate your skills and boost your resume.',
    },
    {
        icon: <FaDollarSign className="text-4xl text-pink-600" />,
        title: 'Affordable Pricing',
        desc: 'Quality education at a price that fits your budget.',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 text-gray-800">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-blue-700">
                    Why Choose <span className="text-pink-500">EduStation?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up" 
                            className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                        >
                            <div className="flex justify-center mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
