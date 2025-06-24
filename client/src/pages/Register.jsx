import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { registerUser } from "../api/authAPI";
import { FaUser, FaEnvelope, FaLock, FaGithub, FaGoogle, FaReceipt } from "react-icons/fa";

const Register = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7F56D9] to-[#9333EA] flex items-center justify-center shadow-lg hover:rotate-12 transition-transform">
            <FaReceipt className="text-white text-3xl" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-[#111827] font-[Poppins]">
          Shuru karo apni journey on <span className="text-[#7F56D9]">Udhaari.com</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-[DM Sans]">
          Already part of the udhaari gang?{" "}
          <Link
            to="/login"
            className="font-medium text-[#7F56D9] hover:text-[#9333EA] transition-colors"
          >
            Login yahan karo
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-[#F97316] p-4 rounded">
              <div className="flex items-center">
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
                <p className="ml-3 text-sm text-[#111827] font-[DM Sans]">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#111827] font-[DM Sans]">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] sm:text-sm font-[DM Sans]"
                  placeholder="Bade Bhai Sahab"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111827] font-[DM Sans]">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] sm:text-sm font-[DM Sans]"
                  placeholder="badebhaisahab@udhaar.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111827] font-[DM Sans]">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] sm:text-sm font-[DM Sans]"
                  placeholder="p@sswordMatBhulna"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 font-[DM Sans]">
                8+ characters. Thoda tough banalo, udhaari serious hai.
              </p>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#7F56D9] focus:ring-[#7F56D9] border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-[#111827] font-[DM Sans]">
                I accept the{" "}
                <Link to="/terms" className="text-[#7F56D9] hover:text-[#9333EA]">
                  Terms
                </Link>{" "}
                &{" "}
                <Link to="/privacy" className="text-[#7F56D9] hover:text-[#9333EA]">
                  Privacy
                </Link>{" "}
                
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#7F56D9] to-[#9333EA] hover:from-[#9333EA] hover:to-[#7F56D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F56D9] transition-all duration-300 ${
                  isLoading ? "opacity-80 cursor-not-allowed" : ""
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Thoda ruk ja... ho raha hai
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-[DM Sans]">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaGithub className="h-5 w-5" />
                <span className="ml-2 font-[DM Sans]">GitHub</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="h-5 w-5" />
                <span className="ml-2 font-[DM Sans]">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
