
import { FaCamera, FaHeadphones, FaBrain, FaLaptopCode, FaGuitar, FaBook } from "react-icons/fa";

const skills = [
    { name: "Filmmaking", icon: <FaCamera />, color: "bg-cyan-400" },
    { name: "Graphic & Web Design", icon: <FaHeadphones />, color: "bg-green-500" },
    { name: "Logical Thinking", icon: <FaBrain />, color: "bg-blue-500" },
    { name: "Programming Courses", icon: <FaLaptopCode />, color: "bg-yellow-400" },
    { name: "Social Media Management", icon: <FaGuitar />, color: "bg-pink-400" },
    { name: "Software Training", icon: <FaBook />, color: "bg-sky-400" },
];

const YouCanLearn = () => {
    return (
        <section className="py-16  text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">YOU CAN LEARN</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-11/12 mx-auto px-4">
                {skills.map((skill, idx) => (
                    <div
                        key={idx}
                        className={`rounded-lg p-6 flex flex-col items-center justify-center ${skill.color} 
  hover:-translate-y-3 hover:shadow-xl transition-all duration-300`}
                    >
                        <div className="text-4xl mb-3">{skill.icon}</div>
                        <p className="font-semibold">{skill.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default YouCanLearn;
