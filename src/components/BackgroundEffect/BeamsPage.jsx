import React from "react";
import { motion } from "framer-motion";

const BeamsPage = () => {
    const particleCount = 50;

    return (
        <>
            {/* 🌈 Animated Beams */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(particleCount)].map((_, i) => {
                    const size = Math.floor(Math.random() * 30) + 10; // 10px to 30px
                    const colorClasses = [
                        "bg-pink-500",
                        "bg-blue-500",
                        "bg-purple-500",
                        "bg-yellow-400",
                        "bg-emerald-400",
                        "bg-indigo-500",
                    ];
                    const color = colorClasses[i % colorClasses.length];
                    const left = Math.random() * 100;
                    const top = Math.random() * 100;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 0, scale: 1 }}
                            animate={{
                                y: [0, -20, 20, 0],
                                x: [0, -10, 10, 0],
                                rotate: [0, 15, -15, 0],
                                opacity: [0.2, 0.4, 0.2],
                                scale: [1, 1.1, 0.9, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 6 + Math.random() * 4,
                                delay: Math.random() * 4,
                                ease: "easeInOut",
                            }}
                            className={`absolute ${color} rounded-md opacity-30`}
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${left}%`,
                                top: `${top}%`,
                                zIndex: -1,
                                filter: "blur(0.5px)",
                            }}
                        />
                    );
                })}
            </div>

        </>
    );
};

export default BeamsPage;
