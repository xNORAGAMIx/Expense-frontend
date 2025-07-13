import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { loginUser } from "../api/authAPI";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  FaReceipt,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      const { token, email: userEmail } = response.data;

      dispatch(loginSuccess({ email: userEmail, token }));

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", userEmail);
      } else {
        sessionStorage.setItem("token", token);
      }

      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Galat email ya password. Dobara try karo!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] font-[DM Sans] text-[#1B1C1E] dark:text-white overflow-hidden flex items-center justify-center px-4">
      {/* Blurred Gradient Backgrounds */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] flex items-center justify-center shadow-lg hover:rotate-12 transition-transform">
            <FaReceipt className="text-white text-3xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold font-[Poppins]">
          Welcome back to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#10B981]">
            Udhaari.com
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#22C55E] hover:text-[#16A34A] transition"
          >
            Sign up
          </Link>
        </p>

        {/* Form Container */}
        <div className="mt-8 bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8">
          {error && (
            <div className="mb-4 bg-red-100/50 dark:bg-red-500/10 border-l-4 border-[#F97316] p-4 rounded">
              <div className="flex items-center gap-2 text-sm text-[#111827] dark:text-white">
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
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#22C55E] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="chaiwala@friendcircle.com"
                  required
                />
              </div>
            </div>

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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#22C55E] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="p@sswordMatBhulna"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#22C55E] rounded focus:ring-[#22C55E]"
                />
                Remember Me!
              </label>
              <Link
                to="/otp"
                className="text-[#22C55E] hover:text-[#16A34A] font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>

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
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
