import React, { useState, useEffect } from "react";

import { useLocation } from "react-router";
import toast from "react-hot-toast";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = () => {
    const location = useLocation();
    const [email, setEmail] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const prefilledEmail = params.get("email");
        if (prefilledEmail) setEmail(prefilledEmail);
    }, [location]);

    const handleReset = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent!");
            window.open("https://mail.google.com", "_blank");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                <form onSubmit={handleReset}>
                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input input-bordered w-full mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn w-full bg-pink-500 text-white">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
