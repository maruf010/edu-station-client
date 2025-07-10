import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import reactLogo from '../../assets/react.svg';
import useAxios from '../../hooks/useAxios';
import Loading from '../../components/Shared/Loading';

const PerformanceStats = () => {
    const axiosInstance = useAxios();
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['performance-stats'],
        queryFn: async () => {
            const res = await axiosInstance.get('/stats/summary');
            return res.data;
        }
    });

    if (isLoading) return <Loading />;
    if (error) return <p className="text-center text-red-500 py-6">Failed to load performance stats.</p>;

    const statList = [
        { label: 'Users', value: stats?.users || 0 },
        { label: 'Classes', value: stats?.classes || 0 },
        { label: 'Enrollments', value: stats?.enrollments || 0 },
        { label: 'Teachers', value: stats?.teachers || 0 },
    ];

    return (
        <section ref={ref} className="py-16 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
                {/* Left Info */}
                <div className="lg:w-1/2" data-aos="fade-right" data-aos-offset="300">
                    <h2 className="text-4xl font-extrabold mb-4">
                        Outstanding And <br /> Blazing Performance.
                    </h2>
                    <p className="text-lg text-gray-500 mb-6">
                        Speed up your learning with blazing-fast and data-driven performance.
                    </p>
                    <div className="flex items-center gap-4 text-gray-600">
                        <img src={reactLogo} alt="React Logo" className="h-8" />
                        <div>
                            Powered by <br />
                            <span className="text-red-500 font-semibold">React & MongoDB</span>
                        </div>
                    </div>
                </div>

                {/* Right Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-6 lg:w-1/2" data-aos="fade-left" data-aos-offset="300">
                    {statList.map((stat, idx) => (
                        <div key={idx} className="bg-[#1e293b] p-6 rounded-xl text-center shadow-md">
                            <h3 className="text-3xl font-bold text-green-400">
                                {inView ? <CountUp end={stat.value} duration={2} /> : '0'}+
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
