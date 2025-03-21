import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../Services/api.js";

const ResetPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.resetPassword(email);
            setMessage(response.message); // Success message from API response
        } catch (error) {
            setMessage("Error sending password reset email.");
        }
    };

    const handleNavigateTologin = () => {
        navigate("/"); // Navigate to the login page
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-900 relative overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-indigo-800 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-800 rounded-full opacity-50 translate-x-1/2 translate-y-1/2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            <motion.div
                className="bg-indigo-900/80 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex overflow-hidden border border-indigo-800"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="w-full md:w-1/2 bg-indigo-800/30 backdrop-blur-md p-8 flex flex-col justify-between">
                    <motion.div
                        className="flex justify-end mb-8"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-white text-2xl font-semibold">CRM</h2>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="mt-4">
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 pl-4 border border-gray-300 rounded-lg shadow-inner text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                required
                            />
                        </motion.div>

                        <div className="flex justify-center mt-3">
                            <button
                                type="submit"
                                className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-600 active:scale-95"
                            >
                                Send
                            </button>
                        </div>
                    </form>

                    {message && <div className="text-center mt-4 text-white">{message}</div>}

                    <div className="text-center mt-4">
                        <button href="#" className=" hover:underline text-blue-400" onClick={handleNavigateTologin}>
                            Sign in
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordForm;