import {
    FaCamera,
    FaHeadphones,
    FaBrain,
    FaLaptopCode,
    FaGuitar,
    FaBook,
} from "react-icons/fa";
import { Link } from "react-router";

const skills = [
    {
        name: "Graphic & Web Design",
        icon: <FaHeadphones />,
        color: "from-green-400 to-emerald-500",
        description: "Master creative design skills using tools like Photoshop, Illustrator, and Figma to build beautiful websites and visuals.",
    },
    {
        name: "Logical Thinking",
        icon: <FaBrain />,
        color: "from-blue-400 to-indigo-500",
        description: "Enhance your problem-solving ability with structured reasoning, pattern recognition, and critical thinking exercises.",
    },
    {
        name: "Programming Courses",
        icon: <FaLaptopCode />,
        color: "from-yellow-400 to-orange-400",
        description: "Get hands-on coding experience with modern programming languages like JavaScript, Python, and more.",
    },
    {
        name: "Software Training",
        icon: <FaBook />,
        color: "from-sky-400 to-blue-400",
        description: "Become proficient in using professional tools like MS Office, Canva, and others to boost productivity.",
    },
];


const YouCanLearn = () => {
    return (
        <section className="py-8 lg:py-12 text-center lg:max-w-7xl lg:mx-auto">
            <h2 
            data-aos="fade-left"

            className="text-3xl md:text-4xl font-bold mb-8 lg:mb-16 text-blue-500">
                YOU <span className="text-pink-500">CAN LEARN</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8  mx-auto px-4">
                {skills.map((skill, idx) => (
                    <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden p-6 bg-white shadow-md hover:shadow-2xl transform  duration-300 hover:scale-105 transition`}
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        {/* Arc Background */}
                        <div
                            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${skill.color} rounded-bl-full z-0`}
                        ></div>

                        {/* Icon */}
                        <div className="relative z-10 text-4xl mb-4 text-gray-800 transition-transform duration-300 group-hover:scale-110">
                            {skill.icon}
                        </div>

                        {/* Title */}
                        <h3 className="relative z-10 font-semibold text-lg mb-2">{skill.name}</h3>

                        {/* Placeholder text */}
                        <p className="relative z-10 text-sm text-gray-600 mb-4">
                            {skill.description}
                        </p>


                        {/* Read More Button */}
                        <Link to='/allClasses'>
                            <button className="relative z-10 mt-auto inline-block text-white text-sm font-medium px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:opacity-90 transition-opacity duration-300 cursor-pointer">
                                Read More
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default YouCanLearn;
