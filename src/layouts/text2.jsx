import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@mui/material";
import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Legend,
} from "recharts";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
import Loading from "../../components/Shared/Loading";
import { useEffect } from "react";

const SimpleRadialBarChart = ({ role, data }) => {
    let chartData = [];

    if (role === "admin") {
        chartData = [
            { name: "Users", value: data?.users || 0, fill: "#8884d8" },
            { name: "Classes", value: data?.classes || 0, fill: "#82ca9d" },
            { name: "Enrollments", value: data?.enrollments || 0, fill: "#ffc658" },
            { name: "Teachers", value: data?.teachers || 0, fill: "#ff8042" },
        ];
    } else if (role === "teacher") {
        chartData = [
            { name: "My Classes", value: data?.myClasses || 0, fill: "#8884d8" },
            { name: "My Students", value: data?.myStudents || 0, fill: "#82ca9d" },
            { name: "My Earnings", value: data?.myEarnings || 0, fill: "#ffc658" },
        ];
    } else if (role === "student") {
        chartData = [
            { name: "My Enrollments", value: data?.myEnrollments || 0, fill: "#8884d8" },
            { name: "Amount Spent", value: data?.mySpent || 0, fill: "#82ca9d" },
        ];
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={15}
                data={chartData}
            >
                <RadialBar
                    minAngle={15}
                    label={{ position: "insideStart", fill: "#fff" }}
                    background
                    clockWise
                    dataKey="value"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};

const DashboardHome = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { role } = useUserRole();


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


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

    if (isLoading)
        return <Loading></Loading>;

    return (
        <div className="p-6 space-y-6 bg-gray-200 min-h-screen">
            <h2 className="text-3xl font-bold mb-4 text-gray-500">Dashboard Overview</h2>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {role === "admin" && (
                    <>
                        <StatCard title="Users" value={summary?.users} color="bg-blue-100" />
                        <StatCard title="Classes" value={summary?.classes} color="bg-green-100" />
                        <StatCard title="Enrollments" value={summary?.enrollments} color="bg-[#dad7cd] " />
                        <StatCard title="Teachers" value={summary?.teachers} color="bg-purple-100" />
                    </>
                )}

                {role === "teacher" && (
                    <>
                        <StatCard title="My Classes" value={summary?.myClasses} color="bg-blue-100" />
                        <StatCard title="My Students" value={summary?.myStudents} color="bg-green-100" />
                        <StatCard
                            title="My Earnings"
                            value={`$${summary?.myEarnings?.toFixed(2)}`}
                            color="bg-yellow-100"
                        />
                    </>
                )}

                {role === "student" && (
                    <>
                        <StatCard
                            title="My Enrollments"
                            value={summary?.myEnrollments}
                            color="bg-blue-100"
                        />
                        <StatCard
                            title="Amount Spent"
                            value={`$${summary?.mySpent?.toFixed(2)}`}
                            color="bg-green-100"
                        />
                    </>
                )}
            </div>

            <div className="bg-linear-65 from-[#669bbc] to-[#03045e] p-4 rounded-lg shadow mt-10">
                <h3 className="text-xl font-semibold mb-4">Analytics Overview</h3>
                <SimpleRadialBarChart role={role} data={summary} />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    return (
        <div
            className={`rounded-lg shadow-sm ${color} p-6 text-center flex flex-col items-center justify-center`}
        >
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <h4 className="text-2xl text-blue-950 font-bold">{value}</h4>
        </div>
    );
};

export default DashboardHome;
