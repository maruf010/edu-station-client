import { useQuery } from "@tanstack/react-query";
import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../components/Shared/Loading";
import { useEffect } from "react";

const MiniRadialChart = ({ title, value, color }) => {
    const chartData = [
        { name: title, value: value || 0, fill: color || "#8884d8" },
    ];

    return (
        <div className="w-full h-40 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="30%"
                    outerRadius="80%"
                    barSize={15}
                    data={chartData}
                >
                    <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-2">{title}</p>
            <h4 className="text-lg font-bold">{value}</h4>
        </div>
    );
};

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

    // ✅ Prepare chart data for BarChart
    let barChartData = [];
    if (role === "admin") {
        barChartData = [
            { name: "Users", value: summary?.users || 0 },
            { name: "Classes", value: summary?.classes || 0 },
            { name: "Enrollments", value: summary?.enrollments || 0 },
            { name: "Teachers", value: summary?.teachers || 0 },
        ];
    } else if (role === "teacher") {
        barChartData = [
            { name: "My Classes", value: summary?.myClasses || 0 },
            { name: "My Students", value: summary?.myStudents || 0 },
            { name: "My Earnings", value: summary?.myEarnings || 0 },
        ];
    } else if (role === "student") {
        barChartData = [
            { name: "My Enrollments", value: summary?.myEnrollments || 0 },
            { name: "Amount Spent", value: summary?.mySpent || 0 },
        ];
    }

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-200">
            <h2 className="text-3xl font-bold mb-4 text-gray-500">Dashboard Overview</h2>
            <div className="bg-gradient-to-r from-slate-500 to-slate-800 p-4 rounded-lg shadow mt-10">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {barChartData.map((item, idx) => (
                        <MiniRadialChart
                            key={idx}
                            title={item.name}
                            value={item.value}
                            color={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][idx]}
                        />
                    ))}
                </div>

                <h3 className="text-xl font-semibold my-4 text-gray-200">
                    Analytics Overview (Comparison)
                </h3>

                {/* ✅ Big BarChart */}
                <div className="w-full h-80 bg-white p-4 rounded-xl shadow">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
