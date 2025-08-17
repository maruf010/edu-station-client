import { useQuery } from "@tanstack/react-query";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    RadialBarChart,
    RadialBar,
} from "recharts";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../components/Shared/Loading";
import { useEffect } from "react";

const DashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { role } = useUserRole();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data: summary = {}, isLoading } = useQuery({
        queryKey: ["dashboard-summary", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/dashboard-summary?email=${user?.email}&role=${role}`
            );
            return res.data;
        },
        enabled: !!user?.email && !!role,
    });

    if (isLoading) return <Loading />;

    // ✅ Prepare data for charts
    const barChartData =
        role === "admin"
            ? [
                { name: "Users", value: summary?.users || 0 },
                { name: "Classes", value: summary?.classes || 0 },
                { name: "Enrollments", value: summary?.enrollments || 0 },
                { name: "Teachers", value: summary?.teachers || 0 },
            ]
            : role === "teacher"
                ? [
                    { name: "My Classes", value: summary?.myClasses || 0 },
                    { name: "My Students", value: summary?.myStudents || 0 },
                    { name: "My Earnings", value: summary?.myEarnings || 0 },
                ]
                : [
                    { name: "My Enrollments", value: summary?.myEnrollments || 0 },
                    { name: "Amount Spent", value: summary?.mySpent || 0 },
                ];

    const lineChartData = barChartData.map((d, i) => ({
        day: `Day ${i + 1}`,
        value: d.value,
    }));

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-200">
            <h2 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h2>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {barChartData.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-[#1e293b] p-6 rounded-xl shadow hover:shadow-lg transition"
                    >
                        <h3 className="text-sm text-gray-400">{item.name}</h3>
                        <p className="text-2xl font-bold text-cyan-400">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Middle Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
                {/* Line Chart */}
                <div className="bg-[#1e293b] p-6 rounded-xl shadow">
                    <h3 className="mb-4 text-lg font-semibold">Performance Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#06b6d4" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-[#1e293b] p-6 rounded-xl shadow">
                    <h3 className="mb-4 text-lg font-semibold">Comparison</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Radial Chart */}
                <div className="bg-[#1e293b] p-6 rounded-xl shadow">
                    <h3 className="mb-4 text-lg font-semibold">Progress</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="30%"
                            outerRadius="100%"
                            barSize={20}
                            data={barChartData}
                        >
                            <RadialBar
                                minAngle={15}
                                background
                                clockWise
                                dataKey="value"
                                label={{ fill: "#fff", position: "insideStart" }}
                            />
                            <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
