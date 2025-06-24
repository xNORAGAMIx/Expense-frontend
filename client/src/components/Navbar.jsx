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
    <nav className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-white hover:text-gray-200 group"
            >
              <div className="h-8 w-8 mr-2 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <FaReceipt className="text-[#7F56D9] text-lg" />
              </div>
              <span className="text-xl font-bold font-[Poppins]">
                Udhaari<span className="text-white">.com</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/groups"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaUsers className="mr-1 text-lg" />
                    Groups
                  </Link>
                  <Link
                    to="/profile"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaUserCircle className="mr-1 text-lg" />
                    You
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-[#7F56D9] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium flex items-center hover:shadow-md"
                  >
                    <FaSignOutAlt className="mr-1" />
                    Logout 
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-[#7F56D9]/50 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-[#7F56D9] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium hover:shadow-md"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-[#7F56D9]/50 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/groups"
                className="text-white hover:bg-[#7F56D9]/50 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <FaUsers className="mr-2" />
                Groups
              </Link>
              <Link
                to="/profile"
                className="text-white hover:bg-[#7F56D9]/50 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <FaUserCircle className="mr-2" />
                You
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-white hover:bg-[#7F56D9]/50 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-[#7F56D9]/50 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:bg-[#7F56D9]/50 block px-3 py-2 rounded-md text-base font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
