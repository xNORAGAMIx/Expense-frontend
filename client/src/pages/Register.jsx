import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { registerUser } from "../api/authAPI";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaReceipt,
} from "react-icons/fa";

const Register = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Oho! Email already registered lagta hai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] flex items-center justify-center relative font-[DM Sans] text-[#1B1C1E] dark:text-white px-4">
      {/* Blurred Background Gradient Orbs */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="max-w-md w-full z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] flex items-center justify-center shadow-lg hover:rotate-12 transition-transform">
            <FaReceipt className="text-white text-3xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold font-[Poppins]">
          Start your journey on{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#10B981]">
            Udhaari.com
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#22C55E] hover:text-[#16A34A] transition"
          >
            Login
          </Link>
        </p>

        {/* Form Card */}
        <div className="mt-8 bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8">
          {error && (
            <div className="mb-4 bg-red-100/50 dark:bg-red-500/10 border-l-4 border-[#F97316] p-4 rounded text-sm text-[#1B1C1E] dark:text-white flex items-center gap-2">
              <svg
                className="h-5 w-5 text-[#F97316]"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#22C55E] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="Bade Bhai Sahab"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#22C55E] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="badebhaisahab@udhaar.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#22C55E] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="p@sswordMatBhulna"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                8+ characters. Thoda tough banalo, udhaari serious hai.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-white text-sm font-semibold bg-gradient-to-r from-[#22C55E] to-[#10B981] hover:from-[#10B981] hover:to-[#22C55E] transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Please Wait...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
