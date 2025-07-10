import { loadFull } from "tsparticles";
import { useCallback } from "react";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: false,
                background: { color: { value: "#f9fafb" } }, // Light background
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: { opacity: 1 },
                        },
                        repulse: { distance: 100, duration: 0.4 },
                    },
                },
                particles: {
                    color: {
                        value: [
                            "#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D",
                            "#FF6EC7", "#8E44AD", "#00CEC9", "#E84393"
                        ], // 💥 colorful particles
                    },
                    links: {
                        color: "#ccc",
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        outModes: { default: "bounce" },
                    },
                    number: {
                        density: { enable: true, area: 800 },
                        value: 60,
                    },
                    opacity: {
                        value: 0.7,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 2, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticlesBackground;
