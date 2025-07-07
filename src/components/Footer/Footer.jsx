// src/components/shared/Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaFax, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* About */}
                <div>
                    <h3 className="text-lg font-bold mb-4">ABOUT</h3>
                    <p className="text-sm text-gray-300 mb-4">
                        EduStation is an advanced learning platform helping students and teachers connect to grow skills across the world.
                    </p>
                    <Link
                        to="/allClasses"
                        className="inline-block border border-white px-4 py-2 mt-2 text-sm font-semibold hover:bg-white hover:text-gray-800 transition"
                    >
                        LEARNING NOW
                    </Link>
                </div>

                {/* Pages */}
                <div>
                    <h3 className="text-lg font-bold mb-4">PAGES</h3>
                    <ul className="text-sm space-y-2 text-gray-300">
                        <li><Link to="/allClasses" className="hover:underline">All Classes</Link></li>
                        <li><Link to="/teach" className="hover:underline">Teach on EduStation</Link></li>
                        <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                        <li><Link to="/pricing" className="hover:underline">Pricing Plans</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-bold mb-4">CONTACT</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1" /> Dhaka, Bangladesh</li>
                        <li className="flex items-center gap-2"><FaPhoneAlt /> +880 1234 567 890</li>
                        <li className="flex items-center gap-2"><FaFax /> +880 9876 543 210</li>
                        <li className="flex items-center gap-2"><FaEnvelope /> support@edustation.com</li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-lg font-bold mb-4">SOCIAL NETWORK</h3>
                    <div className="flex items-center gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition">
                            <FaFacebookF />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-300 transition">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center hover:bg-pink-400 transition">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="text-center text-sm text-gray-400 mt-10">
                © {new Date().getFullYear()} EduStation. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
