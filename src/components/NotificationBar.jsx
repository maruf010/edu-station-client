import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const NotificationBar = () => {
    const axiosSecure = useAxiosSecure();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false); // ✅ dropdown control
    const dropdownRef = useRef(null);

    // ✅ Step 1: সব assignment ফেচ করা
    const { data: assignments = [] } = useQuery({
        queryKey: ["assignments"],
        queryFn: async () => {
            const res = await axiosSecure.get("/assignments");
            return res.data;
        },
    });

    // ✅ Step 2: নতুন assignment এলে notification এ যোগ করা
    useEffect(() => {
        if (assignments.length > 0) {
            const newOnes = assignments.filter(
                (a) => !notifications.some((n) => n._id === a._id)
            );
            if (newOnes.length > 0) {
                setNotifications((prev) => [...prev, ...newOnes]);
            }
        }
    }, [assignments]);

    // ✅ Step 3: বাইরে ক্লিক করলে dropdown বন্ধ হবে
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <FaBell
                className={`text-2xl cursor-pointer ${
                    notifications.length > 0
                        ? "animate-bounce text-red-500"
                        : ""
                }`}
                onClick={() => setOpen((prev) => !prev)} // ✅ toggle
            />

            {/* Notification Count */}
            {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {notifications.length}
                </span>
            )}

            {/* Dropdown Box */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50">
                    {notifications.length === 0 ? (
                        <p className="p-2 text-gray-500 text-sm">
                            কোনো নতুন Assignment নেই
                        </p>
                    ) : (
                        notifications.map((n) => (
                            <Link
                                key={n._id}
                                to={`/dashboard/assignment/${n._id}`} // ✅ ওই Assignment details এ যাবে
                                className="block p-2 hover:bg-gray-100 text-sm"
                                onClick={() => {
                                    // ✅ Click করলে notification remove হবে
                                    setNotifications(
                                        notifications.filter(
                                            (item) => item._id !== n._id
                                        )
                                    );
                                    setOpen(false); // ✅ link এ গেলে dropdown বন্ধ হবে
                                }}
                            >
                                📘 {n.title}
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBar;
