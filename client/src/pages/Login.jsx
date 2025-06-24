import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { loginUser } from "../api/authAPI";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { FaReceipt, FaLock, FaEnvelope, FaGithub, FaGoogle } from "react-icons/fa";

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      dispatch(loginSuccess({ email: response.data.email, token: response.data.token }));
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Galat email ya password. Dobara try karo!");
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
          Welcome back to <span className="text-[#7F56D9]">Udhaari.com</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-[DM Sans]">
          Kya udhaari chukta karne ka time aa gaya?{" "}
          <Link
            to="/register"
            className="font-medium text-[#7F56D9] hover:text-[#9333EA] transition-colors"
          >
            Sign up karo, dosti banao
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
                  viewBox="0 0 20 20"
                  fill="currentColor"
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

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#111827] font-[DM Sans]"
              >
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] sm:text-sm font-[DM Sans]"
                  placeholder="chaiwala@friendcircle.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#111827] font-[DM Sans]"
              >
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] sm:text-sm font-[DM Sans]"
                  placeholder="p@sswordMatBhulna"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#7F56D9] focus:ring-[#7F56D9] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[#111827] font-[DM Sans]"
                >
                 Remember Me!
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/otp"
                  className="font-medium text-[#7F56D9] hover:text-[#9333EA] transition-colors font-[DM Sans]"
                >
                  Forgot Password?
                </Link>
              </div>
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
                    Udhaari dekh rahe hain...
                  </>
                ) : (
                  "Login"
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
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaGithub className="h-5 w-5" />
                  <span className="ml-2 font-[DM Sans]">GitHub</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="h-5 w-5" />
                  <span className="ml-2 font-[DM Sans]">Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
