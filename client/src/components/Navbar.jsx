import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { resetGroups } from "../features/groups/groupSlice";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
  FaReceipt,
} from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      dispatch(logout());
      dispatch(resetGroups());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/30 dark:bg-[#1B1C1E]/90 border-b border-white/10 dark:border-white/10 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center font-[Poppins] text-xl font-semibold text-[#1B1C1E] dark:text-white"
          >
            <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center mr-2 shadow-sm">
              <FaReceipt className="text-[#3EB489] text-lg" />
            </div>
            Udhaari
            <span className="text-[#3EB489] dark:text-[#A5F3A1]">.com</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/groups"
                  className="px-4 py-2 text-sm font-medium text-[#1B1C1E] dark:text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition"
                >
                  <div className="flex items-center gap-2">
                    <FaUsers /> Groups
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-[#1B1C1E] dark:text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition"
                >
                  <div className="flex items-center gap-2">
                    <FaUserCircle /> You
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium bg-white text-[#3EB489] hover:bg-gray-100 rounded-xl shadow-sm flex items-center gap-2 transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-[#1B1C1E] dark:text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-white text-[#3EB489] hover:bg-gray-100 rounded-xl shadow-sm transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-white dark:text-white focus:outline-none"
              aria-label="Menu"
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                menu.classList.toggle("hidden");
              }}
            >
              <svg
                className="h-6 w-6 text-[#3EB489] dark:text-[#A5F3A1]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden hidden px-4 pb-4 pt-2 space-y-2" id="mobile-menu">
        {isAuthenticated ? (
          <>
            <Link
              to="/groups"
              className="block px-4 py-2 text-white bg-[#3EB489]/20 dark:bg-[#A5F3A1]/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaUsers /> Groups
              </div>
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-white bg-[#3EB489]/20 dark:bg-[#A5F3A1]/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaUserCircle /> You
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-white bg-[#3EB489]/20 dark:bg-[#A5F3A1]/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaSignOutAlt /> Logout
              </div>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block px-4 py-2 text-white bg-[#3EB489]/20 dark:bg-[#A5F3A1]/20 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 text-white bg-[#3EB489]/20 dark:bg-[#A5F3A1]/20 rounded-lg"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
