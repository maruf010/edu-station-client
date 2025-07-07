// components/PerformanceStats.jsx
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import reactLogo from '../../assets/react.svg'

const stats = [
    { label: 'Users', value: 450 },
    { label: 'Classes', value: 120 },
    { label: 'Enrollments', value: 250 },
    { label: 'SEO', value: 97 },
];

const PerformanceStats = () => {
    const { ref, inView } = useInView({
        triggerOnce: true, // only animate once
        threshold: 0.3,     // trigger when 30% of the section is visible
    });

    return (
        <section
            ref={ref}
            className=" py-16 px-6 lg:px-20"
        >
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
                {/* Left */}
                <div className="lg:w-1/2">
                    <h2 className="text-4xl font-extrabold mb-4">
                        Outstanding And <br /> Blazing Performance.
                    </h2>
                    <p className="text-lg text-gray-500 mb-6">
                        Speed up your sales: Leave your competitors behind with lightning-fast performance.
                    </p>
                    <div className="flex items-center gap-4 text-gray-600">
                        <div>
                            <img
                                src={reactLogo}
                                alt="PageSpeed Logo"
                                className="h-8"
                            />
                        </div>
                        <div className="text-gray-400">
                            PageSpeed Insights
                            <h3 className="text-red-500 font-semibold">Powered by{' '} React</h3>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-6 lg:w-1/2">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-[#1e293b] p-6 rounded-xl text-center shadow-md"
                        >
                            <h3 className="text-3xl font-bold text-green-400">
                                {inView ? <CountUp end={stat.value} duration={3} /> : '0'}+
                            </h3>
                            <p className="mt-2 text-white">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PerformanceStats;
