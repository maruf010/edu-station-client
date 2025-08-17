import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";


const Contact = () => {
    const axiosInstance = useAxios();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const res = await axiosInstance.post("/api/contact", formData);

            if (res.data.success) {
                setStatus("✅ Message sent successfully!");
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                setStatus("❌ Failed to send message");
            }
        } catch (err) {
            console.error(err);
            setStatus("❌ Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4 ">
            <div className="w-full max-w-7xl shadow-lg border border-gray-200 rounded-2xl p-6 lg:p-12 ">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-blue-900">
                        Subscribe <span className="text-orange-500">Newsletter</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        We’d love to hear from you! Fill out the form below and we’ll get back to you soon.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-blue-900 tracking-wider">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600">
                            Have questions, feedback, or business inquiries?
                            Use the form or reach out directly via email or phone.
                        </p>

                        <div className="space-y-4 text-gray-700">
                            <p className="flex items-center gap-3">
                                <FaUser className="text-blue-800" /> <span>Our Support Team</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-800" /> <span>support@example.com</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <FaPhone className="text-blue-800" /> <span>+880 1234 567890</span>
                            </p>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                            <span className="px-3 text-gray-500">
                                <FaUser />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full p-3 outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                            <span className="px-3 text-gray-500">
                                <FaEnvelope />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full p-3 outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                            <span className="px-3 text-gray-500">
                                <FaPhone />
                            </span>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full p-3 outline-none"
                            />
                        </div>

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            rows="5"
                            className="w-full border rounded-lg p-3 shadow-sm outline-none"
                            required
                        ></textarea>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg hover:opacity-90 transition-all shadow-md"
                        >
                            <FaPaperPlane /> Send Message
                        </button>

                        {status && (
                            <p className="mt-3 text-center font-medium text-gray-700">
                                {status}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
